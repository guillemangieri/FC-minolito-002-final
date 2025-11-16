import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from "../usecase/find-invoice/find-invoice.dto";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import { GenerateInvoiceInputDto, GenerateInvoiceOutputDto } from "../usecase/generate-invoice/generate-invoice.dto";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import { InvoiceFacadeInterface } from "./invoice.facade.interface";

export class InvoiceFacade implements InvoiceFacadeInterface {
  
  constructor(
    private generateInvoiceUseCase: GenerateInvoiceUseCase,
    private findInvoiceUseCase: FindInvoiceUseCase,
  ) {}

  create(input: GenerateInvoiceInputDto): Promise<GenerateInvoiceOutputDto> {
    return this.generateInvoiceUseCase.execute(input);
  }

  findInvoice(input: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO> {
    return this.findInvoiceUseCase.execute(input);
  }
}