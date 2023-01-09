import authMiddleware from '@/middleware/auth.middleware';
import { Router } from 'express';
import CommentController from './comment.controller';

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
    this.router.route('/').get(authMiddleware, this.commentController.findComments);

    this.router
      .route('/:commentId')
      .get(authMiddleware, this.commentController.findCommentById);
  }
}

export default CommentRoutes;
