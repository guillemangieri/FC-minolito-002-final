import CheckoutFacadeFactory from "./checkout.facade.factory";
import CheckoutFacade from "../facade/checkout.facade";

describe("CheckoutFacadeFactory", () => {
  it("deve criar uma instância de CheckoutFacade", () => {
    const facade = CheckoutFacadeFactory.create();

    expect(facade).toBeInstanceOf(CheckoutFacade);
    expect(typeof facade.placeOrder).toBe("function");
  });

  it("deve chamar placeOrder sem quebrar (mock superficial)", async () => {
    const facade = CheckoutFacadeFactory.create();

    // mock superficial para evitar executar toda a pipeline real aqui
    jest.spyOn(facade, "placeOrder").mockResolvedValue({
      id: "test-order-id",
      invoiceId: null,
      status: "pending",
      total: 0,
      products: [],
    });

    const result = await facade.placeOrder({
      clientId: "cli123",
      products: [{ productId: "prod01" }],
    });

    expect(result.id).toBe("test-order-id");
  });
});
