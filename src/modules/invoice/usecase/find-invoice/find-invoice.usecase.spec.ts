import Invoice from "../../domain/invoice";
import FindInvoiceUseCase from "./find-invoice.usecase";


const MockInvoiceRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn(),
  };
};

const invoice1 = {
  id: "1",
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
  //createdAt: new Date(),
};

describe("FindInvoiceUseCase", () => {
  it("should find an existing invoice", async () => {
    const invoiceRepository = MockInvoiceRepository();
    const findInvoiceUseCase = new FindInvoiceUseCase(invoiceRepository); 

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

    invoiceRepository.find.mockResolvedValue(invoice1);

    const result = await findInvoiceUseCase.execute({ id: "1" });

    expect(result).toEqual({
      id: "1",
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
    });
  });
});


