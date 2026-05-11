require("../instrument.js");
const Sentry = require("@sentry/node");
const express = require("express");
const app = express();

app.use(express.json());
const path = require("path");
app.use(express.static(path.join(__dirname, "../public")));

// Base de datos temporal (mientras no tenemos base de datos real)
let tareas = [];
let contadorId = 1;

// GET /tasks — obtener todas las tareas
app.get("/tasks", (req, res) => {
  res.status(200).json(tareas);
});

// POST /tasks — crear una tarea
app.post("/tasks", (req, res) => {
  const { titulo, descripcion } = req.body;

  if (!titulo) {
    return res.status(400).json({ error: "El título es obligatorio" });
  }

  const nuevaTarea = {
    id: contadorId++,
    titulo,
    descripcion: descripcion || "",
    completada: false,
  };

  tareas.push(nuevaTarea);
  res.status(201).json(nuevaTarea);
});

// PUT /tasks/:id — actualizar una tarea
app.put("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const tarea = tareas.find((t) => t.id === id);

  if (!tarea) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }

  const { titulo, descripcion, completada } = req.body;
  if (titulo) tarea.titulo = titulo;
  if (descripcion !== undefined) tarea.descripcion = descripcion;
  if (completada !== undefined) tarea.completada = completada;

  res.status(200).json(tarea);
});

// DELETE /tasks/:id — eliminar una tarea
app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = tareas.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }

  tareas.splice(index, 1);
  res.status(200).json({ mensaje: "Tarea eliminada correctamente" });
});

// Ruta de prueba para Sentry
app.get("/debug-sentry", (req, res) => {
  throw new Error("Error de prueba para Sentry - Lista de Tareas");
});

// Sentry manejo de errores (debe ir antes de module.exports)
Sentry.setupExpressErrorHandler(app);

// Exportamos la app para poder usarla en las pruebas
module.exports = { app, tareas, get contadorId() { return contadorId; }, resetData() { tareas = []; contadorId = 1; } };