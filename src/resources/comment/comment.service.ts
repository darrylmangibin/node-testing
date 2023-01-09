import notFoundException from '@/utils/exceptions/notFound.exception';
import mongoose, { FilterQuery, PaginateOptions } from 'mongoose';
import PostService from '@/resources/post/post.service';
import { CommentData, CommentDocument } from './comment.interface';
import Comment from './comment.model';
import ErrorException from '@/utils/exceptions/error.exception';

class CommentService {
  private Comment = Comment;
  private postService = new PostService();

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

  public createComment = async (body: CommentData) => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      if (this.isBodyPostString(body.post)) {
        await this.postService.findPostById(body.post);
      }

      const [comment] = await this.Comment.create([body], { session });

      await session.commitTransaction();
      await session.endSession();

      return comment;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();

      throw error;
    }
  };

  public findCommentAndUpdate = async (commentId: string, body: Partial<CommentData>) => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const comment = await this.Comment.findByIdAndUpdate(commentId, body, {
        new: true,
        runValidators: true,
        session,
      });

      if (!comment) {
        return notFoundException('Comment not found');
      }

      await session.commitTransaction();
      await session.endSession();

      return comment;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();

      throw error;
    }
  };

  public checkCommentOwner(comment: CommentDocument, userId: string) {
    if (comment.user.toString() !== userId) {
      throw new ErrorException('Forbidden. Not allowed to perform this action', 403);
    }
  }

  private isBodyPostString = (post: CommentData['post']): post is string => {
    return typeof post === 'string';
  };
}

export default CommentService;
