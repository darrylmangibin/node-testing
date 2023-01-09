import CommentFactory from '@/resources/comment/comment.factory';
import server from '@/src/server';
import generateUser from '@/utils/test/generateUser';
import supertest from 'supertest';
import PostFactory from '../post.factory';
import { PostDocument } from '../post.interface';

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

  it('should return posts pagination results with comments', async () => {
    const { token, user } = await generateUser();
    const posts = await new PostFactory().createMany(10);
    const post = posts[Math.floor(Math.random() * posts.length)];
    await new CommentFactory().createMany(10, { post: post.id });
    let query = {
      limit: 5,
      page: 1,
      populate: [
        {
          path: 'comments',
          perDocumentLimit: 5,
          populate: {
            path: 'user',
            select: 'name',
          },
        },
      ],
    };

    const res = await supertest(server.app)
      .get(endpoint)
      .set('Authorization', `Bearer ${token}`)
      .query(query);

    const postWithDocument = res.body.docs.find(
      (doc: PostDocument) => doc.id === post.id
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.docs.length).toEqual(query.limit);
    expect(res.body.totalDocs).toEqual(posts.length);
    res.body.docs.forEach((doc: PostDocument) => {
      expect(doc).toHaveProperty('comments');
    });
    if (postWithDocument) {
      expect(postWithDocument.comments.length).toEqual(
        query.populate[0].perDocumentLimit
      );
    }
  });
});
