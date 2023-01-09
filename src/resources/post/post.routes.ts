import authMiddleware from '@/middleware/auth.middleware';
import validationMiddleware from '@/middleware/validation.middleware';
import { Router } from 'express';
import PostController from './post.controller';
import { postCreateOrUpdateValidation } from './post.validation';

class PostRoutes implements AppRoute {
  public path = 'posts';
  public router = Router({
    mergeParams: true,
  });

  private postController = new PostController();

  constructor() {
    this.registerRoutes();
  }

  public registerRoutes() {
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
      );
  }
}

export default PostRoutes;
