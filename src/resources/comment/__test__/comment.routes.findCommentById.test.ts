import { UserDocument } from '@/resources/user/user.interface';
import server from '@/src/server';
import generateUser from '@/utils/test/generateUser';
import { Types } from 'mongoose';
import supertest from 'supertest';
import CommentFactory from '../comment.factory';

const endpoint = '/api/comments';

describe(`CommentRoutes - ${endpoint}/:commentId`, () => {
  let user: UserDocument;
  let token: string;
  let auth: Record<string, unknown>;

  beforeEach(async () => {
    const { user: _user, token: _token } = await generateUser();

    user = _user;
    token = _token;

    auth = { Authorization: `Bearer ${token}` };
  });

  it('should return 404 error response', async () => {
    const invalidCommentId = new Types.ObjectId().toString();

    const res = await supertest(server.app)
      .get(`${endpoint}/${invalidCommentId}`)
      .set(auth);

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: 'Comment not found',
      })
    );
  });

  it('should return post success response', async () => {
    const comments = await new CommentFactory().createMany(10);
    const randomCommentsIndex = Math.floor(Math.random() * comments.length);
    const randomComment = comments[randomCommentsIndex];

    const res = await supertest(server.app)
      .get(`${endpoint}/${randomComment.id}`)
      .set(auth);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        id: randomComment.id,
        body: randomComment.body,
      })
    );
  });
});
