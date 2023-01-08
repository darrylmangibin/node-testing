import { UserDocument } from '@/resources/user/user.interface';
import server from '@/src/server';
import comparePassword from '@/utils/password/compare.password';
import generateUser from '@/utils/test/generateUser';
import supertest from 'supertest';
import { AuthUpdatePasswordRequestBody } from '../auth.interface';

const endpoint = '/api/auth/update-password';

describe(`AuthRoutes - ${endpoint}`, () => {
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

  it('should return 422 error response', async () => {
    let res = await supertest(server.app)
      .put(endpoint)
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: '',
        newPassword: '',
      });

    expect(res.statusCode).toBe(422);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: 'Validation failed',
        error: {
          currentPassword: 'currentPassword is not allowed to be empty',
          newPassword: 'newPassword is not allowed to be empty',
        },
      })
    );

    res = await supertest(server.app)
      .put(endpoint)
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: inputs.currentPassword,
        newPassword: '12345',
      });

    expect(res.statusCode).toBe(422);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: 'Validation failed',
        error: {
          newPassword: 'newPassword length must be at least 6 characters long',
        },
      })
    );
  });

  it('should return 400 error response', async () => {
    const res = await supertest(server.app)
      .put(endpoint)
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: '1234567',
        newPassword: '1234567',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: 'Password incorrect',
      })
    );
  });

  it('should return update user password', async () => {
    const res = await supertest(server.app)
      .put(endpoint)
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: inputs.currentPassword,
        newPassword: inputs.newPassword,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.password).not.toEqual(user?.password);

    const isMatchPassword = await comparePassword(inputs.newPassword, res.body.password);

    expect(isMatchPassword).toBeTruthy();
  });
});
