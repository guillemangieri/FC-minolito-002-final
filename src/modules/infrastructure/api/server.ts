import { buildApp } from "./express";
import { setupDb } from "./database";

const port = process.env.PORT || 3000;

async function start() {
  try {
    await setupDb();
    const app = buildApp();
    app.listen(port, () => {
      console.log(`Servidor observando a porta ${port}`);
    });
  } catch (err) {
    console.error("Erro ao iniciar servidor:", err);
    process.exit(1);
  }
}

start();
