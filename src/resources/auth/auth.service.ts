import mongoose from 'mongoose';

import User from '@/resources/user/user.model';
import { UserData } from '@/resources/user/user.interface';
import ErrorException from '@/utils/exceptions/error.exception';
import comparePassword from '@/utils/password/compare.password';
import { AuthUpdatePasswordRequestBody } from './auth.interface';
import notFoundException from '@/utils/exceptions/notFound.exception';

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

  public login = async (body: Pick<UserData, 'email' | 'password'>) => {
    try {
      const user = await this.User.findOne({ email: body.email }).select('+password');

      const isMatchPassword = await comparePassword(body.password, user?.password);

      if (!user || !isMatchPassword) {
        throw new ErrorException('Invalid credentials', 401);
      }

      return user;
    } catch (error) {
      throw error;
    }
  };

  public updatePassword = async (userId: string, body: AuthUpdatePasswordRequestBody) => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const user = await this.User.findById(userId).select('+password');

      if (!user) {
        return notFoundException('No user found');
      }

      const isMatchPassword = await comparePassword(body.currentPassword, user.password);

      if (!isMatchPassword) {
        throw new ErrorException('Password incorrect', 400);
      }

      user.password = body.newPassword;

      const updatedUser = await user.save({ session });

      await session.commitTransaction();
      await session.endSession();

      return updatedUser;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();

      throw error;
    }
  };
}

export default AuthService;
