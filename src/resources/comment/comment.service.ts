import notFoundException from '@/utils/exceptions/notFound.exception';
import mongoose, { FilterQuery, PaginateOptions } from 'mongoose';
import PostService from '@/resources/post/post.service';
import { CommentData } from './comment.interface';
import Comment from './comment.model';

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

  private isBodyPostString = (post: CommentData['post']): post is string => {
    return typeof post === 'string';
  };
}

export default CommentService;
