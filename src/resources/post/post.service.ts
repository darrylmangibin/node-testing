import { FilterQuery, PaginateOptions } from 'mongoose';
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
}

export default PostService;
