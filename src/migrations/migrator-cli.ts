// src/migrations/migrator-cli.ts
import { Sequelize } from "sequelize";
import { join } from "path";
import { makeMigrator } from "./migrator";

async function run() {
  const cmd = process.argv[2] || "up"; // up | down | reset

  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: join(process.cwd(), "db.sqlite"),
    logging: console.log,
  });

  const migrator = makeMigrator(sequelize);

  if (cmd === "up") {
    await migrator.up();
  } else if (cmd === "down") {
    await migrator.down();
  } else if (cmd === "reset") {
    await migrator.down({ to: 0 as const }); // 👈 fixa o literal
    // alternativa: await migrator.down({ to: 0 as 0 });
  } else {
    console.log("Comando inválido. Use: up | down | reset");
  }

  await sequelize.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
