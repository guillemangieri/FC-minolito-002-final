import request from "supertest";
import { buildApp } from "../../express";
import { setupDb } from "../../database";
import ProductAdmFacadeFactory from "../../../../product-adm/factory/facade.factory";

describe("POST /products (E2E)", () => {
  // app vai ser compartilhado pros testes desse describe
  let app: ReturnType<typeof buildApp>;

  beforeAll(async () => {
    process.env.USE_MIGRATIONS = "1";
    await setupDb();
    app = buildApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve criar um produto com sucesso e retornar 201", async () => {

    const addProductMock = jest.fn().mockResolvedValue(undefined);

    jest
      .spyOn(ProductAdmFacadeFactory, "create")
      .mockReturnValue({ addProduct: addProductMock } as any);


    const payload = {
      id: "p123",
      name: "Teclado Mecânico",
      description: "Teclado mecânico switch marrom ABNT2",
      purchasePrice: 250.5,
      stock: 7,
    };

    const response = await request(app)
      .post("/products")
      .send(payload)
      .expect(201);

    // valida conteúdo de resposta
    expect(response.body).toMatchObject({
      id: "p123",
      name: "Teclado Mecânico",
      description: "Teclado mecânico switch marrom ABNT2",
      purchasePrice: 250.5,
      stock: 7,
    });
  });

  it("deve retornar 400 se faltar campos obrigatórios", async () => {
    const response = await request(app)
      .post("/products")
      .send({
        id: "incompleto",
        name: "Produto sem tudo",
        // falta description, purchasePrice, stock
      })
      .expect(400);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toContain("Ausencia de dados obrigatórios: id, name, description, purchasePrice, stock");
  });
});
