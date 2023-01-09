import PostFactory from '@/resources/post/post.factory';
import { PostDocument } from '@/resources/post/post.interface';
import { UserDocument } from '@/resources/user/user.interface';
import server from '@/src/server';
import generateUser from '@/utils/test/generateUser';
import { faker } from '@faker-js/faker';
import supertest from 'supertest';
import CommentFactory from '../comment.factory';
import { CommentDocument } from '../comment.interface';

const endpoint = '/api/comments';

describe(`CommentRoutes - ${endpoint}/:commentId`, () => {
  let user: UserDocument;
  let token: string;
  let auth: Record<string, unknown>;
  let post: PostDocument;
  let comment: CommentDocument;

  beforeEach(async () => {
    const { user: _user, token: _token } = await generateUser();

    user = _user;
    token = _token;

    post = await new PostFactory().create();
    comment = await new CommentFactory().create({ post: post.id, user: user.id });

    auth = { Authorization: `Bearer ${token}` };
  });

  it('should should return 422 error response', async () => {
    const res = await supertest(server.app)
      .put(`${endpoint}/${comment.id}`)
      .set(auth)
      .send({
        body: '',
      });

    expect(res.statusCode).toBe(422);
  });

  it('should return 403 error response', async () => {
    const { token: otherToken } = await generateUser();

    const res = await supertest(server.app)
      .put(`${endpoint}/${comment.id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({
        body: faker.lorem.paragraph(),
      });

    expect(res.statusCode).toBe(403);
  });

  it('should return updated post success response', async () => {
    const input = {
      body: faker.lorem.paragraphs(),
    };

    const res = await supertest(server.app)
      .put(`${endpoint}/${comment.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(input);

    expect(res.statusCode).toBe(200);
    expect(res.body.body).not.toEqual(comment.body);
  });
});
