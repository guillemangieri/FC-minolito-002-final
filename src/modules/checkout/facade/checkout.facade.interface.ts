// DTOs e interface da fachada de Checkout

export type PlaceOrderInputDTO = {
  clientId: string;
  products: Array<{ productId: string }>;
};

export type PlaceOrderOutputDTO = {
  id: string;                  // order id
  invoiceId: string | null;    // id da invoice ou null
  status: string;              // "approved" | "pending" | "declined" (ou o que seu domínio definir)
  total: number;
  products: Array<{ productId: string }>;
};

export default interface CheckoutFacadeInterface {
  placeOrder(input: PlaceOrderInputDTO): Promise<PlaceOrderOutputDTO>;
}
