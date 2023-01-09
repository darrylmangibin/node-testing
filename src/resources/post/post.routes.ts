import authMiddleware from '@/middleware/auth.middleware';
import validationMiddleware from '@/middleware/validation.middleware';
import { Router } from 'express';
import PostController from './post.controller';
import { postCreateOrUpdateValidation } from './post.validation';
import CommentRoutes from '../comment/comment.routes';

class PostRoutes implements AppRoute {
  public path = 'posts';
  public router = Router({
    mergeParams: true,
  });

  private postController = new PostController();
  private commentRoutes = new CommentRoutes();

  constructor() {
    this.registerRoutes();
  }

  public registerRoutes() {
    this.router.use('/:postId/comments', this.commentRoutes.router);

    this.router
      .route('/')
      .get(authMiddleware, this.postController.findPosts)
      .post(
        authMiddleware,
        validationMiddleware(postCreateOrUpdateValidation),
        this.postController.createPost
      );

    this.router
      .route('/:postId')
      .get(authMiddleware, this.postController.findPostById)
      .put(
        authMiddleware,
        validationMiddleware(postCreateOrUpdateValidation),
        this.postController.findPostAndUpdate
      )
      .delete(authMiddleware, this.postController.findPostAndDelete);
  }
}

export default PostRoutes;
