import { UserDocument } from '@/resources/user/user.interface';
import ErrorException from '@/utils/exceptions/error.exception';
import generateUser from '@/utils/test/generateUser';
import { Error, Types } from 'mongoose';
import { AuthUpdatePasswordRequestBody } from '../auth.interface';
import AuthService from '../auth.service';

describe('AuthService updatePassword', () => {
  const authService = new AuthService();

  let user: UserDocument | undefined;
  let token: string | undefined;

  const inputs: AuthUpdatePasswordRequestBody = {
    currentPassword: '123456',
    newPassword: '654321',
  };

  beforeEach(async () => {
    const data = await generateUser();

    user = data.user;
    token = data.token;
  });

  it('should throw 404 error', async () => {
    try {
      const userId = new Types.ObjectId().toString();

      await authService.updatePassword(userId, inputs);
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorException);
      expect(error).toEqual(
        expect.objectContaining({
          message: 'No user found',
          statusCode: 404,
        })
      );
    }
  });

  it('should throw 400 error when current password is incorrect', async () => {
    try {
      await authService.updatePassword(user?.id, {
        currentPassword: 'fakerpassword',
        newPassword: '123456',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorException);
      expect(error).toEqual(
        expect.objectContaining({
          message: 'Password incorrect',
          statusCode: 400,
        })
      );
    }
  });

  it('should throw 422 error', async () => {
    try {
      await authService.updatePassword(user?.id, {
        currentPassword: inputs.currentPassword,
        newPassword: '12345',
      });
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error.ValidationError);
      expect(Object.keys(error.errors)).toEqual(expect.arrayContaining(['password']));
      console.log(error);
    }
  });

  it('should update user password when inputs are valid', async () => {
    const updatedUser = await authService.updatePassword(user?.id, inputs);

    expect(updatedUser.password).not.toEqual(user?.password);
  });
});
