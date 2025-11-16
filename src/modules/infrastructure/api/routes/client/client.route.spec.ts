import request from "supertest";
import { buildApp } from "../../express"; // seu app exportado
import { setupDb, closeDb } from "../../database"; // caso você tenha helpers; senão inicialize aqui

const app = buildApp();

describe("POST /clients (E2E)", () => {
  beforeEach(async () => {
    process.env.USE_MIGRATIONS = "1";
    await setupDb();
  });

  afterEach(async () => {
    await closeDb?.();
  });

  it("deve criar um cliente com sucesso e retornar 201", async () => {
    const payload = {
      id: "c1",
      name: "Gui",
      email: "gui@example.com",
      document: "12345678900",
      street: "Esmeralda",
      number: "513",
      complement: "Apto 205",
      city: "Cuiabá",
      state: "MT",
      zipCode: "78000-000",
    };

    const response = await request(app)
      .post("/clients")
      .send(payload)
      .expect(201);

    expect(response.body).toMatchObject(payload);
  });

  it("deve retornar 400 se faltar campos obrigatórios", async () => {
    const response = await request(app)
      .post("/clients")
      .send({ id: "c1" })
      .expect(400);
    expect(response.body).toHaveProperty("error");
  });
});
