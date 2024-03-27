import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { Route } from "./routes/v1/users.route";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import morgan from "morgan";
import  requestTimeMiddleware from "./middlewares/requestTime";
import  errorHandler from "./middlewares/errorHandler";
import { StatusCode } from "./utils/consts";
import redoc from "redoc-express"
const swaggerDocument = require("../public/swagger.json")

dotenv.config();
const app: Application = express();


// Global Middleware
app.use(express.json());
app.use(express.static('public'))
app.use(cors());
app.use(morgan("tiny"));
app.use(requestTimeMiddleware);
app.get(
  "/docs",
  redoc({
    title: "API Docs",
    specUrl: "/swagger.json",
    redocOptions: {
      theme: {
        colors: {
          primary: {
            main: "#6EC5AB",
          },
        },
        typography: {
          fontFamily: `"museo-sans", 'Helvetica Neue', Helvetica, Arial, sans-serif`,
          fontSize: "15px",
          lineHeight: "1.5",
          code: {
            code: "#87E8C7",
            backgroundColor: "#4D4D4E",
          },
        },
        menu: {
          backgroundColor: "#ffffff",
        },
      },
    },
  })
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
const PATH = "/api/v1";
app.get('/', async (req: Request, res:Response) =>{
  res.status(StatusCode.OK).json({
    message: "this is my api /api/v1"
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