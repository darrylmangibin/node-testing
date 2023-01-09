import { UserDocument } from '@/resources/user/user.interface';
import server from '@/src/server';
import generateUser from '@/utils/test/generateUser';
import { faker } from '@faker-js/faker';
import supertest from 'supertest';
import { PostData } from '../post.interface';
import Post from '../post.model';

const endpoint = '/api/posts';

describe(`PostRoutes - ${endpoint}`, () => {
  let user: UserDocument;
  let token: string;
  let auth: Record<string, unknown>;

  const body = {
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
  } satisfies Partial<PostData>;

  beforeEach(async () => {
    const { user: _user, token: _token } = await generateUser();

    user = _user;
    token = _token;

    auth = { Authorization: `Bearer ${token}` };
  });
  it('should return 422 error response', async () => {
    const res = await supertest(server.app).post(endpoint).set(auth).send({
      title: '',
    });

    expect(res.statusCode).toBe(422);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: 'Validation failed',
        error: { title: 'title is not allowed to be empty' },
      })
    );
  });

  it('should return created post', async () => {
    const res = await supertest(server.app).post(endpoint).set(auth).send(body);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toEqual(
      expect.objectContaining({
        ...body,
        user: user.id,
      })
    );

    const post = await Post.findById(res.body.id);

    expect(post).not.toBeNull();
  });
});
