import {db} from "../utils/db.server";

type Collection = {
  id?: string;
  title: string;
  description: string;
  authorId: string;
  ressources?: Ressource[];
}

type Ressource = {
  id?: string;
  title: string;
  description: string;
  url: string;
  authorId: string;
}
export const listCollections = async (): Promise<Collection[]> => {
  return db.collection.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      authorId: true,
    }
  })
}

export const getCollection = async (id: string): Promise<Collection | null> => {
  return db.collection.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      title: true,
      description: true,
      authorId: true,
    }
  })
}

export const getRessources = async (id: string): Promise<Ressource[]> => {
  return db.ressource.findMany({
    where: {
      collectionId: id
    }
  })
}

export const createCollection = async (collection: Omit<Collection, "id">): Promise<Collection> => {
  const {title, description, authorId, ressources} = collection;

  return db.collection.create({
    data: {
      title,
      description,
      authorId,
      ressources: {
        create: ressources
      }
    },
    select: {
      id: true,
      title: true,
      description: true,
      authorId: true,
    }
  })
}

export const updateCollection = async (id: string, collection: Omit<Collection, "id">): Promise<Collection | null> => {
  const {title, description, ressources} = collection;

  const updatedCollection = await db.collection.update({
    where: {
      id
    },
    data: {
      title,
      description,
    },
    select: {
      id: true,
      title: true,
      description: true,
      authorId: true,
    }
  })

  if (ressources) {
    for (const ressource of ressources) {
      if (ressource.id) {
        await db.ressource.update({
          where: {
            id: ressource.id
          },
          data: ressource
        })
      } else {
        await db.ressource.create({
          data: {
            ...ressource,
            collectionId: id
          }
        })
      }
    }
  }


  return updatedCollection;
}

export const deleteCollection = async (id: string): Promise<Collection | null> => {
  return db.collection.delete({
    where: {
      id
    }
  })
}