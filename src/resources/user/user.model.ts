import hashPassword from '@/utils/password/hash.password';
import { model, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { UserData, UserDocument } from './user.interface';

import UserSchema from './user.schema';

UserSchema.plugin(paginate);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await hashPassword(this.password);

  next();
});

const User = model<UserData, PaginateModel<UserDocument>>('User', UserSchema);

export default User;
