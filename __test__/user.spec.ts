import { userUseCase } from "../src/useCases/user/user-useCases";
import { userRepository } from "../src/repository/user-repository";
import { User } from "../src/domain/model/user.model";
import { userObj, userTest } from "./user-test";

jest.mock("uuidv4", () => ({
  uuid: jest.fn(() => "fake-id"), // Mockando o ID para sempre retornar 'fake-id'
}));

describe("create user", () => {
  it("useCases", async () => {
    const user = await userUseCase.create(userTest);
    expect(user).toMatchObject({ user: userObj.toObject() });
  });

  it("repository", async () => {
    const user = await userRepository.create(userObj);
    expect(user).toMatchObject({ user: userObj.toObject() });
  });
});

describe("find user by email", () => {
  it("useCases", async () => {
    const userFounded = await userUseCase.getByEmail(userTest.email);
    expect(userFounded).toMatchObject({ user: userObj.toObject() });
  });

  it("repository", async () => {
    const userFounded = await userRepository.getByEmail(userTest.email);
    expect(userFounded).toMatchObject({ user: userObj.toObject() });
  });

  it("repository - user not found", async () => {
    const userFounded = await userRepository.getByEmail(
      "nonexistent@email.com",
    );
    expect(userFounded).toBe(null);
  });
});

describe("get all users", () => {
  it("useCase", async () => {
    const usersList = await userUseCase.getAll();

    if (usersList && "users" in usersList) {
      expect(usersList).toHaveProperty("users");
      expect(usersList.users.length).toBeGreaterThan(0);
    }
  });

  it("repository", async () => {
    const usersList = await userRepository.getAll();
    if (usersList && "users" in usersList) {
      expect(usersList).toHaveProperty("users");
      expect(usersList.users.length).toBeGreaterThan(0);
    }
  });
});

describe("create user with invalid data", () => {
  it("useCases", async () => {
    const invalidUserData = { name: "", email: "invalid", password: "123" };
    try {
      await userUseCase.create(invalidUserData);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe("Email inválido");
      }
    }
  });
});

describe("login user", () => {
  it("useCases", async () => {
    const email = userObj.getEmail();
    const password = userObj.getPassword();

    const userLoggedToken = await userUseCase.Login({ email, password });
    expect(userLoggedToken);
  });

  it("repository", async () => {
    const email = userObj.getEmail();
    const password = userObj.getPassword();

    const user = await userRepository.login({ email });
    expect(user).toBeDefined();
  });
});

describe("update user", () => {
  it("useCases", async () => {
    const name = "emily";

    console.log("🚀 ~ it ~ userObj -update Usecases:", userObj.toObject());
    const userUpdated = await userUseCase.update({
      id: userObj.id,
      dataToUpdateUser: { name },
    });

    userObj.setName(name);

    expect(userUpdated).toMatchObject({
      user: {
        userWithoutPasswordAndDate: {
          name: "emily",
          email: userObj.getEmail(),
        },
      },
    });
  });

  it("repository", async () => {
    const email = "emilycecly2020@gmail.com";

    const userUpdated = await userRepository.update({
      id: userObj.id,
      userData: { email },
    });

    console.log("🚀 ~ it ~ userUpdated -update repository:", userUpdated);
    userObj.setEmail(email);
    expect(userUpdated).toMatchObject({
      user: {
        userWithoutPasswordAndDate: {
          name: userObj.getName(),
          email: "emilycecly2020@gmail.com",
        },
      },
    });
  });
});

describe("delete user", () => {
  it("useCases", async () => {
    let usersList = await userRepository.getAll();
    if (!usersList) return;

    const userListLengthBeforeDeleting = usersList.users.length;

    const deletedUser = await userUseCase.delete(userObj.id);

    usersList = await userRepository.getAll();
    if (!usersList) return;
    const userListLengthAfterDeleting = usersList.users.length;

    if (!usersList) return;

    expect(userListLengthAfterDeleting).toBe(userListLengthBeforeDeleting - 1);
  });

  it("repository", async () => {
    let usersList = await userRepository.getAll();
    if (!usersList) return;

    const userListLengthBeforeDeleting = usersList.users.length;

    const deletedUser = await userRepository.delete({
      id: userObj.id,
    });

    usersList = await userRepository.getAll();
    if (!usersList) return;
    const userListLengthAfterDeleting = usersList.users.length;

    if (!usersList) return;

    //tamanho da lista depois é igual a tamanho da lista anterior - 1
    expect(userListLengthAfterDeleting).toBe(userListLengthBeforeDeleting - 1);
  });
});
