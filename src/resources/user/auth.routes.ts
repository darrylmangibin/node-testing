import authMiddleware from '@/middleware/auth.middleware';
import { Router } from 'express';
import UserController from './user.controller';

class UserRoutes implements AppRoute {
  public path = 'users';
  public router = Router();

  private userController = new UserController();

  constructor() {
    this.registerRoutes();
  }

  public registerRoutes() {
    this.router.route('/').get(authMiddleware, this.userController.findUsers);
  }
}

export default UserRoutes;
