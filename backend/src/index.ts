import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import jwt from "jsonwebtoken";
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const SECRET_KEY = "mi_clave_secreta";


const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

// Middleware de verificación de token
const verifyToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(403).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "Malformed token" });
  }

  jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = decoded;
    next();
  });
};

app.get("/", (req: any, res: any) => {
  res.send("Backend is working with Prisma and Postgres!");
});

app.post("/login", (req: any, res: any) => {
  const { username, password } = req.body;

  // Validación de credenciales
  if (username === "admin" && password === "1234") {
    const token = jwt.sign({ username: username }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Credenciales inválidas" });
  }
});

// Ruta privada que requiere token
app.get("/private", verifyToken, (req: any, res: any) => {
  res.json({ message: "Acceso permitido" });
});

// Obtiene todas las tareas
app.get("/tasks", async (req: any, res: any) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (error) {
    console.error("Error en GET /tasks:", error);
    res.status(500).json({ message: "Error al obtener tareas" });
  }
});

app.post("/tasks", async (req: any, res: any) => {
  try {
    const newTask = await prisma.task.create({
      data: {
        text: req.body.text,
        completed: false,
      },
    });
    res.json(newTask);
  } catch (error) {
    console.error("Error en POST /tasks:", error);
    res.status(500).json({ message: "Error al crear tarea" });
  }
});

// Actualiza el estado completed de una tarea específica
app.put("/tasks/:id", async (req: any, res: any) => {
  try {
    const taskId = Number(req.params.id);
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        completed: req.body.completed,
      },
    });
    res.json(updatedTask);
  } catch (error) {
    console.error("Error en PUT /tasks/:id:", error);
    res.status(500).json({ message: "Error al actualizar tarea" });
  }
});

// DELETE /tasks/:id
// Elimina una tarea de la base de datos según su ID
app.delete("/tasks/:id", async (req: any, res: any) => {
  try {
    const taskId = Number(req.params.id);
    await prisma.task.delete({
      where: { id: taskId },
    });
    res.json({ message: "Deleted" });
  } catch (error) {
    console.error("Error en DELETE /tasks/:id:", error);
    res.status(500).json({ message: "Error al eliminar tarea" });
  }
});

// Encendemos el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});