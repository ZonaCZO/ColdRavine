import express from "express";
import { verifyPassword } from "./password.js";
import { registerReadRoutes } from "./readRoutes.js";
import { registerUnitRoutes } from "./unitRoutes.js";
import session from "express-session";


const app = express();
app.use(express.json());

app.use(session({
  secret: "temporary-learning-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  },
}));


const soldiers = [
  { id: 1, name: "Viking Glebegorov", rank: "Private", unit: "Sneg", status: "Active", specialization: "Infantry", age: 17 },
  { id: 2, name: "Moon Moonenko", rank: "Sergeant", unit: "Sneg", status: "Wounded", specialization: "Medic", age: 18 },
  { id: 3, name: "Lovanda Lovare", rank: "Corporal", unit: "Ogorod", status: "Reserve", specialization: "Engineer", age: 20 },
  { id: 4, name: "Zona Sakutoro", rank: "Capitan", unit: "Sneg", status: "Active", specialization: "Infantry", age: 21 },
  { id: 5, name: "Gorod Ogorodovsky", rank: "General", unit: "Warpig", status: "Active", specialization: "Infantry", age: 25 }
];

const units = [
  { id: 1, name: "Sneg", commander: 1, specialization: "SpecOps", status: "Active" },
  { id: 2, name: "Warpig", commander: 2, specialization: "Assault", status: "Active" },
  { id: 3, name: "Ogorod", commander: 3, specialization: "Red Staff", status: "Reserve" },
];

const users = [
  {
    "id": 1,
    "username": "Pidor",
    "passwordHash": "scrypt$88e9d5839b0542307995d1623b0ddc13$8f92e2e252975499f0b7e71414a3f81f54ad92d3079b4d2bd52c01821ba1d787c8e2f0d5354f2a7de6d81ccf4df47dc9485f84f7168bbb4b3bc52b6d7f6fb25f"
  }
];
function requireAuth(req, res, next) {
  const user = users.find((user) => user.id === req.session.userId);

  if (!user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  next();
}



app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body ?? {};

  if (typeof username !== "string" || typeof password !== "string" || !username.trim() || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    const user = users.find(item => item.username === username.trim());
    // Verify a real hash even for an unknown username.
    const passwordMatches = await verifyPassword(password, user?.passwordHash ?? users[0].passwordHash);

    if (!user || !passwordMatches) {
      return res.status(401).json({ message: "Incorrect login or password" });
    }

    // Replace the guest session before recording the authenticated user.
    req.session.regenerate((error) => {
      if (error) return res.status(500).json({ message: "Failed to log in" });
      req.session.userId = user.id;
      res.json({ message: "Credentials accepted" });
    });
  } catch {
    res.status(500).json({ message: "Failed to log in" });
  }
});

app.get("/api/auth/me", (req, res) => {
  const user = users.find(u => u.id === req.session.userId)
  if (!user){
    return res.status(401).json({message: "Not authenticated"});
  }
  res.json({ id: user.id, username: user.username })
});

app.post("/api/auth/logout", (req, res) => {
  if (!req.session.userId) return res.status(401).json({ message: "You are not loggined" })
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({ message: "Failed to log out" });
    }

    res.clearCookie("connect.sid", { path: "/" });
    res.json({ message: "Logged out" });
  });
});

app.use("/api", requireAuth);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/api/soldiers/:id", (req, res) => {
  const soldier = soldiers.find(s => s.id === Number(req.params.id));
  
if (!soldier) return res.status(404).json({ message: "Soldier not found" });
res.json(soldier);
});




app.get("/api/soldiers/", (req, res) => {
  
if (!soldiers) return res.status(404).json({ message: "Soldier not found" });
res.json(soldiers);
});

registerUnitRoutes(app, units);
registerReadRoutes(app);

app.listen(3000, () => {
  console.log("Server: http://localhost:3000");
}); 
