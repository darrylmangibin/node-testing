import server from '@/src/server';
import keysPaginate from '@/utils/paginate/keys.paginate';
import generateUser from '@/utils/test/generateUser';
import supertest from 'supertest';
import UserFactory from '../user.factory';
import { UserDocument } from '../user.interface';

const endpoint = '/api/users';

describe(`UserRoutes - ${endpoint}`, () => {
  let token: string | undefined;
  let users: UserDocument[] = [];

  const query = {
    limit: 10,
    page: 1,
  };

  beforeEach(async () => {
    const generatedUser = await generateUser();

    token = generatedUser.token;

    users = await new UserFactory().createMany(20);
  });

  it('should return pagination response of users', async () => {
    let res = await supertest(server.app)
      .get(endpoint)
      .query(query)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Object.keys(res.body)).toEqual(expect.arrayContaining(keysPaginate));
    expect(res.body.docs.length).toEqual(query.limit);
    expect(res.body.totalDocs).toEqual(users.length);

    const selectedUser = users[Math.floor(Math.random() * users.length)];

    res = await supertest(server.app)
      .get(endpoint)
      .query({
        ...query,
        filter: {
          name: {
            $regex: selectedUser.name,
            $options: 'i',
          },
        },
      })
      .set('Authorization', `Bearer ${token}`);

    const docsHasSelectedUser = res.body.docs
      .map((doc: UserDocument) => doc.id)
      .includes(selectedUser.id);

    expect(docsHasSelectedUser).toBeTruthy();
  });
});
