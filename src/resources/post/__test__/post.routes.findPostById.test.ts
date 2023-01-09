import CommentFactory from '@/resources/comment/comment.factory';
import { CommentDocument } from '@/resources/comment/comment.interface';
import { UserDocument } from '@/resources/user/user.interface';
import server from '@/src/server';
import generateUser from '@/utils/test/generateUser';
import { FilterQuery, PaginateOptions, Types } from 'mongoose';
import supertest from 'supertest';
import PostFactory from '../post.factory';
import { PostDocument } from '../post.interface';

const endpoint = '/api/posts';

describe(`PostRoutes - ${endpoint}/:postId`, () => {
  let token: string;
  let user: UserDocument;
  let post: PostDocument;
  let comments: CommentDocument[];

  beforeEach(async () => {
    const { token: _token } = await generateUser();

    token = _token;

    post = await new PostFactory().create();

    comments = await new CommentFactory().createMany(12, { post: post.id });
  });

  it('should return 404 error response', async () => {
    const postId = new Types.ObjectId().toString();

    const res = await supertest(server.app)
      .get(`${endpoint}/${postId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: 'Post not found',
        success: false,
      })
    );
  });

  it('should return post', async () => {
    const res = await supertest(server.app)
      .get(`${endpoint}/${post.id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        id: post.id,
        title: post.title,
        description: post.description,
        user: post.user.toString(),
      })
    );
  });

  it('should return post with populate data', async () => {
    const populate = {
      path: 'user',
      select: 'name',
    };

    const res = await supertest(server.app)
      .get(`${endpoint}/${post.id}`)
      .set('Authorization', `Bearer ${token}`)
      .query({
        populate,
      });

    expect(res.statusCode).toBe(200);
    expect(typeof res.body.user).not.toBe('string');
    expect(Object.keys(res.body.user)).toEqual(
      expect.arrayContaining(['id', ...populate.select.split(' ')])
    );
  });

  it('should return post comments', async () => {
    const otherComments = await new CommentFactory().createMany(5);
    const randomOtherComment =
      otherComments[Math.floor(Math.random() * otherComments.length)];
    const commentIds = comments.map(comment => comment.id);

    const query = {
      limit: 10,
      page: 1,
    } satisfies PaginateOptions;

    const res = await supertest(server.app)
      .get(`${endpoint}/${post.id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .query(query);

    expect(res.statusCode).toBe(200);
    expect(res.body.totalDocs).toEqual(comments.length);
    expect(commentIds.includes(randomOtherComment.id)).toBeFalsy();
  });
});
