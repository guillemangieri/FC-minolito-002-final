import express, { Request, Response } from "express";

import { InvoiceFacadeFactory } from "../../../../invoice/factory/invoice.facade.factory";
import { 
  FindInvoiceUseCaseInputDTO, 
  FindInvoiceUseCaseOutputDTO 
} from "../../../../invoice/usecase/find-invoice/find-invoice.dto";

export const invoicesRoute = express.Router();

invoicesRoute.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Parâmetro id é obrigatório" });
  }

  
try {
    const facade = InvoiceFacadeFactory.create();
    const input: FindInvoiceUseCaseInputDTO = { id };

    const invoice: FindInvoiceUseCaseOutputDTO | null =
      await facade.findInvoice(input);  // ← nome bate com a facade

    if (!invoice) {
      return res.status(404).json({ error: "Invoice não encontrada" });
    }

    return res.status(200).json(invoice);
  } catch (error: any) {
    console.error("GET /invoices/:id error:", error);

    const msg = (error?.message || "").toLowerCase();
    if (msg.includes("not found") || msg.includes("não encontrada")) {
      return res.status(404).json({ error: error.message });
    }

    return res.status(500).json({
      error: error?.message ?? "Erro interno ao buscar invoice",
    });
  }
});
