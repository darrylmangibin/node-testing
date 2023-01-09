import server from '@/src/server';
import signToken from '@/utils/token/sign.token';
import supertest from 'supertest';
import UserFactory from '../user.factory';
import User from '../user.model';

const endpoint = '/api/users';

describe(`UserRoutes - ${endpoint}/:userId`, () => {
  it('should return 403 error response', async () => {
    const user = await new UserFactory().create();
    const token = signToken({ id: user.id });

    const res = await supertest(server.app)
      .delete(`${endpoint}/${user.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
  });

  it('should return deleted user response', async () => {
    let users = await new UserFactory().createMany(5);
    const admin = await new UserFactory().create({ role: 'admin' });
    const token = signToken({ id: admin.id });
    const randomIndex = Math.floor(Math.random() * users.length);
    const randomUser = users[randomIndex];

    const res = await supertest(server.app)
      .delete(`${endpoint}/${randomUser.id}`)
      .set('Authorization', `Bearer ${token}`);

    const updatedUsersCount = await User.countDocuments({ _id: { $ne: admin.id } });

    expect(res.statusCode).toBe(200);
    expect(updatedUsersCount).not.toEqual(users.length);

    users = await User.find();
    const userIds = users.map(user => user.id);

    expect(userIds.includes(randomUser.id)).toBeFalsy();
  });
});
