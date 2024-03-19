import mongoose from  'mongoose'
import dotenv from 'dotenv';

dotenv.config();

const URL = process.env.MONGODB_URI || '';

 async function connectToDatabase() {
  try {
    await mongoose.connect(URL);
    console.log("Connected to MongoDB successfully!");
  } catch (error:any) {
    console.error("Error connecting to MongoDB:", error.message);
  }
}


export default connectToDatabase