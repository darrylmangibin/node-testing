import { Document } from 'mongoose';

export type UserRole = 'admin' | 'user';

export interface UserData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UserDocument extends Document, UserData, AppTimestamps {}
