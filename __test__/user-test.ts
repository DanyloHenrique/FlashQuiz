import { UserDTO } from "../src/domain/dto/user.model.DTO";
import { User } from "../src/domain/model/user.model";

const userTest: UserDTO = {
    name: "Danylo",
    email: "danylohenriique@gmail.com",
    password: "1234",
  };
  const userObj = new User(userTest);

export {userObj, userTest}