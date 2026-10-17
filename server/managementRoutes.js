import { randomBytes } from "node:crypto";
import { hashPassword } from "./password.js";
import { pool } from "./db.js";
import { ApiError, route, requireOwner, requirePermission, transaction, text, id, age, choice, ownUnit, permissionNames } from "./access.js";

export function registerManagementRoutes(app) {
  app.post('/api/profile/bio', route(async (req,res) => {
    const bio = req.body?.bio;
    if (typeof bio !== 'string' || bio.length > 500) throw new ApiError(400,'Bio must be at most 500 characters');
    const result = await pool.query('UPDATE public.soldiers SET bio=$1 WHERE army_id=$2 AND id=$3 RETURNING bio', [bio.trim(),req.user.armyId,req.user.soldierId]);
    if (!result.rows[0]) throw new ApiError(404,'Soldier not found');
    res.json(result.rows[0]);
  }));
  app.post('/api/soldiers/:id/profile', requirePermission('soldiers.edit'), route(async (req,res) => {
    const soldierId=id(Number(req.params.id));
    const body=req.body??{};
    const name=text(body.name,'Name');
    const rank=text(body.rank,'Rank');
    const specialization=text(body.specialization,'Specialization');
    const status=choice(body.status,['Active','Wounded','Reserve']);
    const soldierAge=age(body.age);
    const updated=await pool.query(`UPDATE public.soldiers SET name=$1,rank=$2,specialization=$3,status=$4,age=$5
      WHERE army_id=$6 AND id=$7 RETURNING id`,[name,rank,specialization,status,soldierAge,req.user.armyId,soldierId]);
    if(!updated.rows[0]) throw new ApiError(404,'Soldier not found');
    res.json({message:'Profile updated'});
  }));
  app.post("/api/soldiers", requirePermission('soldiers.create'), route(async (req, res) => {
    const body = req.body ?? {};
    const name = text(body.name, 'Name');
    const rank = text(body.rank, 'Rank');
    const specialization = text(body.specialization, 'Specialization');
    const status = choice(body.status, ['Active', 'Wounded', 'Reserve']);
    const soldierAge = age(body.age);
    const username = text(body.username, 'Username', 60);
    const unitId = body.unitId === null || body.unitId === undefined ? null : id(body.unitId);
    if (body.role !== undefined || body.permissions !== undefined || body.armyId !== undefined || body.army_id !== undefined) throw new ApiError(400, 'Role, permissions and army are assigned by the server');
    const temporaryPassword = randomBytes(18).toString('base64url');
    const passwordHash = await hashPassword(temporaryPassword);
    const result = await transaction(async client => {
      await ownUnit(client, req.user.armyId, unitId);
      const soldier = await client.query(`INSERT INTO public.soldiers (army_id, unit_id, name, rank, status, specialization, age)
        VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`, [req.user.armyId, unitId, name, rank, status, specialization, soldierAge]);
      const user = await client.query(`INSERT INTO public.users (army_id, soldier_id, username, password_hash, role, must_change_password)
        VALUES ($1,$2,$3,$4,'soldier',true) RETURNING id`, [req.user.armyId, soldier.rows[0].id, username, passwordHash]);
      return { soldierId: soldier.rows[0].id, userId: user.rows[0].id };
    });
    res.status(201).json({ ...result, username, temporaryPassword });
  }));

  app.post('/api/units', requirePermission('units.edit'), route(async (req, res) => {
    const body = req.body ?? {};
    if (body.armyId !== undefined || body.army_id !== undefined) throw new ApiError(400, 'Army is assigned by the server');
    const name = text(body.name, 'Name');
    const specialization = text(body.specialization, 'Specialization');
    const status = choice(body.status, ['Active', 'Reserve']);
    const result = await pool.query(`INSERT INTO public.units (army_id,name,specialization,status)
      VALUES ($1,$2,$3,$4) RETURNING id, name, specialization, status, commander_id AS commander`, [req.user.armyId,name,specialization,status]);
    res.status(201).json(result.rows[0]);
  }));

  app.post('/api/soldiers/:id/assignment', requirePermission('soldiers.assign'), route(async (req,res) => {
    const soldierId = id(Number(req.params.id));
    const unitId = req.body?.unitId === null ? null : id(req.body?.unitId);
    await transaction(async client => {
      const soldier = await client.query('SELECT id FROM public.soldiers WHERE army_id=$1 AND id=$2 FOR UPDATE', [req.user.armyId,soldierId]);
      if (!soldier.rows[0]) throw new ApiError(404,'Soldier not found');
      await ownUnit(client, req.user.armyId, unitId);
      const command = await client.query('SELECT id FROM public.units WHERE army_id=$1 AND commander_id=$2 AND id IS DISTINCT FROM $3', [req.user.armyId,soldierId,unitId]);
      if (command.rows.length) throw new ApiError(409,'Remove the commander appointment before transferring this soldier');
      await client.query('UPDATE public.soldiers SET unit_id=$1 WHERE army_id=$2 AND id=$3', [unitId,req.user.armyId,soldierId]);
    });
    res.json({ message:'Assignment updated' });
  }));

  app.post('/api/units/:id/commander', requirePermission('units.assign_commander'), route(async (req,res) => {
    const unitId = id(Number(req.params.id));
    const soldierId = req.body?.soldierId === null ? null : id(req.body?.soldierId);
    await transaction(async client => {
      // Lock the soldier first, matching transfers, so membership cannot change mid-appointment.
      if (soldierId !== null) {
        const soldier = await client.query('SELECT unit_id FROM public.soldiers WHERE army_id=$1 AND id=$2 FOR UPDATE', [req.user.armyId,soldierId]);
        if (!soldier.rows[0]) throw new ApiError(404,'Soldier not found');
        if (soldier.rows[0].unit_id !== unitId) throw new ApiError(400,'Commander must belong to this unit');
      }
      const unit = await client.query('UPDATE public.units SET commander_id=$1 WHERE army_id=$2 AND id=$3 RETURNING id', [soldierId,req.user.armyId,unitId]);
      if (!unit.rows[0]) throw new ApiError(404,'Unit not found');
    });
    res.json({ message:'Commander updated' });
  }));

  app.get('/api/admin/users', requireOwner, route(async (req,res) => {
    const page = Number(req.query.page ?? 1);
    if (!Number.isSafeInteger(page) || page < 1 || page > 1000000) throw new ApiError(400,'Invalid page');
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    if (search.length > 120) throw new ApiError(400,'Search is too long');
    const sorts = {name:'s.name',username:'u.username',role:'u.role',newest:'u.id DESC'};
    const sortKey = req.query.sort ?? 'name';
    if (typeof sortKey !== 'string' || !Object.hasOwn(sorts,sortKey)) throw new ApiError(400,'Invalid sort');
    const sort = sorts[sortKey];
    const values = [req.user.armyId,search];
    const filter = `u.army_id=$1 AND ($2='' OR strpos(lower(s.name),lower($2))>0 OR strpos(lower(u.username),lower($2))>0)`;
    const count = await pool.query(`SELECT count(*)::int AS total FROM public.users u JOIN public.soldiers s ON s.id=u.soldier_id AND s.army_id=u.army_id WHERE ${filter}`,values);
    const result = await pool.query(`SELECT u.id,u.username,u.role,u.soldier_id AS "soldierId",s.name,
      ARRAY(SELECT permission FROM public.user_permissions WHERE user_id=u.id ORDER BY permission) AS permissions
      FROM public.users u JOIN public.soldiers s ON s.id=u.soldier_id AND s.army_id=u.army_id
      WHERE ${filter} ORDER BY ${sort},u.id LIMIT 10 OFFSET $3`, [...values,(page-1)*10]);
    res.json({ users:result.rows, permissions:permissionNames,total:count.rows[0].total,page,pageSize:10 });
  }));

  app.post('/api/admin/users/:id/access', requireOwner, route(async (req,res) => {
    const userId = id(Number(req.params.id));
    const role = req.body?.role;
    const permissions = req.body?.permissions;
    if (!['officer','soldier'].includes(role) || !Array.isArray(permissions) || permissions.some(p => !permissionNames.includes(p)) || new Set(permissions).size !== permissions.length || (role==='soldier' && permissions.length)) throw new ApiError(400,'Invalid role or permissions');
    if (userId === req.user.id) throw new ApiError(403,'Owner account cannot be changed here');
    await transaction(async client => {
      const target = await client.query('SELECT role FROM public.users WHERE army_id=$1 AND id=$2 FOR UPDATE', [req.user.armyId,userId]);
      if (!target.rows[0]) throw new ApiError(404,'User not found');
      if (target.rows[0].role==='owner') throw new ApiError(403,'Owner account cannot be changed here');
      await client.query('UPDATE public.users SET role=$1 WHERE army_id=$2 AND id=$3',[role,req.user.armyId,userId]);
      await client.query('DELETE FROM public.user_permissions WHERE user_id=$1',[userId]);
      for (const permission of permissions) await client.query('INSERT INTO public.user_permissions(user_id,permission) VALUES($1,$2)',[userId,permission]);
    });
    res.json({ message:'Access updated' });
  }));
}
