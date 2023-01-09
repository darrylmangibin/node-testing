import notFoundException from '@/utils/exceptions/notFound.exception';
import mongoose, { FilterQuery, PaginateOptions, PopulateOptions } from 'mongoose';
import { PostData } from './post.interface';
import Post from './post.model';

class PostService {
  private Post = Post;

  public findPosts = async (query: FilterQuery<PostData>, options: PaginateOptions) => {
    try {
      const results = await this.Post.paginate(query, options);

      return results;
    } catch (error) {
      throw error;
    }
  };

  public findPostById = async (postId: string, populate?: PopulateOptions) => {
    try {
      let query = this.Post.findById(postId);

      if (populate) {
        query = query.populate<PostData>(populate);
      }

      const post = await query;

      if (!post) {
        return notFoundException('Post not found');
      }

      return post;
    } catch (error) {
      throw error;
    }
  };

  public createPost = async (body: Partial<PostData>) => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const [post] = await this.Post.create([body], { session });

      await session.commitTransaction();
      await session.endSession();

      return post;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();

      throw error;
    }
  };
}

export default PostService;
