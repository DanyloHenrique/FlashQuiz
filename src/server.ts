const express = require("express");
import { errorHandler } from "./middleware/errorHandler";
import userRoutes from "./routes/user-routes";
import quizRouter from "./routes/quiz-routes";
import flashcardRouter from "./routes/flashcard-routes";
var cors = require("cors");
require("dotenv").config();

export const app = express();

app.use(express.json());

const corsOption = {
  origin: ["http://0.0.0.0:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsOption));

//chamando as rotas
app.use(userRoutes);
app.use(quizRouter);
app.use(flashcardRouter);
app.use(errorHandler);

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
