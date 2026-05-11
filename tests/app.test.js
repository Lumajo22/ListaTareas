const request = require("supertest");
const { app, resetData } = require("../src/app");

// Antes de cada prueba limpiamos los datos
beforeEach(() => {
  resetData();
});

// ===== PRUEBAS GET =====
describe("GET /tasks", () => {
  test("debe retornar una lista vacía al inicio", async () => {
    const res = await request(app).get("/tasks");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test("debe retornar las tareas creadas", async () => {
    await request(app)
      .post("/tasks")
      .send({ titulo: "Tarea 1", descripcion: "Descripción 1" });

    const res = await request(app).get("/tasks");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].titulo).toBe("Tarea 1");
  });
});

// ===== PRUEBAS POST =====
describe("POST /tasks", () => {
  test("debe crear una tarea correctamente", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ titulo: "Nueva tarea", descripcion: "Mi descripción" });

    expect(res.statusCode).toBe(201);
    expect(res.body.titulo).toBe("Nueva tarea");
    expect(res.body.completada).toBe(false);
  });

  test("debe retornar error 400 si no se envía título", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ descripcion: "Sin título" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("El título es obligatorio");
  });
});

// ===== PRUEBAS PUT =====
describe("PUT /tasks/:id", () => {
  test("debe actualizar una tarea existente", async () => {
    await request(app)
      .post("/tasks")
      .send({ titulo: "Tarea original" });

    const res = await request(app)
      .put("/tasks/1")
      .send({ titulo: "Tarea actualizada", completada: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.titulo).toBe("Tarea actualizada");
    expect(res.body.completada).toBe(true);
  });

  test("debe retornar error 404 si la tarea no existe", async () => {
    const res = await request(app)
      .put("/tasks/999")
      .send({ titulo: "No existe" });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Tarea no encontrada");
  });
});

// ===== PRUEBAS DELETE =====
describe("DELETE /tasks/:id", () => {
  test("debe eliminar una tarea existente", async () => {
    await request(app)
      .post("/tasks")
      .send({ titulo: "Tarea a eliminar" });

    const res = await request(app).delete("/tasks/1");
    expect(res.statusCode).toBe(200);
    expect(res.body.mensaje).toBe("Tarea eliminada correctamente");
  });

  test("debe retornar error 404 si la tarea no existe", async () => {
    const res = await request(app).delete("/tasks/999");
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Tarea no encontrada");
  });
});