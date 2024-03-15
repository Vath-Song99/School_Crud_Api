import mongoose from  'mongoose'

 async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/School');
    console.log("Connected to MongoDB successfully!");
  } catch (error:any) {
    console.error("Error connecting to MongoDB:", error.message);
  }
}


export default connectToDatabase