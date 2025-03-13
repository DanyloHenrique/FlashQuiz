import { uuid } from "uuidv4";
import { UserDTO } from "../dto/user.model.DTO";
import bcrypt from "bcrypt";
import { Quiz } from "./quiz.model";

export class User {
  readonly id: string;
  private name: string;
  private email: string;
  private password: string;
  private quiz: Quiz[] = [];
  readonly date_at: Date;

  constructor({ name, email, password }: UserDTO) {
    if (!email.includes("@")) throw new Error("Email inválido");

    this.id = uuid();
    this.name = name;
    this.email = email;
    this.password = password;
    this.date_at = new Date();
  }

  addQuiz(quizParam: Quiz) {
    return this.quiz.push(quizParam);
  }

  public toObject() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
    };
  }

  public toObjectAndMethods() {
    const { date_at, ...userWithoutDate } = this;
    return {
      userWithoutDate,
      getEmail: this.getEmail(),
      getName: this.getName(),
      getPassword: this.getPassword(),
      getId: this.getId(),
    };
  }

  public static async comparePassword(
    providedPassword: string,
    storedPasswordHash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(providedPassword, storedPasswordHash);
  }

  public getName() {
    return this.name;
  }
  public getEmail() {
    return this.email;
  }
  public getPassword(): string {
    return this.password;
  }

  public getId() {
    return this.id;
  }

  public setName(name: string) {
    return (this.name = name);
  }

  public setEmail(email: string) {
    return (this.email = email);
  }

  public setPassword(password: string) {
    return (this.password = password);
  }
}
