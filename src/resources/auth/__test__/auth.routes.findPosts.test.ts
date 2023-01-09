import PostFactory from '@/resources/post/post.factory';
import server from '@/src/server';
import generateUser from '@/utils/test/generateUser';
import supertest from 'supertest';

const endpoint = '/api/auth/posts';

describe(`AuthRoutes - ${endpoint}`, () => {
  it('should return current user posts only', async () => {
    const post = await new PostFactory().create();
    const { user, token } = await generateUser();
    const currentUserPosts = await new PostFactory().createMany(5, { user: user.id });

    const res = await supertest(server.app)
      .get(endpoint)
      .set('Authorization', `Bearer ${token}`);

    const currentUserPostsUserId = currentUserPosts.map(post => post.user);

    expect(res.body.docs.length).toEqual(currentUserPosts.length);
    expect(currentUserPostsUserId.includes(post.id)).toBeFalsy();
  });
});
