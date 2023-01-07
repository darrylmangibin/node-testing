import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import 'dotenv';

const memoryDatabase = async () => {
  try {
    const mongod = await MongoMemoryReplSet.create();

    const uri = mongod.getUri();

    mongoose.set('strictQuery', true);

    await mongoose.connect(uri, {
      dbName: process.env.MONGO_DB_NAME,
    });

    return mongod;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default memoryDatabase;
