import { QuizDTO } from "../src/domain/dto/quiz.model.DTO";
import { Visibility } from "../src/domain/model/quiz.model";
import { User } from "../src/domain/model/user.model";
import { userUseCase } from "../src/useCases/user/user-useCases";
import { userObj, userTest } from "./user-test";

const { email, password } = userTest;

// let createdUser: {
//   user: {
//     userWithoutPasswordAndDate: Omit<
//       User,
//       | "password"
//       | "date_at"
//       | "addQuiz"
//       | "toObject"
//       | "toObjectAndMethods"
//       | "getName"
//       | "getEmail"
//       | "getPassword"
//       | "getId"
//       | "setName"
//       | "setEmail"
//       | "setPassword"
//     >;
//   };
// };
let createdUser: any;
let token: { token: string };
let quizPayload: QuizDTO;

async function main() {
  const { email, password } = userTest;
  createdUser = await userUseCase.create(userTest);
  token = await userUseCase.Login({ email, password });

  // Verifique se o token foi gerado corretamente
  if (!token || !token.token) {
    throw new Error("Token não gerado");
  }
}
// Chamar a função assíncrona e aguardar a resolução antes de exportar os valores
async function prepare() {
  await main();

  quizPayload = {
    userId: createdUser.id,
    title: "Meu Quiz",
    description: "Descrição do Quiz",
    visibility: Visibility.PUBLIC,
    flashcardList: [
      { term: "Pergunta 1", description: "Resposta 1" },
      { term: "Pergunta 2", description: "Resposta 2" },
    ],
  };

  // Aqui os dados já estarão corretamente inicializados
  console.log("🚀 ~ prepare ~ token:", token);
  return { quizPayload, createdUser, token };
}

prepare();

export { quizPayload, createdUser, token };
