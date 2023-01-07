import { model, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { UserData, UserDocument } from './user.interface';

import UserSchema from './user.schema';

UserSchema.plugin(paginate);

const User = model<UserData, PaginateModel<UserDocument>>('User', UserSchema);

export default User;
