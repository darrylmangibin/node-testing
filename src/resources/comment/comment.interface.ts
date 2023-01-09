import { Document, Types } from 'mongoose';
import { PostDocument } from '../post/post.interface';
import { UserDocument } from '../user/user.interface';

export interface CommentData {
  body: string;
  user: Types.ObjectId | UserDocument;
  post: Types.ObjectId | PostDocument;
}

export interface CommentDocument extends Document, CommentData, AppTimestamps {}
