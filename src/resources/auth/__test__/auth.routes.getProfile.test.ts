import supertest from 'supertest';

import server from '@/src/server';
import UserFactory from '@/resources/user/user.factory';
import signToken from '@/utils/token/sign.token';

const endpoint = '/api/auth/profile';

describe(`AuthRoutes - ${endpoint}`, () => {
  it('should successfully return the current user', async () => {
    const user = await new UserFactory().create();

    const token = signToken({ id: user.id });

    const res = await supertest(server.app)
      .get(endpoint)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      })
    );
  });
});
