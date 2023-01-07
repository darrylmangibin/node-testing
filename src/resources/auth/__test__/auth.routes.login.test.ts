import UserFactory from '@/resources/user/user.factory';
import server from '@/src/server';
import { faker } from '@faker-js/faker';
import supertest, { Response } from 'supertest';

const endpoint = '/api/auth/login';

describe(`AuthRoutes Login - ${endpoint}`, () => {
  const invalidInputs = {
    email: '',
    password: '',
  };

  const invalidCredsResponse = (res: Response) => {
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: 'Invalid credentials',
      })
    );
  };

  it('should throw 422 error response', async () => {
    const res = await supertest(server.app).post(endpoint).send(invalidInputs);

    expect(res.statusCode).toBe(422);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: 'Validation failed',
      })
    );
  });

  it('should throw 401 error response', async () => {
    const user = await new UserFactory().create();

    let res = await supertest(server.app).post(endpoint).send({
      email: faker.internet.email(),
      password: '123456',
    });

    invalidCredsResponse(res);

    res = await supertest(server.app).post(endpoint).send({
      email: user.email,
      password: '1234567',
    });

    invalidCredsResponse(res);
  });

  it('should return success response', async () => {
    const user = await new UserFactory().create();

    const res = await supertest(server.app).post(endpoint).send({
      email: user.email,
      password: '123456',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
