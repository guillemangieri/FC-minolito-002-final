import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import { InvoiceItemEntity } from "../domain/invoice-items";
import { InvoiceFacadeFactory } from "../factory/invoice.facade.factory";
import { InvoiceModel } from "../repository/invoice.model";
import { InvoiceItemsModel } from "../repository/invoice-items.model";

const mockInput = {
  name: "Guillermo",
  document: "12345678-11",
  street: "Esmeralda",
  number: "513",
  complement: "ap205",
  city: "cuiaba",
  state: "Mato Grosso",
  zipCode: "78000-000",
  items: [
    new InvoiceItemEntity({
      id: new Id("1"),
      name: "prod 01",
      price: 100,
    }),
  ],
};

describe("InvoiceFacade", () => {
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
    await sequelize.close();
  });

  it("should generate an invoice using facade", async () => {
    const facade = InvoiceFacadeFactory.create();

    const input = {
      name: "pedido 1",
      document: "123456789",
      street: "Esmeralda",
      number: "513",
      complement: "Perto do hosp São Matheus",
      city: "Cuiabá",
      state: "Mato Grosso",
      zipCode: "78050-000",
      items: [
        {
          id: "1",
          name: "Produto 1",
          price: 100,
        },
        {
          id: "2",
          name: "Produto 2",
          price: 200,
        },
      ],
    };

    const invoiceGenerated = await facade.create(input);
    const invoiceOnDB = await InvoiceModel.findOne({
      where: { id: invoiceGenerated.id },
    });

    expect(invoiceGenerated.id).toBeDefined();
    /*
    expect(invoiceOnDB.id).toBeDefined();
    expect(invoiceGenerated.name).toBe(input.name);
    expect(invoiceGenerated.document).toEqual(input.document);
    expect(invoiceGenerated.items).toEqual(input.items);
    expect(invoiceGenerated.total).toEqual(300);
    */
  });
});
