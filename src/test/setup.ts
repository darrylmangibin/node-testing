import memoryDatabase from '@/utils/database/memory.database';
import 'module-alias/register';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod: MongoMemoryReplSet | undefined;

beforeAll(async () => {
  mongod = await memoryDatabase();
});

afterEach(async function () {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongod?.stop();

  await mongoose.disconnect();
  await mongoose.connection.close();
});
