import CheckoutFacade from "../facade/checkout.facade";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";

// Repositório de Order (implementa CheckoutGateway)
import { OrderRepository } from "../../checkout/repository/order.repository";

// Fábricas das dependências (ajuste os caminhos se diferirem no seu projeto)
import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import  PaymentFacadeFactory  from "../../payment/factory/payment.facade.factory";
import { InvoiceFacadeFactory } from "../../invoice/factory/invoice.facade.factory";

export default class CheckoutFacadeFactory {
  static create(): CheckoutFacade {
    // Repositório para persistir o pedido
    const checkoutRepository = new OrderRepository();

    // Facades de outros contextos
    const clientFacade = ClientAdmFacadeFactory.create();
    const productAdmFacade = ProductAdmFacadeFactory.create();     // estoque / validação
    const storeCatalogFacade = StoreCatalogFacadeFactory.create(); // salesPrice
    const paymentFacade = PaymentFacadeFactory.create();
    const invoiceFacade = InvoiceFacadeFactory.create();

    // **IMPORTANTE**: respeitar a ordem/assinatura real do seu PlaceOrderUseCase!
    // Ajuste a ordem dos argumentos abaixo conforme o seu construtor.
    const placeOrderUseCase = new PlaceOrderUseCase(
      clientFacade,
      productAdmFacade,
      storeCatalogFacade,
      checkoutRepository,
      invoiceFacade,
      paymentFacade,
    );

    return new CheckoutFacade(placeOrderUseCase);
  }
}
