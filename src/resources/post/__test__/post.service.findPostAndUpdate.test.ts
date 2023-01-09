import UserFactory from '@/resources/user/user.factory';
import ErrorException from '@/utils/exceptions/error.exception';
import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';
import PostFactory from '../post.factory';
import { PostData } from '../post.interface';
import Post from '../post.model';
import PostService from '../post.service';

describe('PostService findPostAndUpdate', () => {
  const postService = new PostService();

  const body = {
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
  } satisfies Partial<PostData>;

  it('should throw 404 error', async () => {
    try {
      const invalidPostId = new Types.ObjectId().toString();

      await postService.findPostAndUpdate(invalidPostId, body);
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorException);
      expect(error).toEqual(
        expect.objectContaining({
          message: 'Post not found',
          statusCode: 404,
        })
      );
    }
  });

  it('should return updated post', async () => {
    const postFromFactory = await new PostFactory().create();

    const post = await postService.findPostAndUpdate(postFromFactory.id, body);

    const updatedPost = await Post.findById(postFromFactory.id);

    expect(post).toEqual(
      expect.objectContaining({
        ...body,
      })
    );
    expect(postFromFactory.title).not.toEqual(post.title);
    expect(postFromFactory.description).not.toEqual(post.description);
    expect(updatedPost?.title).toEqual(body.title);
    expect(updatedPost?.description).toEqual(body.description);
  });
});
