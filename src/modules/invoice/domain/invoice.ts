import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import { InvoiceItemEntity } from "./invoice-items";


type InvoiceProps = {
  id?: Id;
  name: string;
  document: string;
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  zipCode: string;
  items: InvoiceItemEntity[];
  createdAt?: Date;
  updatedAt?: Date;
};

export default class Invoice extends BaseEntity implements AggregateRoot {
  public _name: string;
  public _document: string;
  public _street: string;
  public _number: string;
  public _complement: string;
  public _city: string;
  public _state: string;
  public _zipCode: string;
  public _items: InvoiceItemEntity[];

  constructor(props: InvoiceProps) {
    super(props.id);
    this._name = props.name;
    this._document = props.document;
    this._street = props.street;
    this._number = props.number;
    this._complement = props.complement;
    this._city = props.city;
    this._state = props.state;
    this._zipCode = props.zipCode;
    this._items = props.items;
  }

}