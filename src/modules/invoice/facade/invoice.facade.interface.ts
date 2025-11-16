import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from "../usecase/find-invoice/find-invoice.dto";
import { GenerateInvoiceInputDto, GenerateInvoiceOutputDto } from "../usecase/generate-invoice/generate-invoice.dto";

export interface InvoiceFacadeInterface {
  create(input: GenerateInvoiceInputDto): Promise<GenerateInvoiceOutputDto>;
  findInvoice(input: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO>;
}