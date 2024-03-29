import mongoose from "mongoose";
import { logger } from "../utils/logger";

export default class MongoDBConnector {
  private static instance: MongoDBConnector;
  private mongoUrl: string = "";
  private db = mongoose.connection;

  private constructor() {
    this.setupEventListeners();
  }

  public static getInstance(): MongoDBConnector {
    if (!MongoDBConnector.instance) {
      MongoDBConnector.instance = new MongoDBConnector();
    }

    return MongoDBConnector.instance;
  }

  public static resetInstance(): void {
    MongoDBConnector.instance = new MongoDBConnector();
  }

  private setupEventListeners(): void {
    this.db.on("connected", () => {
      logger.info("MongoDB connected");
    });

    this.db.on("error", (error) => {
      logger.error("Error in MongoDB connection", { error });
    });

    this.db.on("disconnected", () => {
      logger.info("MongoDB disconnected");
    });
  }

  public async connect({ url }: { url: string }): Promise<void> {
    this.mongoUrl = url;
    try {
      await mongoose.connect(this.mongoUrl);
      logger.info("Successfully connected to MongoDB");
    } catch (err) {
      logger.error("Initial MongoDB connection error", { err });
    }
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
    this.db.removeAllListeners();
    logger.info("MongoDB disconnected and listeners removed");
  }
}
