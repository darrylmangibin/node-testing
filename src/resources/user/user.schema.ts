import { Schema } from 'mongoose';
import { UserData } from './user.interface';

const UserSchema = new Schema<UserData>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      required: true,
      trim: true,
      enum: ['admin', 'user'],
      default: 'user',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default UserSchema;
