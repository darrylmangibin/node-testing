import UserFactory from '@/resources/user/user.factory';
import ErrorException from '@/utils/exceptions/error.exception';
import signToken from '@/utils/token/sign.token';
import { JsonWebTokenError } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { validateToken } from '../auth.middleware';

describe('authMiddleware validateToken', () => {
  it('should throw error when no token', async () => {
    try {
      await validateToken(null);
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorException);
      expect(error).toEqual(
        expect.objectContaining({
          message: 'Unauthorized. No token',
          statusCode: 401,
        })
      );
    }
  });

  it('should throw error when token type is not a string', async () => {
    try {
      await validateToken({ id: 'test' });
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorException);
      expect(error).toEqual(
        expect.objectContaining({
          message: 'Unauthorized. Invalid token type',
          statusCode: 401,
        })
      );
    }
  });

  it('should throw error when token is invalid', async () => {
    try {
      await validateToken('invalid');
    } catch (error) {
      expect(error).toBeInstanceOf(JsonWebTokenError);
      expect(error).toEqual(
        expect.objectContaining({
          name: 'JsonWebTokenError',
          message: 'jwt malformed',
        })
      );
      console.log(error);
    }
  });

  it('should throw error when no user', async () => {
    try {
      const token = signToken({ id: new Types.ObjectId().toString() });

      await validateToken(token);
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorException);
      expect(error).toEqual(
        expect.objectContaining({
          message: 'Unauthorized. No user',
          statusCode: 401,
        })
      );
      console.log(error);
    }
  });

  it('should return user when token is valid', async () => {
    const user = await new UserFactory().create();

    const token = signToken({ id: user.id });

    const userFromToken = await validateToken(token);

    expect(user.id).toEqual(userFromToken.id);
  });
});
