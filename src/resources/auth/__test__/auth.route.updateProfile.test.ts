import UserFactory from '@/resources/user/user.factory';
import signToken from '@/utils/token/sign.token';
import supertest from 'supertest';
import server from '@/src/server';
import { UserData, UserDocument } from '@/resources/user/user.interface';
import { faker } from '@faker-js/faker';

const endpoint = '/api/auth/profile';

describe(`AuthRoutes - ${endpoint}`, () => {
  let user: UserDocument | undefined;
  let token: string | undefined;
  let userInputs: Partial<UserData> = {};

  beforeEach(async () => {
    user = await new UserFactory().create();

    token = signToken({ id: user?.id });

    userInputs = {
      email: faker.internet.email(),
      name: faker.name.fullName(),
    };
  });
  it('should throw 422 error when inputs are invalid', async () => {
    const data: Partial<UserData> = {
      email: '',
      name: '',
    };

    const res = await supertest(server.app)
      .put(endpoint)
      .set('Authorization', `Bearer ${token}`)
      .send(data);

    expect(res.statusCode).toBe(422);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: 'Validation failed',
        error: {
          email: 'email is not allowed to be empty',
          name: 'name is not allowed to be empty',
        },
      })
    );
  });

  it('should return updated user details', async () => {
    const res = await supertest(server.app)
      .put(endpoint)
      .set('Authorization', `Bearer ${token}`)
      .send(userInputs);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        name: userInputs.name,
        email: userInputs.email,
      })
    );
  });
});
