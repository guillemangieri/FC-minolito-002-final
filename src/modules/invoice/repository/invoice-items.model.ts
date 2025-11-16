import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { InvoiceModel } from "./invoice.model";

@Table({ tableName: "invoice_items", timestamps: false })
export class InvoiceItemsModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false, type: DataType.STRING })
  declare id: string;
/*
  @ForeignKey(() => InvoiceModel)
  @Column({ allowNull: false, type: DataType.STRING })
  declare invoiceId: string;

  @BelongsTo(() => InvoiceModel, { as: "invoice" })
  declare invoice: InvoiceModel;
  */

  @ForeignKey(() => require("./invoice.model").InvoiceModel)
  @Column({ allowNull: false, field: "invoice_id" }) 
  declare invoiceId: string;
  
  @BelongsTo(() => require("./invoice.model").InvoiceModel, { as: "invoice" })
  declare invoice?: InvoiceModel;

  @Column({ allowNull: false, type: DataType.STRING }) declare name: string;
  @Column({ allowNull: false, type: DataType.FLOAT })  declare price: number;
}
