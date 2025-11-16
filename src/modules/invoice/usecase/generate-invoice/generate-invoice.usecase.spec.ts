import Address from "../../../@shared/domain/value-object/address";
import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const MockInvoiceRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn(),
  };
};

describe("generate-invoice usecase unit test", () => {
  it("should generate a new invoice", async () => {

    const invoiceRepository = MockInvoiceRepository();
    const generateInvoiceUseCase = new GenerateInvoiceUseCase(
      invoiceRepository
    );


    const input = {
      name: "Gui Mangieri",
      document: "123.456.789-00",
      address: {
        street: "Esmeralda",
        number: "513",
        complement: "Apto 205",
        city: "Cuiabá",
        state: "MT",
        zipCode: "78000-000",
      },
      items: [
        {
          id: "1",
          name: "Product 1",
          price: 100,
        },
        {
          id: "2",
          name: "Product 2",
          price: 200,
        },
      ],
      total: 300,
    };

    const invoiceGenerated = await generateInvoiceUseCase.execute({
      name: input.name,
      document: input.document,
      street: input.address.street,
      number: input.address.number,
      complement: input.address.complement,
      city: input.address.city,
      state: input.address.state,
      zipCode: input.address.zipCode,
      items: input.items,
    });

    const addressGenerated = {
      street: invoiceGenerated.street,
      number: invoiceGenerated.number,
      complement: invoiceGenerated.complement,
      city: invoiceGenerated.city,
      state: invoiceGenerated.state,
      zipCode: invoiceGenerated.zipCode,
    };

    const generateInvoiceFinal = {
      name: invoiceGenerated.name,
      document: invoiceGenerated.document,
      address: addressGenerated,
      items: invoiceGenerated.items,
      total: invoiceGenerated.total,
    };

    expect(generateInvoiceFinal).toEqual(input);
    expect(invoiceRepository.generate).toHaveBeenCalled();
  });
});
