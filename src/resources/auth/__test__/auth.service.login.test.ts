import supertest from 'supertest';

import server from '@/src/server';
import { faker } from '@faker-js/faker';
import UserFactory from '@/resources/user/user.factory';
import AuthService from '../auth.service';
import ErrorException from '@/utils/exceptions/error.exception';

describe('AuthService login', () => {
  const authService = new AuthService();

  it('should throw 401 error response', async () => {
    try {
      await authService.login({
        email: faker.internet.email(),
        password: '123456',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorException);
      expect(error).toEqual(
        expect.objectContaining({
          message: 'Invalid credentials',
          statusCode: 401,
        })
      );
    }
  });

  it('should return user', async () => {
    const user = await new UserFactory().create();

    const loggedInUser = await authService.login({
      email: user.email,
      password: '123456',
    });

    expect(loggedInUser.id).toEqual(user.id);
  });
});
