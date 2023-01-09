import PostFactory from '@/resources/post/post.factory';
import Post from '@/resources/post/post.model';
import ErrorException from '@/utils/exceptions/error.exception';
import generateUser from '@/utils/test/generateUser';
import { Types } from 'mongoose';
import UserFactory from '../user.factory';
import { UserDocument } from '../user.interface';
import User from '../user.model';
import UserService from '../user.service';

describe('UserService findUserAndDelete', () => {
  const userService = new UserService();

  it('should throw 404 when no user found', async () => {
    try {
      const userId = new Types.ObjectId().toString();

      await userService.findUserAndDelete(userId);
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorException);
      expect(error).toEqual(
        expect.objectContaining({
          message: 'User not found',
          statusCode: 404,
        })
      );
    }
  });

  it('should return deleted user', async () => {
    const user = await new UserFactory().create();

    const deletedUser = await userService.findUserAndDelete(user.id);

    expect(await User.findById(user.id)).toBeNull();
    expect(deletedUser.id).toBe(user.id);
  });

  it('should delete user posts only when user is deleted', async () => {
    const user = await new UserFactory().create();
    const postNotBelongToUser = await new PostFactory().create();
    const userPosts = await new PostFactory().createMany(2, { user: user.id });

    let posts = await Post.find({ user: user.id });
    posts.forEach(post => {
      expect(user.id).toEqual(post.user.toString());
    });

    const deletedUser = await userService.findUserAndDelete(user.id);

    posts = await Post.find({ user: deletedUser.id });

    expect(posts).toEqual([]);

    const post = await Post.findById(postNotBelongToUser.id);

    expect(post).not.toBeNull();
  });
});
