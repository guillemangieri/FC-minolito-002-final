// src/modules/store-catalog/repository/product.model.ts
import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "store_catalog_products", timestamps: false })
export default class StoreCatalogProductModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false, type: DataType.STRING })
  declare id: string;

  @Column({ allowNull: false, type: DataType.STRING })
  declare name: string;

  @Column({ allowNull: false, type: DataType.STRING })
  declare description: string;

  @Column({ allowNull: false, type: DataType.FLOAT })
  declare salesPrice: number;
}
