import authSupertest from '@/utils/test/authSupertest';
import generateUser from '@/utils/test/generateUser';
import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';
import { UserData, UserDocument } from '../user.interface';

const endpoint = '/api/users';

describe(`UserRoutes - ${endpoint}/:userId`, () => {
  let user: UserDocument | undefined;
  let token: string | undefined;
  let adminUser: UserDocument | undefined;
  let adminToken: string | undefined;

  const inputs: Partial<UserData> = {
    name: faker.name.fullName(),
    email: faker.internet.email(),
    role: 'user',
  };

  beforeEach(async () => {
    const regular = await generateUser();
    const admin = await generateUser({ role: 'admin' });

    user = regular.user;
    token = regular.token;

    adminUser = admin.user;
    adminToken = admin.token;
  });

  it('should throw 404 error response', async () => {
    const userId = new Types.ObjectId().toString();

    const res = await authSupertest<UserData>(
      'PUT',
      `${endpoint}/${userId}`,
      adminToken,
      {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        role: 'user',
      }
    );

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: 'User not found',
      })
    );
  });

  it('should return 403 error response', async () => {
    const res = await authSupertest('PUT', `${endpoint}/${user?.id}`, token, {
      name: faker.name.fullName(),
      email: faker.internet.email(),
      role: 'user',
    });

    expect(res.statusCode).toBe(403);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: 'Forbidden. Admin only',
      })
    );
  });

  it('should return 422 error response', async () => {
    const res = await authSupertest('PUT', `${endpoint}/${user?.id}`, adminToken, {
      name: '',
      email: '',
      role: 'regular',
    });

    expect(res.statusCode).toBe(422);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: 'Validation failed',
        error: {
          email: 'email is not allowed to be empty',
          name: 'name is not allowed to be empty',
          role: 'role must be one of [user, admin]',
        },
      })
    );
  });

  it('should return updated user response', async () => {
    const res = await authSupertest('PUT', `${endpoint}/${user?.id}`, adminToken, inputs);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        _id: user?.id,
        ...inputs,
      })
    );
  });
});
