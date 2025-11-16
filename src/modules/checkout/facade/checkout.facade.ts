import CheckoutFacadeInterface, {
  PlaceOrderInputDTO,
  PlaceOrderOutputDTO,
} from "./checkout.facade.interface";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";

export default class CheckoutFacade implements CheckoutFacadeInterface {
  constructor(private readonly placeOrderUseCase: PlaceOrderUseCase) {}

  async placeOrder(input: PlaceOrderInputDTO): Promise<PlaceOrderOutputDTO> {
    return this.placeOrderUseCase.execute(input);
  }
}
