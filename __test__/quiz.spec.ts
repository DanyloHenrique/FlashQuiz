import { Response } from "express";
import request from "supertest";
import { app } from "../src/server";
import jwt from "jsonwebtoken";

require("dotenv").config(); // Carrega as variáveis do .env

const SECRET = process.env.SECRET || "DAKHFBAKFA4G51A8SDF14AS1F";

import { quizUseCase } from "../src/useCases/quiz/quiz-useCases";
import { Visibility } from "../src/domain/model/quiz.model";
import {
  userCreateUseCase,
  userLoginUseCase,
} from "../src/useCases/user/user-useCases";
// import { userObj, userTest } from "./user-test";
import { quizPayload, createdUser, token } from "./quiz-test";

// Mock do quizUseCase
jest.mock("../src/useCases/quiz/quiz-useCases", () => ({
  quizUseCase: {
    create: jest.fn(), // Mocka a função `create`
  },
}));

jest.mock("uuidv4", () => ({
  uuid: jest.fn(() => "fake-id"), // Mockando o ID para sempre retornar 'fake-id'
}));

let userLoggedToken: { token: string };

// describe("create user and login", () => {
//   it("useCases", async () => {
//     const user = await userCreateUseCase(userTest);
//     expect(user).toMatchObject({ user: userObj.toObject() });
//   });

//   it("useCases", async () => {
//     const email = userObj.getEmail();
//     const password = userObj.getPassword();

//     // const user = await userCreateUseCase(userTest);
//     userLoggedToken = await userLoginUseCase({ email, password });
//     expect(userLoggedToken);
//   });
// });

describe("Quiz Controller - Create", () => {
  (quizUseCase.create as jest.Mock).mockResolvedValue({
    id: "123",
    ...quizPayload,
  });

  it("✅ Deve criar um quiz com sucesso", async () => {
    if (token === null || undefined) return;

    const response = await request(app)
      .post("/quiz")
      .send(quizPayload)
      .set("Authorization", `Bearer ${token.token}`);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("sucess", true);
    expect(response.body.data).toMatchObject({
      id: "123",
      userId: "user123",
      title: quizPayload.title,
      description: quizPayload.description,
      visibility: quizPayload.visibility,
    });
  });

  it("❌ Deve falhar se o payload for inválido", async () => {
    const response = await request(app)
      .post("/quiz")
      .send({
        title: "", // Título inválido (vazio)
        visibility: "public",
        flashcardList: [{ term: 123, description: true }], // Inválido
      })
      .set("Authorization", `Bearer ${token.token}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});

describe("quiz controller - get all from user", () => {
  it("sucess", async () => {
    const response = await request(app)
      .get("/quiz/user")
      .set("Authorization", `Bearer ${token.token}`);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("sucess", true);
    expect(response.body.data).toMatchObject({
      title: quizPayload.title,
      description: quizPayload.description,
      visibility: quizPayload.visibility,
    });
  });
});

/* describe("Create quiz", () => {
  it("useCase", async () => {
    const quizCreated = await quizUseCase.create(quizTestDTO);

    expect(quizCreated).toEqual({ quiz: quizTestObj.toObject() });
  });
});
 */
