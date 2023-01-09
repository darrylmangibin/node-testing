import optionsPaginate from '@/utils/paginate/options.paginate';
import { NextFunction, Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import { CommentData } from './comment.interface';
import CommentService from './comment.service';

class CommentController {
  private commentService = new CommentService();

  public findComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let query = {
        ...(req.query.filter as unknown as FilterQuery<CommentData>),
      } satisfies FilterQuery<CommentData>;

      if (req.params.postId) {
        query = {
          ...query,
          post: req.params.postId,
        };
      }

      const options = optionsPaginate(req.query);

      const results = await this.commentService.findComments(query, options);

      res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  };

  public findCommentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const comment = await this.commentService.findCommentById(req.params.commentId);

      res.status(200).json(comment);
    } catch (error) {
      next(error);
    }
  };

  public createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newPost = await this.commentService.createComment({
        ...req.body,
        post: req.params.postId,
        user: req.user.id,
      });

      res.status(201).json(newPost);
    } catch (error) {
      next(error);
    }
  };

  public findCommentAndUpdate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const comment = await this.commentService.findCommentById(req.params.commentId);

      this.commentService.checkCommentOwner(comment, req.user.id);

      const updatedComment = await this.commentService.findCommentAndUpdate(
        req.params.commentId,
        req.body
      );

      res.status(200).json(updatedComment);
    } catch (error) {
      next(error);
    }
  };

  public findCommentAndDelete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const comment = await this.commentService.findCommentById(req.params.commentId);

      this.commentService.checkCommentOwner(comment, req.user.id);

      const deletedComment = await this.commentService.findCommentAndDelete(
        req.params.commentId
      );

      res.status(200).json(deletedComment);
    } catch (error) {
      next(error);
    }
  };
}

export default CommentController;
