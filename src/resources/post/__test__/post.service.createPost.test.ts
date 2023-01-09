import UserFactory from '@/resources/user/user.factory';
import { faker } from '@faker-js/faker';
import { Error } from 'mongoose';
import PostFactory from '../post.factory';
import { PostData } from '../post.interface';
import Post from '../post.model';
import PostService from '../post.service';

describe('PostService createPost', () => {
  const postService = new PostService();

  it('should throw 422', async () => {
    try {
      await postService.createPost({
        title: '',
      });
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error.ValidationError);
      expect(Object.keys(error.errors)).toEqual(
        expect.arrayContaining(['title', 'user'])
      );
    }
  });

  it('should return created post', async () => {
    const user = await new UserFactory().create();

    const body = {
      title: faker.name.fullName(),
      description: faker.lorem.paragraph(),
      user: user.id,
    } satisfies PostData;

    const post = await postService.createPost(body);

    const createdPostFromDatabase = await Post.findById(post.id);

    expect(post).toEqual(
      expect.objectContaining({
        id: post.id,
        ...body,
      })
    );
    expect(createdPostFromDatabase).not.toBeNull();
  });
});
