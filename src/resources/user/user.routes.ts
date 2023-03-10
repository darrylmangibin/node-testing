import adminMiddleware from '@/middleware/admin.middleware';
import authMiddleware from '@/middleware/auth.middleware';
import validationMiddleware from '@/middleware/validation.middleware';
import { Router } from 'express';
import UserController from './user.controller';
import { userUpdateValidation } from './user.validation';
import PostRoutes from '@/resources/post/post.routes';

class UserRoutes implements AppRoute {
  public path = 'users';
  public router = Router();

  private userController = new UserController();
  private postRoutes = new PostRoutes();

  constructor() {
    this.registerRoutes();
  }

  public registerRoutes() {
    this.router.use('/:userId/posts', this.postRoutes.router);

    this.router.route('/').get(authMiddleware, this.userController.findUsers);

    this.router
      .route('/:userId')
      .get(authMiddleware, this.userController.findUserById)
      .put(
        authMiddleware,
        adminMiddleware,
        validationMiddleware(userUpdateValidation),
        this.userController.findUserAndUpdate
      )
      .delete(authMiddleware, adminMiddleware, this.userController.findUserAndDelete);
  }
}

export default UserRoutes;
