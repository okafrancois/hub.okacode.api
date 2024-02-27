import {db} from "../utils/db.server";

type Ressource = {
  id?: string;
  title: string;
  description: string;
  url: string;
  authorId: string;
}
export const listRessources = async (): Promise<Ressource[]> => {
  return db.ressource.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      url: true,
      authorId: true,
    }
  })
}

export const createRessource = async (ressource: Omit<Ressource, "id">): Promise<Ressource> => {
  const {title, description, authorId, url} = ressource;

  return db.ressource.create({
    data: {
      title,
      description,
      authorId,
      url
    },
    select: {
      id: true,
      title: true,
      description: true,
      authorId: true,
      url: true
    }
  })
}

export const updateRessource = async (id: string, ressource: Omit<Ressource, "id">): Promise<Ressource | null> => {
  const {title, description, url} = ressource;

  return db.ressource.update({
    where: {
      id
    },
    data: {
      title,
      description,
      url
    },
    select: {
      id: true,
      title: true,
      description: true,
      authorId: true,
      url: true
    }
  })
}

export const deleteRessource = async (id: string): Promise<Ressource | null> => {
  return db.ressource.delete({
    where: {
      id
    }
  })
}