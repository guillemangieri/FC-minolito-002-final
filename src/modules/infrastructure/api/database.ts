// src/modules/infrastructure/api/database.ts
import { Sequelize } from "sequelize-typescript";

import { OrderModel } from "../../checkout/repository/order.model";
import { ClientModel } from "../../client-adm/repository/client.model";
import { InvoiceModel } from "../../invoice/repository/invoice.model";
import { InvoiceItemsModel } from "../../invoice/repository/invoice-items.model";

import {ProductModel} from "../../product-adm/repository/product.model";
import StoreCatalogProductModel from "../../store-catalog/repository/product.model";

import { makeMigrator } from "../../../migrations/migrator"; // << importa o migrator

export let sequelize: Sequelize;

export async function setupDb(): Promise<void> {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });

  sequelize.addModels([
    OrderModel,
    ClientModel,
    InvoiceModel,
    InvoiceItemsModel,
    ProductModel,
    StoreCatalogProductModel,
  ]);

  if (process.env.USE_MIGRATIONS === "1") {
    const migrator = makeMigrator(sequelize);
    await migrator.up();
  } else {
    await sequelize.sync({ force: true });
  }
}

export async function closeDb(): Promise<void> {
  if (sequelize) {
    await sequelize.close();
    // @ts-ignore liberar ref nos testes
    sequelize = undefined;
  }
}
