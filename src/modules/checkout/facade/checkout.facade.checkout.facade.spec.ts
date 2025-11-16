import CheckoutFacade from "./checkout.facade";
import type PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";
import {
  PlaceOrderInputDTO,
  PlaceOrderOutputDTO,
} from "./checkout.facade.interface";

describe("CheckoutFacade", () => {
  let mockUseCase: { execute: jest.Mock };
  let facade: CheckoutFacade;

  beforeEach(() => {
    mockUseCase = {
      execute: jest.fn(),
    };

    // como o construtor da facade recebe o use case concreto,
    // fazemos o cast para o tipo esperado
    facade = new CheckoutFacade(mockUseCase as unknown as PlaceOrderUseCase);
  });

  it("deve delegar para o use case e retornar o resultado", async () => {
    const input: PlaceOrderInputDTO = {
      clientId: "c1",
      products: [{ productId: "p1" }, { productId: "p2" }],
    };

    const output: PlaceOrderOutputDTO = {
      id: "o-123",
      invoiceId: "i-999",
      status: "approved",
      total: 300,
      products: [{ productId: "p1" }, { productId: "p2" }],
    };

    mockUseCase.execute.mockResolvedValue(output);

    const result = await facade.placeOrder(input);

    expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
    expect(mockUseCase.execute).toHaveBeenCalledWith(input);
    expect(result).toEqual(output);
  });

  it("deve propagar erro do use case", async () => {
    const input: PlaceOrderInputDTO = {
      clientId: "c1",
      products: [{ productId: "p1" }],
    };

    mockUseCase.execute.mockRejectedValue(new Error("Client not found"));

    await expect(facade.placeOrder(input)).rejects.toThrow("Client not found");
    expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
    expect(mockUseCase.execute).toHaveBeenCalledWith(input);
  });
});
