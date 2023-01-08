import ErrorException from '@/utils/exceptions/error.exception';
import { Types } from 'mongoose';
import UserFactory from '../user.factory';
import UserService from '../user.service';

describe('UserService findUserById', () => {
  const userService = new UserService();

  it('should throw 404 when no user found', async () => {
    const invalidUserId = new Types.ObjectId().toString();

    try {
      await userService.findUserById(invalidUserId);
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

  it('should return user', async () => {
    const userFromFactory = await new UserFactory().create();

    const userFromService = await userService.findUserById(userFromFactory.id);

    expect(userFromFactory.id).toEqual(userFromService.id);
  });
});
