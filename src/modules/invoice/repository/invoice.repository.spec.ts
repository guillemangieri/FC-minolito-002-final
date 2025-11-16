import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "../../invoice/repository/invoice.model";
import { InvoiceItemsModel } from "../../invoice/repository/invoice-items.model";
import Invoice from "../domain/invoice";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceRepository from "./invoice.repository";
import { InvoiceItemEntity } from "../domain/invoice-items";

describe("InvoiceRepository", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {

    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

    sequelize.addModels([InvoiceModel, InvoiceItemsModel]);
/*
    InvoiceModel.hasMany(InvoiceItemsModel, {
      foreignKey: "invoiceId",
      as: "invoiceItems",
    });
*/
    await sequelize.sync({ force: true });

  });

  afterEach(async () => {
    if (sequelize) {
      await sequelize.close();
      sequelize = undefined;
    }
  });

  it("it should generate an invoice", async () => {
    const invoice = new Invoice({
      id: new Id("123"),
      name: "invoice 1",
      document: "000000001",
      street: "Esmeralda",
      number: "513",
      complement: "Apt 205",
      city: "Cuiabrassa",
      state: "MT",
      zipCode: "78050-050",
      items: [
        new InvoiceItemEntity({
          id: new Id("456"),
          name: "Produto 01",
          price: 100,
        }),
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const repository = new InvoiceRepository();

    const generateSpy = jest.spyOn(repository, "generate");

    const output = await repository.generate(invoice);

    expect(generateSpy).toHaveBeenCalled();
  });
});
