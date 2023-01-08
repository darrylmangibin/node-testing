import notFoundException from '@/utils/exceptions/notFound.exception';
import mongoose from 'mongoose';
import { UserData } from './user.interface';
import User from './user.model';

class UserService {
  private User = User;

  public findUserById = async (userId: string) => {
    try {
      const user = await this.User.findById(userId);

      if (!user) {
        return notFoundException('User not found');
      }

      return user;
    } catch (error) {
      throw error;
    }
  };

  public findUserAndUpdate = async (userId: string, body: Partial<UserData>) => {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const user = await this.User.findByIdAndUpdate(userId, body, {
        new: true,
        runValidators: true,
        session,
      });

      if (!user) {
        return notFoundException('User not found');
      }

      await session.commitTransaction();
      await session.endSession();

      return user;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();

      throw error;
    }
  };

  public findUserAndDelete = async (userId: string) => {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const user = await this.User.findById(userId);

      if (!user) {
        return notFoundException('User not found');
      }

      const deletedUser = await user.remove({ session });

      await session.commitTransaction();
      await session.endSession();

      return deletedUser;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();

      throw error;
    }
  };
}

export default UserService;
