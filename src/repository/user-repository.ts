import { User } from "../domain/model/user.model";

const users: User[] = [];

export const userRepository = {
  create(userData: User) {
    users.push(userData);
    //prisma

    return { user: userData.toObject() };
  },

  getByEmail(email: string) {
    const user = users.find((user) => user.getEmail() === email); // Busca pelo e-mail no array
    if (!user) {
      return null;
    }
    return { user: user.toObject() };
  },

  getAll() {
    if (!users) {
      return null;
    }
    return { users: users.map((user) => user.toObject()) }; // Retorna todos os usuários com a estrutura certa
  },

  login({ email, password }: { email: string; password?: string }) {
    const user = users.find((user) => user.getEmail() === email); // Busca pelo e-mail no array
    if (!user) {
      return null;
    }
    user.getPassword();

    return { user: user.toObjectAndMethods() };
  },

  update({
    id,
    userData,
  }: {
    id: string;
    userData: { name?: string; email?: string; password?: string };
  }) {
    const user = users.find((user) => user.getId() === id); // Busca pelo e-mail no array

    if (!user) {
      return null;
    }

    if (userData.name !== undefined) {
      user.setName(userData.name);
    }

    if (userData.email !== undefined) {
      user.setEmail(userData.email);
    }

    if (userData.password !== undefined) {
      user.setPassword(userData.password);
    }

    return { user: user.toObject() };
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
