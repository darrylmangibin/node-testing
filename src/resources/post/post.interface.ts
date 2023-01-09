import { Document } from 'mongoose';
import { UserDocument } from '../user/user.interface';

export interface PostData {
  title: string;
  description: string;
  user: string | UserDocument;
}

export interface PostDocument extends Document, PostData, AppTimestamps {}
