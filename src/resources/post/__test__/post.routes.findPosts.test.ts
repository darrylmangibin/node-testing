import server from '@/src/server';
import generateUser from '@/utils/test/generateUser';
import supertest from 'supertest';
import PostFactory from '../post.factory';

const endpoint = '/api/posts';

describe(`PostRoutes - ${endpoint}`, () => {
  it('should return posts pagination results', async () => {
    const { token, user } = await generateUser();
    const posts = await new PostFactory().createMany(10);
    let query = {
      limit: 5,
      page: 1,
    };

    const res = await supertest(server.app)
      .get(endpoint)
      .set('Authorization', `Bearer ${token}`)
      .query(query);

    expect(res.statusCode).toBe(200);
    expect(res.body.docs.length).toEqual(query.limit);
    expect(res.body.totalDocs).toEqual(posts.length);
  });
});
