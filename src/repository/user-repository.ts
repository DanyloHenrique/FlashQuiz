import { User } from "../domain/model/user.model";

const users: User[] = [];

export const userRepository = {
  create(userData: User) {
    users.push(userData);
    //prisma

    return { user: userData.toObject() };
  },

  getByEmail(email: string) {
    const foundUserByEmail = users.find((user) => user.getEmail() === email); // Busca pelo e-mail no array

    if (!foundUserByEmail) {
      return null;
    }
    return { user: foundUserByEmail };
  },

  getById(id: string) {
    const foundUser = users.find((user) => user.getId() === id); // Busca pelo e-mail no array

    if (!foundUser) return null;

    return { user: foundUser };
  },

  getAll() {
    if (!users) {
      return null;
    }
    return { users: users.map((user) => user.toObject()) }; // Retorna todos os usuários
  },

  update({
    userCurrentData,
    userUpdateData,
  }: {
    userCurrentData: User;
    userUpdateData: { name?: string; email?: string; password?: string };
  }) {
    if (!userCurrentData) return null;

    if (userUpdateData.name !== undefined) {
      userCurrentData.setName(userUpdateData.name);
    }

    if (userUpdateData.email !== undefined) {
      userCurrentData.setEmail(userUpdateData.email);
    }

    if (userUpdateData.password !== undefined) {
      userCurrentData.setPassword(userUpdateData.password);
    }

    return { user: userCurrentData.toObject() };
  },

  delete({ id }: { id: string }) {
    const userIndexInUsers = users.findIndex((user) => user.getId() === id);

    if (userIndexInUsers === -1) {
      return null;
    }

    const deletedUser = users.splice(userIndexInUsers, 1)[0];
    return { user: deletedUser.toObject() };
  },
};
