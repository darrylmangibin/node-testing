import notFoundException from '@/utils/exceptions/notFound.exception';
import { FilterQuery, PaginateOptions } from 'mongoose';
import { CommentData } from './comment.interface';
import Comment from './comment.model';

class CommentService {
  private Comment = Comment;

  public findComments = async (
    query: FilterQuery<CommentData>,
    options: PaginateOptions
  ) => {
    try {
      const results = await this.Comment.paginate(query, options);

      return results;
    } catch (error) {
      throw error;
    }
  };

  public findCommentById = async (commentId: string) => {
    try {
      const comment = await this.Comment.findById(commentId);

      if (!comment) {
        return notFoundException('Comment not found');
      }

      return comment;
    } catch (error) {
      throw error;
    }
  };
}

export default CommentService;
