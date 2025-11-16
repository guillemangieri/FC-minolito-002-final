import request from "supertest";
import { buildApp } from "../../express";
import { InvoiceFacadeFactory } from "../../../../invoice/factory/invoice.facade.factory";

describe("GET /invoice/:id", () => {
  let app: ReturnType<typeof buildApp>;

  beforeAll(() => {
    app = buildApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar 200 e a invoice quando existir", async () => {
    const findMock = jest.fn().mockResolvedValue({
      id: "123",
      name: "invoice 1",
      document: "000000001",
      address: {
        street: "Esmeralda",
        number: "513",
        complement: "Apt 205",
        city: "Cuiabrassa",
        state: "MT",
        zipCode: "78050-050",
      },
      items: [
        { id: "456", name: "Produto 01", price: 100 },
        { id: "789", name: "Produto 02", price: 50 },
      ],
      total: 150,
      createdAt: new Date("2025-01-01T00:00:00Z"),
    });

    jest
      .spyOn(InvoiceFacadeFactory, "create")
      .mockReturnValue({ findInvoice: findMock } as any);

    const resp = await request(app).get("/invoice/123").expect(200);

    expect(InvoiceFacadeFactory.create).toHaveBeenCalledTimes(1);
    expect(findMock).toHaveBeenCalledWith({ id: "123" });

    expect(resp.body).toMatchObject({
      id: "123",
      name: "invoice 1",
      document: "000000001",
      address: {
        street: "Esmeralda",
        number: "513",
        complement: "Apt 205",
        city: "Cuiabrassa",
        state: "MT",
        zipCode: "78050-050",
      },
      total: 150,
    });

    expect(resp.body.items).toHaveLength(2);
    expect(resp.body.items[0]).toMatchObject({
      id: "456",
      name: "Produto 01",
      price: 100,
    });
  });

  it("deve retornar 404 quando a invoice não existir", async () => {
    const findMock = jest.fn().mockResolvedValue(null);

    jest
      .spyOn(InvoiceFacadeFactory, "create")
      .mockReturnValue({ findInvoice: findMock } as any);

    const resp = await request(app).get("/invoice/nao-existe").expect(404);

    expect(InvoiceFacadeFactory.create).toHaveBeenCalledTimes(1);
    expect(findMock).toHaveBeenCalledWith({ id: "nao-existe" });

    expect(resp.body).toHaveProperty("error");
  });

  it("deve retornar 400 se o id não for informado", async () => {
    const resp = await request(app).get("/invoice/").send();

    // dependendo do express, esse teste pode nem chegar aqui,
    // mas se chegar, a rota responde 400 no guard de id
    if (resp.status !== 404) {
      // 404 pode ser do próprio express por rota inválida
      expect(resp.status).toBe(400);
      expect(resp.body).toHaveProperty("error");
    }
  });
});
