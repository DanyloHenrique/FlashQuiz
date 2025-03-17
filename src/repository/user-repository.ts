import { User } from "../domain/model/user.model";
import prisma from "../lib/prismaClient";

export const userRepository = {
  async create(userData: User) {
    const userCreated = await prisma.user.create({
      data: {
        id: userData.id,
        name: userData.getName(),
        email: userData.getEmail(),
        password: userData.getPassword(),
        create_at: userData.date_at,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });

    if (!userCreated) return null;
    const userObjResult = new User(userCreated);

    return { user: userObjResult.toObject() };
  },

  async getByEmail(email: string) {
    const foundUserByEmail = await prisma.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });

    if (!foundUserByEmail) {
      return null;
    }

    const userObjResult = new User(foundUserByEmail);

    return { user: userObjResult };
  },

  async getById(id: string) {
    const foundUserById = await prisma.user.findUnique({
      where: { id: id },
    });
    if (!foundUserById) return null;

    const userObjResult = new User(foundUserById);

    return { user: userObjResult };
  },

  async getAll() {
    const foundAllUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });

    const listUserObj = foundAllUsers.map((user) => new User(user));

    return { users: listUserObj.map((user) => user.toObject()) }; // Retorna todos os usuários
  },

  async update({
    userCurrentData,
    userUpdateData,
  }: {
    userCurrentData: User;
    userUpdateData: { name?: string; email?: string; password?: string };
  }) {
    if (!userCurrentData) return null;

    const userUpdated = await prisma.user.update({
      where: {
        id: userCurrentData.id,
      },
      data: userUpdateData,
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });

    const userObjResult = new User(userUpdated);

    return { user: userObjResult.toObject() };
  },

  async delete({ id }: { id: string }) {
    const deleteUser = await prisma.user.delete({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });

    const userObjResult = new User(deleteUser);

    return { user: userObjResult.toObject() };
  },
};
