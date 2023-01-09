import ErrorException from '@/utils/exceptions/error.exception';
import { Types } from 'mongoose';
import PostFactory from '../post.factory';
import Post from '../post.model';
import PostService from '../post.service';

describe('PostService findPostAndDelete', () => {
  const postService = new PostService();

  it('should throw 404 error', async () => {
    try {
      const invalidPostId = new Types.ObjectId().toString();

      await postService.findPostAndDelete(invalidPostId);
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

  it('should return deleted post', async () => {
    const post = await new PostFactory().create();

    const deletedPostFromService = await postService.findPostAndDelete(post.id);

    const deletedPost = await Post.findById(post.id);

    expect(deletedPostFromService).toEqual(
      expect.objectContaining({
        id: post.id,
      })
    );
    expect(deletedPost).toBeNull();
  });
});
