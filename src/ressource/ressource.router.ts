import express from "express";
import type {Request, Response} from "express";
import {body, validationResult} from "express-validator";
import * as jwt from "jsonwebtoken";
import * as CollectionService from "./ressource.service";


enum ressourceRoutes {
  base = "/",
  param = "/:id",
}

export const ressourceRouter = express.Router();

// GET /ressource
ressourceRouter.get(ressourceRoutes.base, async (req: Request, res: Response) => {
  try {
    const ressources = await CollectionService.listRessources();
    res.status(200).json(ressources);
  } catch (error) {
    res.status(500).send(error);
  }
});

// POST /ressource
ressourceRouter.post(ressourceRoutes.base, async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];

  // get user id from token
  const decoded = jwt.decode(token);

  if (!decoded) {
    res.status(401).json({message: "Unauthorized"});
    return;
  }

  const authorId = (decoded as { id: string }).id;

  const {title, description, url} = req.body;

  try {
    const ressource = await CollectionService.createRessource({title, description, url, authorId});
    res.status(201).json(ressource);
  } catch (error) {
    res.status(500).send(error);
  }
});

// PUT /ressource/:id
ressourceRouter.put(ressourceRoutes.param, async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];

  // get user id from token
  const decoded = jwt.decode(token);

  if (!decoded) {
    res.status(401).json({message: "Unauthorized"});
    return;
  }

  const authorId = (decoded as { id: string }).id;

  const {title, description, url} = req.body;

  try {
    const ressource = await CollectionService.updateRessource(req.params.id, {title, description, url, authorId});
    if (!ressource) {
      res.status(404).json({message: "Ressource not found"});
    } else {
      res.status(200).json(ressource);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// DELETE /ressource/:id
ressourceRouter.delete(ressourceRoutes.param, async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];

  // get user id from token
  const decoded = jwt.decode(token);

  if (!decoded) {
    res.status(401).json({message: "Unauthorized"});
    return;
  }

  try {
    const ressource = await CollectionService.deleteRessource(req.params.id);
    if (!ressource) {
      res.status(404).json({message: "Ressource not found"});
    } else {
      res.status(200).json(ressource);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});