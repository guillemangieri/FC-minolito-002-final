import express, { Express } from "express";
import { productRoute } from "./routes/product/product.route";
import { clientsRoute } from "./routes/client/client.route";
import { checkoutRoute } from "./routes/checkout/checkout.route";
import { invoicesRoute } from "./routes/invoice/invoice.route";

export function buildApp(): Express {
  const app: Express = express();

  app.use(express.json());

  app.use("/products", productRoute);
  app.use("/clients", clientsRoute);
  app.use("/checkout", checkoutRoute);
  app.use("/invoice", invoicesRoute);

  app.get("/health", (req, res) => {
    res.json({
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  return app;
}
