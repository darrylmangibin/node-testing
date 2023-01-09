import authMiddleware from '@/middleware/auth.middleware';
import validationMiddleware from '@/middleware/validation.middleware';
import { Router } from 'express';
import CommentController from './comment.controller';
import { commentCreateOrUpdateValidation } from './comment.validation';

class CommentRoutes implements AppRoute {
  public path = 'comments';
  public router = Router({
    mergeParams: true,
  });

  private commentController = new CommentController();

  constructor() {
    this.registerRoutes();
  }

  public registerRoutes() {
    this.router
      .route('/')
      .get(authMiddleware, this.commentController.findComments)
      .post(
        authMiddleware,
        validationMiddleware(commentCreateOrUpdateValidation),
        this.commentController.createComment
      );

    this.router
      .route('/:commentId')
      .get(authMiddleware, this.commentController.findCommentById);
  }
}

export default CommentRoutes;
