import {db} from "../src/utils/db.server";

type User = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

type Ressource = {
  title: string;
  description: string;
  url: string;
}

type Collection = {
  title: string;
  description: string;
}

async function seed() {
  await Promise.all(
      getUsers().map(user => db.user.create({
        data: {...user}
      }))
  )

  const user = await db.user.findFirst({
    where: {
      username: "john_doe"
    },
  })

  await Promise.all(
      getRessources().map(ressource => db.ressource.create({
        data: {
          ...ressource,
          authorId: user.id
        }
      }))
  )

  const ressources = await db.ressource.findMany({
    where: {
      authorId: user.id
    }
  })

  await Promise.all(
      getCollections().map(collection => db.collection.create({
        data: {
          ...collection,
          authorId: user.id,
          ressources: {
            connect: ressources.map(ressource => ({id: ressource.id}))
          }
        }
      }))
  )
}

void seed()

function getUsers(): Array<User> {
  return [
    {
      username: "john_doe",
      firstName: "John",
      lastName: "Doe",
      email: "jon@example.com",
      password: "password"
    },
    {
      username: "jane_doe",
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      password: "password"
    },]
}

function getRessources(): Array<Ressource> {
  return [
    {
      title: "Ressource 1",
      description: "Description 1",
      url: "https://example.com"
    },
    {
      title: "Ressource 2",
      description: "Description 2",
      url: "https://example.com"
    },
  ]
}

function getCollections(): Array<Collection> {
  return [
    {
      title: "Collection 1",
      description: "Description 1",
    },
    {
      title: "Collection 2",
      description: "Description 2",
    },
  ]
}