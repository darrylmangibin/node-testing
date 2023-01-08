import { UserDocument } from '@/resources/user/user.interface';
import server from '@/src/server';
import generateUser from '@/utils/test/generateUser';
import supertest from 'supertest';

const endpoint = '/api/auth/profile';

describe(`AuthRoutes - ${endpoint}`, () => {
  let user: UserDocument | undefined;
  let token: string | undefined;

  beforeEach(async () => {
    const generatedUser = await generateUser();

    user = generatedUser.user;
    token = generatedUser.token;
  });

  it('it should return deleted user', async () => {
    const res = await supertest(server.app)
      .delete(endpoint)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        _id: user?.id,
      })
    );
  });
});
