// src/migrations/migrator.ts
import { SequelizeStorage, Umzug } from "umzug";
import { join } from "path";
import type { Sequelize } from "sequelize";

export const makeMigrator = (sequelize: Sequelize) => {
  return new Umzug({
    migrations: {
      glob: [
        // Só arquivos com prefixo de timestamp, ex: 2025.11.02T10.00.00.algo.ts
        "[0-9]*.*.ts",
        {
          cwd: join(__dirname),
          ignore: [
            "**/*.d.ts",
            "migrator.ts",
            "migrator-cli.ts",
          ],
        },
      ],
    },
    context: sequelize,
    storage: new SequelizeStorage({ sequelize }),
    // Evita logs verbosos com instâncias circulares durante testes
    logger: process.env.NODE_ENV === "test" ? undefined : console,
  });
};
