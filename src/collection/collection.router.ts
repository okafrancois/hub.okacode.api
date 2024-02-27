import express from "express";
import type {Request, Response} from "express";
import {body, validationResult} from "express-validator";
import * as jwt from "jsonwebtoken";
import * as CollectionService from "./collection.service";

export const collectionRouter = express.Router();

// GET /collections
collectionRouter.get("/", async (req: Request, res: Response) => {
  try {
    const users = await CollectionService.listCollections();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

// GET /collections/:id
collectionRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const user = await CollectionService.getCollection(req.params.id);
    if (!user) {
      res.status(404).json({message: "Collection not found"});
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// GET /collections/:id/ressources
collectionRouter.get("/:id/ressources", async (req: Request, res: Response) => {
  try {
    const ressources = await CollectionService.getRessources(req.params.id);
    res.status(200).json(ressources);
  } catch (error) {
    res.status(500).send(error);
  }
});

// POST /collections

collectionRouter.post("/", async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];

  // get user id from token
  const decoded = jwt.decode(token);

  if (!decoded) {
    res.status(401).json({message: "Unauthorized"});
    return;
  }

  const authorId = (decoded as { id: string }).id;

  const {title, description, ressources} = req.body;

  try {
    const collection = await CollectionService.createCollection({title, description, authorId, ressources});
    res.status(201).json(collection);
  } catch (error) {
    res.status(500).send(error);
  }
});

// PUT /collections/:id
collectionRouter.put("/:id", async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];

  // get user id from token
  const decoded = jwt.decode(token);

  if (!decoded) {
    res.status(401).json({message: "Unauthorized"});
    return;
  }

  const {title, description, ressources, authorId} = req.body;

  try {
    const collection = await CollectionService.updateCollection(req.params.id, {
      authorId,
      title, description, ressources
    });
    if (!collection) {
      res.status(404).json({message: "Collection not found"});
    } else {
      res.status(200).json(collection);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// DELETE /collections/:id
collectionRouter.delete("/:id", async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];

  // get user id from token
  const decoded = jwt.decode(token);

  if (!decoded) {
    res.status(401).json({message: "Unauthorized"});
    return;
  }

  try {
    const collection = await CollectionService.deleteCollection(req.params.id);
    if (!collection) {
      res.status(404).json({message: "Collection not found"});
    } else {
      res.status(200).json(collection);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});