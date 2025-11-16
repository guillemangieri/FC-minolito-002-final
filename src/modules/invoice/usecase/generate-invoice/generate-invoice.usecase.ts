import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice";
import { InvoiceItemEntity } from "../../domain/invoice-items";
import InvoiceGateway from "../../gateway/invoice.gateway";
import {
  GenerateInvoiceInputDto,
  GenerateInvoiceOutputDto,
} from "./generate-invoice.dto";

export default class GenerateInvoiceUseCase {
  private _generateInvoiceRepository: InvoiceGateway;

  constructor(_generateInvoiceRepository: InvoiceGateway) {
    this._generateInvoiceRepository = _generateInvoiceRepository;
  }

  async execute(
    input: GenerateInvoiceInputDto
  ): Promise<GenerateInvoiceOutputDto> {
    const items = input.items.map(
      (item) =>
        new InvoiceItemEntity({
          id: new Id(item.id),
          name: item.name,
          price: item.price,
        })
    );

    const total = items.reduce((acc, item) => acc + item.price, 0); 

    const props = {
      id: new Id(input.id) || new Id(),
      name: input.name,
      document: input.document,
      street: input.street,
      number: input.number,
      complement: input.complement,
      city: input.city,
      state: input.state,
      zipCode: input.zipCode,
      items: items,
      total: total,
    };

    const invoice = new Invoice(props);
    await this._generateInvoiceRepository.generate(invoice);

    const generatedInvoice = await this._generateInvoiceRepository.find(
      invoice.id.id
    );

    return {
      id: invoice.id.id,
      name: invoice._name,
      document: invoice._document,
      street: invoice._street,
      number: invoice._number,
      complement: invoice._complement,
      city: invoice._city,
      state: invoice._state,
      zipCode: invoice._zipCode,
      items: invoice._items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
      })),
      total: total,
    };
  }
}
