import PostFactory from '@/resources/post/post.factory';
import UserFactory from '@/resources/user/user.factory';
import ErrorException from '@/utils/exceptions/error.exception';
import { faker } from '@faker-js/faker';
import { Error, Types } from 'mongoose';
import { CommentData } from '../comment.interface';
import Comment from '../comment.model';
import CommentService from '../comment.service';

describe('CommentService createComment', () => {
  const commentService = new CommentService();

  it('should throw 422 error', async () => {
    try {
      const post = await new PostFactory().create();

      await commentService.createComment({
        body: '',
        post: post.id,
        user: new Types.ObjectId().toString(),
      });
    } catch (error) {
      expect(error).toBeInstanceOf(Error.ValidationError);
    }
  });

  it('should throw 404 error when no post found', async () => {
    try {
      await commentService.createComment({
        body: '',
        post: new Types.ObjectId().toString(),
        user: new Types.ObjectId().toString(),
      });
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

  it('should return new comment', async () => {
    const post = await new PostFactory().create();
    const user = await new UserFactory().create();

    const inputs = {
      body: faker.lorem.paragraph(),
      post: post.id,
      user: user.id,
    } satisfies CommentData;

    const comment = await commentService.createComment(inputs);

    expect(comment).toEqual(
      expect.objectContaining({
        body: inputs.body,
      })
    );
    expect(comment.user.toString()).toEqual(inputs.user);
    expect(comment.post.toString()).toEqual(inputs.post);

    const newComment = await Comment.findById(comment.id);

    expect(newComment).not.toBeNull();
  });
});
