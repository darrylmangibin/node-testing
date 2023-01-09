import PostFactory from '@/resources/post/post.factory';
import { PostDocument } from '@/resources/post/post.interface';
import { UserDocument } from '@/resources/user/user.interface';
import server from '@/src/server';
import generateUser from '@/utils/test/generateUser';
import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';
import supertest from 'supertest';

const endpoint = '/api/posts';

describe(`CommentRoutes - ${endpoint}/:postId/comments`, () => {
  let user: UserDocument;
  let token: string;
  let post: PostDocument;
  let auth: Record<string, unknown>;

  beforeEach(async () => {
    const { user: _user, token: _token } = await generateUser();

    user = _user;
    token = _token;

    post = await new PostFactory().create();

    auth = { Authorization: `Bearer ${token}` };
  });

  it('should return 422 error response', async () => {
    const res = await supertest(server.app)
      .post(`${endpoint}/${post.id}/comments`)
      .set(auth)
      .send({
        body: '',
      });
    expect(res.statusCode).toBe(422);
  });

  it('should return 404 error response', async () => {
    const postId = new Types.ObjectId().toString();
    const res = await supertest(server.app)
      .post(`${endpoint}/${postId}/comments`)
      .set(auth)
      .send({
        body: faker.lorem.paragraph(),
      });

    expect(res.statusCode).toBe(404);
  });

  it('should return new comment success response', async () => {
    const res = await supertest(server.app)
      .post(`${endpoint}/${post.id}/comments`)
      .set(auth)
      .send({
        body: faker.lorem.paragraph(),
      });
    expect(res.statusCode).toBe(201);
  });
});
