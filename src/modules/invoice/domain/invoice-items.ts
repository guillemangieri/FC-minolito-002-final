import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";


type input = {
  id?: Id;
  name: string;
  price: number;
};

export class InvoiceItemEntity extends BaseEntity implements AggregateRoot {
  private _name: string;
  private _price: number;

  constructor({ id, name, price }: input) {
    super(id);
    this._name = name;
    this._price = price;
  }

  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price;
  }
}