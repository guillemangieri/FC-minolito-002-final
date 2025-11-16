import express from "express";
import request from "supertest";
import { checkoutRoute } from "./checkout.route";
import CheckoutFacadeFactory from "../../../../checkout/factory/checkout.facade.factory";

describe("CheckoutRoute - POST /checkout", () => {
  let app: express.Express;

  beforeEach(() => {
    jest.clearAllMocks();

    app = express();
    app.use(express.json());
    app.use("/checkout", checkoutRoute);
  });

  it("deve criar um checkout chamando a facade e retornar 201", async () => {
    // arrange
    const placeOrderMock = jest.fn().mockResolvedValue({
      id: "1",
      invoiceId: "inv-123",
      status: "approved",
      total: 200,
      products: [{ productId: "1" }, { productId: "2" }],
    });

    // sobrescreve o método create da factory com um mock que devolve um objeto com placeOrder
    jest
      .spyOn(CheckoutFacadeFactory, "create")
      .mockReturnValue({ placeOrder: placeOrderMock } as any);

    const payload = {
      clientId: "1",
      products: [{ productId: "1" }, { productId: "2" }],
    };

    // act
    const resp = await request(app).post("/checkout").send(payload);

    // assert
    expect(resp.status).toBe(201); // se você mudar a rota para 200, muda aqui também
    expect(resp.body).toEqual({
      id: "1",
      invoiceId: "inv-123",
      status: "approved",
      total: 200,
      products: [{ productId: "1" }, { productId: "2" }],
    });

    expect(CheckoutFacadeFactory.create).toHaveBeenCalledTimes(1);
    expect(placeOrderMock).toHaveBeenCalledWith({
      clientId: "1",
      products: [{ productId: "1" }, { productId: "2" }],
    });
  });

  it("deve retornar 400 se faltar clientId ou products", async () => {
    const resp = await request(app).post("/checkout").send({
      // sem clientId e sem products
    });

    expect(resp.status).toBe(400);
    expect(resp.body).toHaveProperty("error");
  });

  it("deve retornar 400 se algum product não tiver productId", async () => {
    const resp = await request(app).post("/checkout").send({
      clientId: "1",
      products: [{ foo: "sem id" }],
    });

    expect(resp.status).toBe(400);
    expect(resp.body).toHaveProperty("error");
  });

  it("deve retornar 400 se a facade lançar erro", async () => {
    const placeOrderMock = jest.fn().mockRejectedValue(
      new Error("Erro de negócio na facade"),
    );

    jest
      .spyOn(CheckoutFacadeFactory, "create")
      .mockReturnValue({ placeOrder: placeOrderMock } as any);

    const resp = await request(app).post("/checkout").send({
      clientId: "1",
      products: [{ productId: "1" }],
    });

    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({ error: "Erro de negócio na facade" });
  });
});
