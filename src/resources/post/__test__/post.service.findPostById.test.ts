import UserFactory from '@/resources/user/user.factory';
import { UserDocument } from '@/resources/user/user.interface';
import ErrorException from '@/utils/exceptions/error.exception';
import { Types } from 'mongoose';
import PostFactory from '../post.factory';
import { PostDocument } from '../post.interface';
import PostService from '../post.service';

describe('PostService findPostById', () => {
  const postService = new PostService();

  let user: UserDocument | undefined;
  let posts: PostDocument[] = [];
  let randomPost: PostDocument | undefined;

  beforeEach(async () => {
    user = await new UserFactory().create();
    posts = await new PostFactory().createMany(10, { user: user.id });

    randomPost = posts[Math.floor(Math.random() * posts.length)];
  });

  it('should throw 404 error', async () => {
    try {
      await postService.findPostById(new Types.ObjectId().toString());
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

  it('should return post', async () => {
    const post = await postService.findPostById(randomPost?.id);

    expect(post).toEqual(
      expect.objectContaining({
        _id: randomPost?._id,
      })
    );
  });

  it('should return post with populate data', async () => {
    const post = await postService.findPostById(randomPost?.id, { path: 'user' });

    const isPostUserDocument = (user: UserDocument | string): user is UserDocument => {
      return typeof user !== 'string' && '_id' in user;
    };

    if (isPostUserDocument(post.user)) {
      expect(post.user).toEqual(
        expect.objectContaining({
          id: user?.id,
          name: user?.name,
          email: user?.email,
        })
      );
    }
    expect(typeof post.user).not.toBe('string');
  });
});
