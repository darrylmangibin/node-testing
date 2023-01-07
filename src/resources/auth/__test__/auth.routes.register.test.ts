import supertest from 'supertest';

import server from '@/src/server';
import { faker } from '@faker-js/faker';
import UserFactory from '@/resources/user/user.factory';

const endpoint = '/api/auth/register';

describe(`AuthRoutes Register - ${endpoint}`, () => {
  const invalidUserData = {
    name: '',
    email: 'example',
    password: '',
  };

  const userData = {
    name: faker.name.fullName(),
    email: faker.internet.email(),
    password: '123456',
  };

  it('should throw 422 error response when inputs are invalid', async () => {
    const res = await supertest(server.app).post(endpoint).send(invalidUserData);

    expect(res.statusCode).toBe(422);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: 'Validation failed',
      })
    );
  });

  it('should throw 400 error response when email already exists', async () => {
    const user = await new UserFactory().create({
      email: faker.internet.email(),
    });

    const res = await supertest(server.app).post(endpoint).send({
      email: user.email,
      name: faker.name.fullName(),
      password: '123456',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: 'Email already exists',
      })
    );
  });

  it('should return token when successfully registered', async () => {
    const res = await supertest(server.app).post(endpoint).send(userData);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });
});
