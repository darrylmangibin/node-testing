import { UserDocument } from '@/resources/user/user.interface';
import server from '@/src/server';
import generateUser from '@/utils/test/generateUser';
import { Types } from 'mongoose';
import supertest from 'supertest';
import PostFactory from '../post.factory';
import { PostDocument } from '../post.interface';
import Post from '../post.model';

const endpoint = '/api/posts';

describe(`PostRoutes - ${endpoint}/:postId`, () => {
  let user: UserDocument;
  let token: string;
  let post: PostDocument;
  let auth: Record<string, unknown>;

  beforeEach(async () => {
    const { user: _user, token: _token } = await generateUser();

    user = _user;
    token = _token;

    post = await new PostFactory().create({ user: user.id });

    auth = { Authorization: `Bearer ${token}` };
  });

  it('should return 404 error response', async () => {
    const invalidPostId = new Types.ObjectId().toString();

    const res = await supertest(server.app)
      .delete(`${endpoint}/${invalidPostId}`)
      .set(auth);

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: 'Post not found',
      })
    );
  });

  it('should return 403 error response', async () => {
    const otherPost = await new PostFactory().create();

    const res = await supertest(server.app)
      .delete(`${endpoint}/${otherPost.id}`)
      .set(auth);

    expect(res.statusCode).toBe(403);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: 'Forbidden. Not allowed to perform this action',
      })
    );
  });

  it('should return deleted post success response', async () => {
    const res = await supertest(server.app).delete(`${endpoint}/${post.id}`).set(auth);

    const deletedPost = await Post.findById(post.id);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        id: post.id,
      })
    );
    expect(deletedPost).toBeNull();
  });
});
