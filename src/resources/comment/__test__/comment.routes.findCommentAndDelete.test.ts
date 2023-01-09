import PostFactory from '@/resources/post/post.factory';
import { PostDocument } from '@/resources/post/post.interface';
import { UserDocument } from '@/resources/user/user.interface';
import server from '@/src/server';
import generateUser from '@/utils/test/generateUser';
import { Types } from 'mongoose';
import supertest from 'supertest';
import CommentFactory from '../comment.factory';
import { CommentDocument } from '../comment.interface';

const endpoint = '/api/comments';

describe(`CommentRoutes - ${endpoint}/:commentId`, () => {
  let user: UserDocument;
  let token: string;
  let post: PostDocument;
  let auth: Record<string, unknown>;
  let comment: CommentDocument;

  beforeEach(async () => {
    const { user: _user, token: _token } = await generateUser();

    user = _user;
    token = _token;

    post = await new PostFactory().create();

    comment = await new CommentFactory().create({ post: post.id, user: user.id });

    auth = { Authorization: `Bearer ${token}` };
  });

  it('should return 404 error response', async () => {
    const res = await supertest(server.app)
      .delete(`${endpoint}/${new Types.ObjectId().toString()}`)
      .set(auth);

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: 'Comment not found',
      })
    );
  });

  it('should return 403 error response', async () => {
    const { token: otherToken } = await generateUser();

    const res = await supertest(server.app)
      .delete(`${endpoint}/${comment.id}`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect(res.statusCode).toBe(403);
  });

  it('should return deleted comment success response', async () => {
    const res = await supertest(server.app).delete(`${endpoint}/${comment.id}`).set(auth);

    expect(res.statusCode).toBe(200);
  });
});
