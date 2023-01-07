import AuthService from '@/resources/auth/auth.service';
import UserFactory from '@/resources/user/user.factory';
import { UserData } from '@/resources/user/user.interface';
import User from '@/resources/user/user.model';
import ErrorException from '@/utils/exceptions/error.exception';
import { faker } from '@faker-js/faker';
import { Error } from 'mongoose';

describe('AuthService register', () => {
  const authService = new AuthService();

  const userData: UserData = {
    name: faker.name.fullName(),
    email: faker.internet.email(),
    password: '123456',
    role: 'user',
  };

  it('should throw 400 error when email already exists', async () => {
    try {
      await new UserFactory().create(userData);

      await authService.register(userData);
    } catch (error: any) {
      expect(error).toBeInstanceOf(ErrorException);
      expect(error).toEqual(
        expect.objectContaining({
          message: 'Email already exists',
          statusCode: 400,
        })
      );
    }
  });

  it('should throw 422 when validation failed', async () => {
    try {
      await authService.register({
        name: '',
        email: '',
        password: '',
        role: 'user',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(Error.ValidationError);
    }
  });

  it('should return user when successfully registered', async () => {
    const newUser = await authService.register(userData);

    const user = await User.findById(newUser.id);

    expect(user).not.toBeNull();
    expect(newUser).toBeInstanceOf(User);
  });
});
