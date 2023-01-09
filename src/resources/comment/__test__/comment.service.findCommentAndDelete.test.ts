import ErrorException from '@/utils/exceptions/error.exception';
import { Types } from 'mongoose';
import CommentFactory from '../comment.factory';
import Comment from '../comment.model';
import CommentService from '../comment.service';

describe('CommentService findCommentAndDelete', () => {
  it('should throw 404 error', async () => {
    try {
      const commentId = new Types.ObjectId().toString();

      await new CommentService().findCommentAndDelete(commentId);
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorException);
    }
  });

  it('should return deleted comment', async () => {
    const comment = await new CommentFactory().create();

    const deletedComment = await new CommentService().findCommentAndDelete(comment.id);

    expect(deletedComment).toEqual(expect.objectContaining({ id: comment.id }));

    const deletedCommentFromDatabase = await Comment.findById(comment.id);

    expect(deletedCommentFromDatabase).toBeNull();
  });
});
