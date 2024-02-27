import express from "express";
import type {Request, Response} from "express";
import {body, validationResult} from "express-validator";

import * as UserService from "./user.service";

export const userRouter = express.Router();

enum userRoutes {
  signup = "/signup",
  signin = "/signin",
  get = "/:id",
  list = "/"
}

// GET /users
userRouter.get(userRoutes.list, async (req: Request, res: Response) => {
  try {
    const users = await UserService.listUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

// GET /users/:id
userRouter.get(userRoutes.get, async (req: Request, res: Response) => {
  const validationResultErrors = validationResult(req);

  if (!validationResultErrors.isEmpty()) {
    res.status(400).json({errors: validationResultErrors.array()});
    return;
  }

  try {
    const user = await UserService.getUserById(req.params.id);
    if (!user) {
      res.status(404).json({message: "User not found"});
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// POST /users/signup
userRouter.post(userRoutes.signup, body("username").isString(), body("email").isString(), body("password").isString(), async (req: Request, res: Response) => {
  const validationResultErrors = validationResult(req);

  if (!validationResultErrors.isEmpty()) {
    res.status(400).json({errors: validationResultErrors.array()});
    return;
  }

  const {username, email, password} = req.body;

  try {
    const userExists = await UserService.checkUserExists(username, email);

    if (userExists) {
      res.status(400).json({message: "User already exists"});
    } else {
      const user = await UserService.signUp(username, email, password);
      res.status(201).json(user);
    }

  } catch (error) {
    res.status(500).send(error);
  }
});

// POST /users/signin
userRouter.post(userRoutes.signin, body("username").isString(), body("password").isString(), async (req: Request, res: Response) => {
  const validationResultErrors = validationResult(req);

  if (!validationResultErrors.isEmpty()) {
    res.status(400).json({errors: validationResultErrors.array()});
    return;
  }

  const {username, password} = req.body;

  try {
    const user = await UserService.signIn(username, password);
    if (!user) {
      res.status(401).json({message: "Invalid credentials"});
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// PUT /users/:id

userRouter.put(userRoutes.get, async (req: Request, res: Response) => {
  const validationResultErrors = validationResult(req);

  if (!validationResultErrors.isEmpty()) {
    res.status(400).json({errors: validationResultErrors.array()});
    return;
  }

  const {firstName, lastName} = req.body;

  try {
    const user = await UserService.updateUser(req.params.id, {firstName, lastName});
    if (!user) {
      res.status(404).json({message: "User not found"});
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});