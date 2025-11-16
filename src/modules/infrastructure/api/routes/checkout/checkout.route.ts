import express, { Request, Response } from "express";
import CheckoutFacadeFactory from "../../../../checkout/factory/checkout.facade.factory";

export const checkoutRoute = express.Router();

/**
 * Espera:
 * {
 *   "clientId": "1c",
 *   "products": [{ "productId": "1" }, { "productId": "2" }]
 * }
 */
checkoutRoute.post("/", async (req: Request, res: Response) => {
  const facade = CheckoutFacadeFactory.create();

  const { clientId, products } = req.body ?? {};
  if (!clientId || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: "Ausencia de dados obrigatórios: clientId, products[]." });
  }
  if (!products.every((p: any) => p?.productId)) {
    return res.status(400).json({ error: "Cada item em products deve conter productId" });
  }

  try {
    const output = await facade.placeOrder({
      clientId,
      products,
    });

    // output esperado pelo curso normalmente contém:
    // { id, invoiceId|null, status, total, products: [{ productId }, ...] }
    return res.status(201).json(output);
  } catch (err: any) {
    // Os testes de unidade do use case já cobrem cenários; na API retornamos 400 com a mensagem
    return res.status(400).json({ error: err?.message ?? "Erro ao processar checkout" });
  }
});
