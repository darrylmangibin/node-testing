import { UserDocument } from '@/resources/user/user.interface';
import server from '@/src/server';
import generateUser from '@/utils/test/generateUser';
import { faker } from '@faker-js/faker';
import supertest from 'supertest';
import PostFactory from '../post.factory';
import { PostData, PostDocument } from '../post.interface';
import Post from '../post.model';

const endpoint = '/api/posts';

describe(`PostRoutes - ${endpoint}/:postId`, () => {
  let user: UserDocument;
  let token: string;
  let post: PostDocument;
  let auth: Record<string, unknown>;

  const body = {
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
  } satisfies Partial<PostData>;

  beforeEach(async () => {
    const { user: _user, token: _token } = await generateUser();

    user = _user;
    token = _token;

    post = await new PostFactory().create({ user: user.id });

    auth = { Authorization: `Bearer ${token}` };
  });

  it('should return 422 error response', async () => {
    const res = await supertest(server.app).put(`${endpoint}/${post.id}`).set(auth).send({
      title: '',
      description: 1,
    });

    expect(res.statusCode).toBe(422);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: 'Validation failed',
        error: {
          title: 'title is not allowed to be empty',
          description: 'description must be a string',
        },
      })
    );
  });

  it('should return 403 error response', async () => {
    const otherPost = await new PostFactory().create();

    const res = await supertest(server.app)
      .put(`${endpoint}/${otherPost.id}`)
      .set(auth)
      .send(body);

    expect(res.statusCode).toBe(403);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: 'Forbidden. Not allowed to perform this action',
      })
    );
  });

  it('should return updated post response successfully', async () => {
    const res = await supertest(server.app)
      .put(`${endpoint}/${post.id}`)
      .set(auth)
      .send(body);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        id: post.id,
        ...body,
      })
    );
    const updatedPost = await Post.findById(post.id);

    expect(updatedPost?.title).toEqual(body.title);
    expect(updatedPost?.description).toEqual(body.description);
  });
});
