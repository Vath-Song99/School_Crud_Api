import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { Route } from "./routes/users.route";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import morgan from "morgan";
import { swaggerDocument } from "./utils/swagger";
import  requestTimeMiddleware from "./middlewares/requestTime";
import  errorHandler from "./middlewares/errorHandler";
import { StatusCode } from "./utils/consts";

dotenv.config();
const app: Application = express();

// Global Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.use(requestTimeMiddleware);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
const PATH = "/api/users";
app.get('/', async (req: Request, res:Response) =>{
  res.status(StatusCode.OK).json({
    message: "what is taht"
  })
})
app.use(PATH, Route )

// Catch-all route for handling unknown routes
app.all('*', (req: Request, res: Response, _next:NextFunction) => {
 
  _next(new Error(`page could be not found!`))
});

// Error handling middleware
app.use(errorHandler);


export default app