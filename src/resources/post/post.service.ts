import notFoundException from '@/utils/exceptions/notFound.exception';
import { FilterQuery, PaginateOptions, PopulateOptions } from 'mongoose';
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
}

export default PostService;
