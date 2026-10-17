import express from "express";
import session from "express-session";
import { randomBytes } from "node:crypto";
import { pool } from "./db.js";
import { registerAuthRoutes } from "./authRoutes.js";
import { registerUnitRoutes } from "./unitRoutes.js";
import { registerReadRoutes } from "./readRoutes.js";
import { registerManagementRoutes } from "./managementRoutes.js";
import { requireAuth, requireChangedPassword, ApiError, route } from "./access.js";

export async function createApp() {
  const app = express();
  app.use(express.json({ limit: '32kb' }));
  app.use(session({
    secret: process.env.SESSION_SECRET || randomBytes(32).toString('hex'),
    resave: false, saveUninitialized: false,
    cookie: { httpOnly:true, secure:false, sameSite:'lax' },
  }));
  // Vite may rewrite Host while preserving the browser's Origin header.
  const frontendOrigins = new Set(process.env.APP_ORIGIN
    ? [new URL(process.env.APP_ORIGIN).origin]
    : ['http://localhost:5173', 'http://127.0.0.1:5173']);
  app.use((req,res,next) => {
    const origin = req.get('origin');
    if (origin && !['GET','HEAD','OPTIONS'].includes(req.method)) {
      try {
        const requestOrigin = new URL(origin).origin;
        const serverOrigin = `${req.protocol}://${req.get('host')}`;
        if (requestOrigin !== serverOrigin && !frontendOrigins.has(requestOrigin)) {
          return res.status(403).json({message:'Cross-origin request rejected'});
        }
      }
      catch { return res.status(403).json({message:'Invalid origin'}); }
    }
    next();
  });
  await registerAuthRoutes(app);
  app.use('/api',requireAuth,requireChangedPassword);
  const selectSoldier = `SELECT s.id,s.name,s.rank,COALESCE(u.name,'Unassigned') AS unit,
    s.unit_id AS "unitId",s.status,s.specialization,s.age
    FROM public.soldiers s LEFT JOIN public.units u ON u.id=s.unit_id AND u.army_id=s.army_id`;
  app.get('/api/soldiers',route(async (req,res) => {
    const values = [req.user.armyId];
    const own = req.user.role==='soldier';
    if (own) values.push(req.user.soldierId);
    const result=await pool.query(selectSoldier+' WHERE s.army_id=$1'+(own?' AND s.id=$2':'')+' ORDER BY s.id',values);
    res.json(result.rows);
  }));
  app.get('/api/soldiers/:id',route(async (req,res) => {
    const id=Number(req.params.id);
    if (!Number.isInteger(id)||id<1||id>2147483647||(req.user.role==='soldier'&&id!==req.user.soldierId)) throw new ApiError(404,'Soldier not found');
    const result=await pool.query(selectSoldier+' WHERE s.army_id=$1 AND s.id=$2',[req.user.armyId,id]);
    if (!result.rows[0]) throw new ApiError(404,'Soldier not found');
    res.json(result.rows[0]);
  }));
  registerManagementRoutes(app);
  registerUnitRoutes(app);
  registerReadRoutes(app);
  app.get('/',(req,res)=>res.send('Server is running'));
  app.use('/api',(req,res)=>res.status(404).json({message:'API route not found'}));
  app.use((error,req,res,next)=>{
    if(res.headersSent) return next(error);
    if(error instanceof ApiError) return res.status(error.status).json({message:error.message});
    if(error.code==='23505') return res.status(409).json({message:'Username or record already exists'});
    if(error.code==='23503') return res.status(400).json({message:'Invalid record relationship'});
    if(error.type==='entity.parse.failed') return res.status(400).json({message:'Invalid JSON'});
    if(error.type==='entity.too.large') return res.status(413).json({message:'Request too large'});
    console.error('Request failed:',error.code||error.name);
    res.status(500).json({message:'Server error. Please try again'});
  });
  return app;
}
