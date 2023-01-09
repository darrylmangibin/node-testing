import ErrorException from '@/utils/exceptions/error.exception';
import optionsPaginate from '@/utils/paginate/options.paginate';
import { NextFunction, Request, Response } from 'express';
import { FilterQuery, PopulateOptions } from 'mongoose';
import { PostData, PostDocument } from './post.interface';
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

  public findPostById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const populate = this.isReqQueryPopulateIsPopulateOptions(req.query.populate)
        ? req.query.populate
        : undefined;

      const post = await this.postService.findPostById(req.params.postId, populate);

      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  };

  public createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createdPost = await this.postService.createPost({
        ...req.body,
        user: req.user.id,
      });

      res.status(201).json(createdPost);
    } catch (error) {
      next(error);
    }
  };

  public findPostAndUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await this.postService.findPostById(req.params.postId);

      this.postService.checkPostOwner(post, req.user.id);

      const updatedPost = await this.postService.findPostAndUpdate(
        req.params.postId,
        req.body
      );

      res.status(200).json(updatedPost);
    } catch (error) {
      next(error);
    }
  };

  private isReqQueryPopulateIsPopulateOptions = (
    reqQueryPopulate: unknown
  ): reqQueryPopulate is PopulateOptions => {
    return (
      typeof reqQueryPopulate !== 'string' && typeof reqQueryPopulate !== 'undefined'
    );
  };
}

export default PostController;
