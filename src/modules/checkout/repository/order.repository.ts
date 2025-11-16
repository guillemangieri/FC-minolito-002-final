import  Id  from "../../@shared/domain/value-object/id.value-object";
import  Order  from "../domain/order.entity";
import  CheckoutGateway  from "../gateway/checkout.gateway";
import { OrderModel } from "./order.model";

function orderModelToOrder(orderModel: OrderModel): Order {
  const order = new Order({
    id: new Id(orderModel.id),
    status: orderModel.status,
    client: orderModel.client,
    products: orderModel.products,
  });

  return order;
}

export class OrderRepository implements CheckoutGateway {
  async addOrder(order: Order): Promise<any> {
    const { id, status, client, products } = order;

    const orderCreated = await OrderModel.create({
      id: id.id,
      status,
      client,
      products,
    });

    const result = orderModelToOrder(orderCreated);
    return result;
  }

  async findOrder(id: string): Promise<Order> {
    const orderOnDB = await OrderModel.findByPk(id);
    const order = orderModelToOrder(orderOnDB);

    return order;
  }
}