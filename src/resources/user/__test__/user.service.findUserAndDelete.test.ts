import ErrorException from '@/utils/exceptions/error.exception';
import { Types } from 'mongoose';
import UserFactory from '../user.factory';
import { UserDocument } from '../user.interface';
import User from '../user.model';
import UserService from '../user.service';

describe('UserService findUserAndDelete', () => {
  const userService = new UserService();

  it('should throw 404 when no user found', async () => {
    try {
      const userId = new Types.ObjectId().toString();

      await userService.findUserAndDelete(userId);
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorException);
      expect(error).toEqual(
        expect.objectContaining({
          message: 'User not found',
          statusCode: 404,
        })
      );
    }
  });

  it('should return deleted user', async () => {
    const user = await new UserFactory().create();

    const deletedUser = await userService.findUserAndDelete(user.id);

    expect(await User.findById(user.id)).toBeNull();
    expect(deletedUser.id).toBe(user.id);
  });
});
