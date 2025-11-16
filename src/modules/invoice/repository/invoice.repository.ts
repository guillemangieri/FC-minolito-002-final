import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice";
import { InvoiceItemEntity } from "../domain/invoice-items";
import InvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceItemsModel } from "./invoice-items.model";
import { InvoiceModel } from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {
  async generate(invoice: Invoice): Promise<void> {
    const total = invoice._items.reduce((acc, item) => acc + item.price, 0);
    const response = await InvoiceModel.create({
      id: invoice.id.id,
      name: invoice._name,
      document: invoice._document,
      street: invoice._street,
      number: invoice._number,
      complement: invoice._complement,
      city: invoice._city,
      state: invoice._state,
      zipcode: invoice._zipCode,
    });
    if (invoice._items?.length) {
      InvoiceItemsModel.bulkCreate(
        invoice._items.map((item) => ({
          id: item.id.id,
          invoiceId: invoice.id.id,
          name: item.name,
          price: item.price,
        })),
        { validate: true }
      );
    }
  }

  async find(id: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findOne({
      where: { id },
      include: [{ model: InvoiceItemsModel, as: "invoiceItems" }], 
    });

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    return new Invoice({
      id: new Id(invoice["dataValues"].id),
      name: invoice["dataValues"].name,
      document: invoice["dataValues"].document,
      street: invoice["dataValues"].street,
      number: invoice["dataValues"].number,
      complement: invoice["dataValues"].complement,
      city: invoice["dataValues"].city,
      state: invoice["dataValues"].state,
      zipCode: invoice["dataValues"].zipcode,
      items: invoice["dataValues"].invoiceItems.map(
        (item: any) =>
          new InvoiceItemEntity({
            id: new Id(item["dataValues"].id),
            name: item["dataValues"].name,
            price: item["dataValues"].price,
          })
      ),
      createdAt: invoice["dataValues"].createdAt,
      updatedAt: invoice["dataValues"].updatedAt,
    });
  }
}
