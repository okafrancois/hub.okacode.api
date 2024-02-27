import {db} from "../utils/db.server";
import {hashSync, compareSync} from "bcrypt";
import * as jwt from "jsonwebtoken";

type User = {
  id: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  token?: string;
}
export const listUsers = async (): Promise<User[]> => {
  return db.user.findMany({
    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
      email: true,
    }
  })
}

export const getUserById = async (id: string): Promise<User | null> => {
  return db.user.findUnique({
    where: {
      id
    }
  })
}

// Sign up a new user
export const signUp = async (username: string, email: string, password: string): Promise<User> => {
  const newUser = await db.user.create({
    data: {
      username,
      email,
      password: hashSync(password, 10)
    },
    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
      email: true
    }
  })

  return {
    ...newUser,
    token: jwt.sign({id: newUser.id}, process.env.JWT_SECRET, {expiresIn: "1h"})
  }
}

// Sign in a user with username|email and password
export const signIn = async (username: string, password: string): Promise<User | null> => {
  const user = await db.user.findFirst({
    where: {
      OR: [
        {
          username
        },
        {
          email: username
        }
      ]
    }
  })

  if (user && compareSync(password, user.password)) {
    return {
      ...user,
      token: jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: "1h"})
    }
  }

  return null
}

export const checkUserExists = async (username: string, email: string): Promise<boolean> => {
  const user = await db.user.findFirst({
    where: {
      OR: [
        {
          username
        },
        {
          email
        }
      ]
    }
  })

  return !!user
}

export const updateUser = async (id: string, user: Partial<User>): Promise<User | null> => {
  const {firstName, lastName} = user;

  return db.user.update({
    where: {
      id
    },
    data: {
      firstName,
      lastName
    },
    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
      email: true
    }
  })
}