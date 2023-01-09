import authMiddleware from '@/middleware/auth.middleware';
import { Router } from 'express';
import PostController from './post.controller';

class PostRoutes implements AppRoute {
  public path = 'posts';
  public router = Router();

  private postController = new PostController();

  constructor() {
    this.registerRoutes();
  }

  public registerRoutes() {
    this.router.route('/').get(authMiddleware, this.postController.findPosts);
  }
}

export default PostRoutes;
