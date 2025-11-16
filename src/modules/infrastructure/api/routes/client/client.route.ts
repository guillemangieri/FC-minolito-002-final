import express, { Request, Response } from "express";
import { AddClientFacadeInputDto } from "../../../../client-adm/facade/client-adm.facade.interface";
import ClientAdmFacadeFactory from "../../../../client-adm/factory/client-adm.facade.factory";
export const clientsRoute = express.Router();

clientsRoute.post("/", async (request: Request, response: Response) => {
  const facade = ClientAdmFacadeFactory.create();

  try {
    const {
      id,
      name,
      email,
      address,
      document,
      street,
      number,
      complement,
      city,
      state,
      zipCode,
    } = request.body;

    const missing = [
      "id",
      "name",
      "email",
      "document",
      "street",
      "number",
      "city",
      "state",
      "zipCode",
    ].filter((k) => !request.body?.[k]);
    if (missing.length) {
      return response
        .status(400)
        .json({
          error: `Ausencia de dados obrigatórios: ${missing.join(", ")}`,
        });
    }

    const clientDto: AddClientFacadeInputDto = {
      id,
      name,
      email,
      document,
      street,
      number,
      complement,
      city,
      state,
      zipCode,
    };

    return response.status(201).json({ id, name, email, document, street, number, complement, city, state, zipCode });
    response.status(201).send();
  } catch (error) {
    return response.status(400).json({ error: "Erro ao criar cliente" });
  }
});
