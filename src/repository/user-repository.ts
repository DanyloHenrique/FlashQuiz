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
};
