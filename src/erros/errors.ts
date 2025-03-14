export enum HttpStatus {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: HttpStatus = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class RequestDataMissingError extends AppError {
  constructor() {
    super("Faltaram dados necessários na requisição", HttpStatus.BAD_REQUEST);
  }
}

export class NotFoundError extends AppError {
  constructor(entity?: string) {
    console.log("🚀 ~ NotFoundError ~ constructor ~ entity:", entity);
    let message: string;
    if (entity !== undefined) {
      message = `${entity} não encontrado`;
    } else {
      message = `dado não encontrado`;
    }
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class EmailAlreadyUsedError extends AppError {
  constructor() {
    super("Email já cadastrado", HttpStatus.BAD_REQUEST);
  }
}

export class EmailOrPasswordInvalidsError extends AppError {
  constructor() {
    super(`Email ou senha inválidos`, HttpStatus.BAD_REQUEST);
  }
}

export class NotPermissionError extends AppError {
  constructor() {
    super(
      `Você não tem permissão para atualizar este usuário!`,
      HttpStatus.FORBIDDEN,
    );
  }
}

export class NotLoggedError extends AppError {
  constructor() {
    super(`Você precisa estar logado`, HttpStatus.UNAUTHORIZED);
  }
}
