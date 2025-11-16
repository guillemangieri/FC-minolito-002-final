import { Column, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { InvoiceItemsModel } from "./invoice-items.model";

@Table({ tableName: "invoice", timestamps: false })
export class InvoiceModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @Column({ allowNull: false }) declare name: string;
  @Column({ allowNull: false }) declare document: string;

  @Column({ allowNull: false }) declare street: string;
  @Column({ allowNull: false }) declare number: string;
  @Column({ allowNull: true  }) declare complement: string;
  @Column({ allowNull: false }) declare city: string;
  @Column({ allowNull: false }) declare state: string;
  @Column({ allowNull: false }) declare zipcode: string;
/*
  @HasMany(() => InvoiceItemsModel, { as: "invoiceItems", foreignKey: "invoiceId" })
  declare invoiceItems: InvoiceItemsModel[];
*/

  @HasMany(() => require("./invoice-items.model").InvoiceItemsModel, {
    as: "invoiceItems",
    foreignKey: "invoiceId",
  })
  declare invoiceItems: InvoiceItemsModel[];

  @Column({ field: "created_at" }) declare createdAt: Date;
  @Column({ field: "updated_at" }) declare updatedAt: Date;
}
