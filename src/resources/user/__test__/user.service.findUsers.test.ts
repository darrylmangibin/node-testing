import keysPaginate from '@/utils/paginate/keys.paginate';
import UserFactory from '../user.factory';
import UserService from '../user.service';

describe('UserService findUsers', () => {
  const userService = new UserService();

  const limit = 10;
  const page = 1;

  it('should return pagination results of users', async () => {
    const users = await new UserFactory().createMany(20);

    const results = await userService.findUsers({}, { limit, page });

    expect(Object.keys(results)).toEqual(expect.arrayContaining(keysPaginate));
    expect(results.docs.length).toEqual(limit);
    expect(results.totalDocs).toEqual(users.length);
  });
});
