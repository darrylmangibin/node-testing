import { Router } from 'express';
import AuthController from './auth.controller';

class AuthRoutes implements AppRoute {
  public path = 'auth';
  public router = Router();

  private authController = new AuthController();

  constructor() {
    this.registerRoutes();
  }

  public registerRoutes() {
    this.router.post('/register', this.authController.register);
  }
}

export default AuthRoutes;
