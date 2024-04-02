import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import morgan from "morgan";
import requestTimeMiddleware from "./middlewares/requestTime";
import errorHandler from "./middlewares/errorHandler";
import { StatusCode } from "./utils/consts";
import redoc from "redoc-express";
import loggerMiddleware from "./middlewares/loggerMinddleware";
import { BaseCustomError } from "./errors/baseCustomError";
import path from "path";
import { RegisterRoutes } from "./routes/v1/routes";
import axios from "axios";
const swaggerDocument = require("../public/swagger.json");
const app: Application = express();
import dotenv from 'dotenv'
import { Route } from "./routes/v1/users.route";

dotenv.config( { path: 'configs/.env'})
// Global Middleware
app.use(express.json());
app.use(express.static("public"));
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
app.use(loggerMiddleware);
// app.set('views', 'src/views')
// Set the view engine to Pug
app.set("view engine", "pug");

// Set the views directory
app.set("views", path.join(__dirname, "views"));

// Initialize Passport and restore authentication state from session



const PATH = '/api/v1'
app.use(PATH, Route )
app.get('/', async (req: Request, res: Response) =>{
  res.render('pages/auth')
})
// RegisterRoutes(app);



// Catch-all route for handling unknown routes
app.all("*", async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const error = new BaseCustomError(
      "Page could be not found!",
      StatusCode.NotFound
    );
    if (error) {
      throw error;
    }
  } catch (error: unknown) {
    _next(error);
  }
});

// Error handling middleware
app.use(errorHandler);

export default app;
