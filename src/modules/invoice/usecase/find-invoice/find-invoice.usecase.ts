import { InvoiceItemEntity } from "../../domain/invoice-items";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from "./find-invoice.dto";

export default class FindInvoiceUseCase {
  constructor(private invoiceRepository: InvoiceGateway) {
    this.invoiceRepository = invoiceRepository;
  }

  async execute(id: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO> {
    const invoice = await this.invoiceRepository.find(id.id);

    const total = invoice.items.reduce((acc:number, item:InvoiceItemEntity) => acc + item.price, 0);
    return {
      id: invoice.id,
      name: invoice.name,
      document: invoice.document,
      address: {
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode,
      },
      items: invoice.items,
      total: total,
      createdAt: invoice.createdAt,
      
    };
  }
}
