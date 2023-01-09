import hashPassword from '@/utils/password/hash.password';
import { model, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { UserData, UserDocument } from './user.interface';
import Post from '@/resources/post/post.model';

import UserSchema from './user.schema';
import Comment from '../comment/comment.model';

UserSchema.plugin(paginate);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await hashPassword(this.password);

  next();
});

UserSchema.pre<UserDocument>('remove', async function (next) {
  await Post.deleteMany({ user: this._id });
  await Comment.deleteMany({ user: this._id });

  next();
});

const User = model<UserData, PaginateModel<UserDocument>>('User', UserSchema);

export default User;
