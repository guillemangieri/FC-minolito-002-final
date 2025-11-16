import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import { InvoiceFacadeInterface } from "../../../invoice/facade/invoice.facade.interface";
import PaymentFacadeInterface from "../../../payment/facade/facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import Client from "../../domain/client.entity";
import Order from "../../domain/order.entity";
import Product from "../../domain/product.entity";
import CheckoutGateway from "../../gateway/checkout.gateway";
import { PlaceOrderInputDTO, PlaceOrderOutputDTO } from "./place-order.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {
  private _clientFacade: ClientAdmFacadeInterface;
  private _productFacade: ProductAdmFacadeInterface;
  private _catalogFacade: StoreCatalogFacadeInterface;
  private _repository: CheckoutGateway;
  private _invoiceFacade: InvoiceFacadeInterface;
  private _paymentFacade: PaymentFacadeInterface;

  constructor(
    clientFacade: ClientAdmFacadeInterface,
    productFacade: ProductAdmFacadeInterface,
    catalogFacade: StoreCatalogFacadeInterface,
    repository: CheckoutGateway,
    invoiceFacade: InvoiceFacadeInterface,
    paymentFacade: PaymentFacadeInterface
  ) {
    this._clientFacade = clientFacade;
    this._productFacade = productFacade;
    this._catalogFacade = catalogFacade;
    this._repository = repository;
    this._invoiceFacade = invoiceFacade;
    this._paymentFacade = paymentFacade;
  }
  async execute(input: PlaceOrderInputDTO): Promise<PlaceOrderOutputDTO> {
    // buscar cliente. Caso nao encontre - client not found

    const client = await this._clientFacade.find({ id: input.clientId });
    if (!client) {
      throw new Error("Client not found");
    }

    // validar produto.

    await this.validateProducts(input);

    // recuperar os produtos

    const products = await Promise.all(
      input.products.map((p) => this.getProduct(p.productId))
    );

    // criar o objeto do client

    const myClient = new Client({
      id: new Id(client.id),
      name: client.name,
      email: client.email,
      address: `${client.street}, ${client.number} ${
        client.complement || ""
      }, ${client.city} - ${client.state}, ${client.zipCode}`,
    });

    // criar o objeto do order (client.products)

    const order = new Order({
      client: myClient,
      products: products,
    });

    // processpayment -> paymentfacade.process (orderid, ammount)
    const payment = await this._paymentFacade.process({
      orderId: order.id.id,
      amount: order.total,
    });


    let invoiceId: string | null = null;

    // caso pagamento seja aprovado -> Gerar Invoice

    if (payment.status === "approved") {
      const invoice = await this._invoiceFacade.create({
        name: client.name,
        document: client.document,
        street: client.street,
        complement: client.complement,
        number: client.number,
        city: client.city,
        state: client.state,
        zipCode: client.zipCode,
        items: products.map((p) => ({
          id: p.id.id,
          name: p.name,
          price: p.salesPrice,
        })),
      });

      invoiceId = invoice.id;
      order.approved();
    }

    //payment.status === "approved" && order.approved();
    await this._repository.addOrder(order);

    // mudar o status da minha order para approved
    // retornar dto.
    return {
      id: order.id.id,
      invoiceId,
      status: order.status,
      total: order.total,
      products: products.map((p) => ({ productId: p.id.id })),
    };
  }

  private async validateProducts(input: PlaceOrderInputDTO): Promise<void> {
    if (input.products.length === 0) {
      throw new Error("No Products selected");
    }

    for (const p of input.products) {
      const product = await this._productFacade.checkStock({
        productId: p.productId,
      });

      if (product.stock <= 0) {
        throw new Error(
          `Product ${product.productId} is not available in stock`
        );
      }
    }
  }

  private async getProduct(productId: string): Promise<Product> {
    const product = await this._catalogFacade.find({ id: productId });
    if (!product) {
      throw new Error("Product not found");
    }

    const productProps = {
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      _salesPrice: product.salesPrice,
    };

    return new Product(productProps);
  }
}
