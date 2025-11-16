import express, { Request, Response } from "express";
import ProductAdmFacadeFactory from "../../../../product-adm/factory/facade.factory";
import { AddProductFacadeInputDto } from "../../../../product-adm/facade/product-adm.facade.interface";

export const productRoute = express.Router();
/*
productRoute.get("/", async (request: Request, response: Response) => {
    const facade = ProductAdmFacadeFactory.create();
    const productDto: AddProductFacadeInputDto = {
      id: request.body.id,
      name: request.body.name,
      description: request.body.description,
      stock: request.body.stock,
      purchasePrice: request.body.purchasePrice,
    };
    try {
      const result = await facade.addProduct(productDto);
      response.status(201).json(result);
    } catch (error) {
      response.status(400).send( error);
    }
});
*/
productRoute.post("/", async (req: Request, res: Response) => {
  const facade = ProductAdmFacadeFactory.create();

  const productDto: AddProductFacadeInputDto = {
    id: req.body.id,
    name: req.body.name,
    description: req.body.description,
    purchasePrice: req.body.purchasePrice,
    stock: req.body.stock,
  };

  
  if (!productDto.id||!productDto.name||!productDto.description||productDto.purchasePrice === undefined ||productDto.stock === undefined  ) {
    return res.status(400).json({error: "Ausencia de dados obrigatórios: id, name, description, purchasePrice, stock"});
  }

  try {
    //const result = await facade.addProduct(productDto);

    const facade = ProductAdmFacadeFactory.create();
    await facade.addProduct(productDto);

    return res.status(201).json({
      id: productDto.id,
      name: productDto.name,
      description: productDto.description,
      purchasePrice: productDto.purchasePrice,
      stock: productDto.stock,
    });
  } catch (err: any) {
    console.error("POST /products error:", err);
    return res.status(500).json({
      error: err.message ?? "Erro interno no servidor",
    });
  }
});