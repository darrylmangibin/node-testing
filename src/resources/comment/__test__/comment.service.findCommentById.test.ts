import ErrorException from '@/utils/exceptions/error.exception';
import { Types } from 'mongoose';
import CommentFactory from '../comment.factory';
import CommentService from '../comment.service';

describe('CommentService findCommentById', () => {
  const commentService = new CommentService();

  it('should throw 404 error', async () => {
    try {
      const invalidCommentId = new Types.ObjectId().toString();

      await commentService.findCommentById(invalidCommentId);
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorException);
      expect(error).toEqual(
        expect.objectContaining({
          message: 'Comment not found',
          statusCode: 404,
        })
      );
    }
  });

  it('should return comment', async () => {
    const comments = await new CommentFactory().createMany(10);
    const randomCommentsIndex = Math.floor(Math.random() * comments.length);
    const randomComment = comments[randomCommentsIndex];

    const comment = await commentService.findCommentById(randomComment.id);

    expect(comment).toEqual(
      expect.objectContaining({
        id: randomComment.id,
      })
    );
  });
});
