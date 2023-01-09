import { Document } from 'mongoose';
import { PostDocument } from '../post/post.interface';
import { UserDocument } from '../user/user.interface';

export interface CommentData {
  body: string;
  user: string | UserDocument;
  post: string | PostDocument;
}

export interface CommentDocument extends Document, CommentData, AppTimestamps {}
