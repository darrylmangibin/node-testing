import memoryDatabase from '@/utils/database/memory.database';
import 'module-alias/register';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod: MongoMemoryReplSet | undefined;

beforeEach(async () => {
  mongod = await memoryDatabase();
});

afterEach(async () => {
  await mongod?.stop();

  await mongoose.disconnect();
  await mongoose.connection.close();
});
