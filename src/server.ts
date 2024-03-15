import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { Route } from "./routes/users.route";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import morgan from "morgan";
import { swaggerDocument } from "./utils/swagger";
import  connectToDatabase  from "./utils/connecToDb";
import  requestTimeMiddleware from "./middlewares/requestTime";
import  errorHandler from "./middlewares/errorHandler";

dotenv.config();
const app: Express = express();

// Global Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.use(requestTimeMiddleware);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
const PATH = "/users";
app.use(PATH, Route )

// Catch-all route for handling unknown routes
app.all('*', (req: Request, res: Response, _next:NextFunction) => {
 
  _next(new Error(`page could be not found!`))
});

// Error handling middleware
app.use(errorHandler);

// Connect to database
connectToDatabase();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[Server] is running on port ${PORT} and PATH ${PATH}`);
});
