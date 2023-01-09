import optionsPaginate from '@/utils/paginate/options.paginate';
import { NextFunction, Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import { PostData } from './post.interface';
import PostService from './post.service';

class PostController {
  private postService = new PostService();

  public findPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let query: FilterQuery<PostData> = {
        ...(req.query.filter as unknown as FilterQuery<PostData>),
      };

      if (req.params.userId) {
        query = { ...query, user: req.params.userId };
      }

      const options = optionsPaginate(req.query);

      const results = await this.postService.findPosts(query, options);

      res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  };
}

export default PostController;
