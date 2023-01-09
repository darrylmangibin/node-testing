import PostFactory from '@/resources/post/post.factory';
import { PostDocument } from '@/resources/post/post.interface';
import authSupertest from '@/utils/test/authSupertest';
import generateUser from '@/utils/test/generateUser';
import { Types } from 'mongoose';
import UserFactory from '../user.factory';
import { UserDocument } from '../user.interface';

const endpoint = '/api/users';

describe(`UserRoutes - ${endpoint}/:userId`, () => {
  let user: UserDocument | undefined;
  let token: string | undefined;

  beforeEach(async () => {
    const data = await generateUser();

    user = data.user;
    token = data.token;
  });

  it('should return 404 error response', async () => {
    const invalidUserId = new Types.ObjectId().toString();

    const res = await authSupertest('GET', `${endpoint}/${invalidUserId}`, token);

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: 'User not found',
      })
    );
  });

  it('should return user', async () => {
    const users = await new UserFactory().createMany(10);

    const randomIndex = Math.floor(Math.random() * users.length);

    const randomUser = users[randomIndex];

    const res = await authSupertest('GET', `${endpoint}/${randomUser.id}`, token);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        id: randomUser.id,
        name: randomUser.name,
        email: randomUser.email,
      })
    );
  });

  it('should return user posts', async () => {
    const { user, token } = await generateUser();
    const userPosts = await new PostFactory().createMany(5, { user: user.id });
    const otherPost = await new PostFactory().create();

    const res = await authSupertest('GET', `${endpoint}/${user.id}/posts`, token);

    expect(res.statusCode).toBe(200);
    expect(res.body.totalDocs).toEqual(userPosts.length);
    expect(
      res.body.docs.map((doc: PostDocument) => doc.id).includes(otherPost.id)
    ).toBeFalsy();
  });
});
