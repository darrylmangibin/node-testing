import PostFactory from '@/resources/post/post.factory';
import server from '@/src/server';
import generateUser from '@/utils/test/generateUser';
import { FilterQuery, PaginateOptions } from 'mongoose';
import supertest from 'supertest';
import CommentFactory from '../comment.factory';
import { CommentData } from '../comment.interface';

const endpoint = '/api/comments';

describe(`CommentRoutes - ${endpoint}`, () => {
  it('should return comments pagination results', async () => {
    const { user, token } = await generateUser();
    const post = await new PostFactory().create();
    const comments = await new CommentFactory().createMany(5);
    const postComments = await new CommentFactory().createMany(10, { post: post.id });
    const totalCommentCount = comments.length + postComments.length;

    const query = {
      limit: 10,
      page: 1,
    } satisfies PaginateOptions;
    const filter = {
      post: post.id,
    } satisfies FilterQuery<CommentData>;

    let res = await supertest(server.app)
      .get(endpoint)
      .set('Authorization', `Bearer ${token}`)
      .query(query);

    expect(res.statusCode).toBe(200);
    expect(res.body.totalDocs).toEqual(totalCommentCount);
    expect(res.body.docs.length).toEqual(query.limit);

    res = await supertest(server.app)
      .get(endpoint)
      .set('Authorization', `Bearer ${token}`)
      .query({
        ...query,
        filter,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.totalDocs).toEqual(postComments.length);
    expect(res.body.docs.length).toEqual(query.limit);
  });
});
