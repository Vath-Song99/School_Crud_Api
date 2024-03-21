// utils/test-utils/dbHandler.utils.js

const mongoose = require('mongoose');
// const { MongoMemoryServer } = require('mongodb-memory-server');
import {MongoMemoryServer} from 'mongodb-memory-server'


const mongoServer = new MongoMemoryServer();
export const dbConnect = async () => {
  try{
    await mongoServer.start()
    const uri = await mongoServer.getUri();

    const mongooseOpts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false, // Disable buffering
      bufferTimeoutMS: 20000, // Set a higher timeout value (in milliseconds)
    };
  
   return await mongoose.connect(uri, mongooseOpts)
  }
  catch(error: unknown | any){
    console.log('external:',error)
  }
};

export const dbDisconnect = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};