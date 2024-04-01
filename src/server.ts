import connectToDatabase from "./utils/connecToDb";
import app from "./app";
import path from "path";
import createConfig from "./utils/config";
import { logger, logInit } from "./utils/logger";
import EmailSender from "./utils/emailSender";
import NodemailerEmailApi from "./utils/nodeMailerEmailApi";
import MongoDBConnector from "./databases";

const PORT = process.env.PORT;

const startServer = async () => {
  try {
    const currentEnv = process.env.NODE_ENV || "development";
    const configPath = path.join(
      __dirname,
      currentEnv === "development"
        ? "../configs/.env"
        : currentEnv === "staging"
        ? "../configs/.env.staging"
        : "../configs/.env.production"
    );
    const config = createConfig(configPath);

    // Activate Logger
    logInit({ env: config.env, logLevel: config.logLevel });

    // Activate Email Sender with EmailAPI [NodeMailer]
    const emailSender = EmailSender.getInstance();
    emailSender.activate();
    emailSender.setEmailApi(new NodemailerEmailApi());

    // Activate Database
    const mongodb = MongoDBConnector.getInstance();
    await mongodb.connect({ url: config.mongo.url as string });

    // Start Server
    const server = app.listen(config.port, () => {
      logger.info("Server is listening on port: ", config.port);
    });

    const exitHandler = async () => {
      if (server) {
        server.close(async () => {
          logger.info("server closed!");
          await mongodb.disconnect();
          logger.info("mongodb disconnected!");

          // Gracefully Terminate
          process.exit(1); // terminate the process due to error
        });
      } else {
        await mongodb.disconnect(); // In case the server isn't running but DB needs to be disconnected
        logger.info("MongoDB disconnected.");
        process.exit(1);
      }
    };

    const unexpectedErrorHandler = (error: unknown) => {
      logger.error("unhandled error", { error });
      exitHandler();
    };

    // Error that might occur duing execution that not caught by any try/catch blocks
    process.on("uncaughtException", unexpectedErrorHandler); // Syncronous
    process.on("unhandledRejection", unexpectedErrorHandler); // Asyncronous

    // A termination signal typically sent from OS or other software (DOCKER, KUBERNETES)
    process.on("SIGTERM", () => {
      logger.info("SIGTERM received");
      if (server) {
        // Stop the server from accepting new request but keeps existing connection open until all ongoin request are done
        server.close();
      }
    });
  } catch (error) {
    logger.error("Failed to initialize application", { error });
    process.exit(1);
  }
};

startServer();
