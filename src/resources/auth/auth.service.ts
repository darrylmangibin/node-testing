import mongoose from 'mongoose';

import User from '@/resources/user/user.model';
import { UserData } from '@/resources/user/user.interface';
import ErrorException from '@/utils/exceptions/error.exception';

class AuthService {
  private User = User;

  public register = async (body: UserData) => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const isUserExists = Boolean(await this.User.findOne({ email: body.email }));

      if (isUserExists) {
        throw new ErrorException('Email already exists', 400);
      }

      const [user] = await this.User.create([body], { session });

      await session.commitTransaction();
      await session.endSession();

      return user;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();

      throw error;
    }
  };
}

export default AuthService;
