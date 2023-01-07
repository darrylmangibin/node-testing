import validationMiddleware from '@/middleware/validation.middleware';
import { Router } from 'express';
import AuthController from './auth.controller';
import { authRegisterValidation } from './auth.validation';

class AuthRoutes implements AppRoute {
  public path = 'auth';
  public router = Router();

  private authController = new AuthController();

  constructor() {
    this.registerRoutes();
  }

  public registerRoutes() {
    this.router.post(
      '/register',
      validationMiddleware(authRegisterValidation),
      this.authController.register
    );
  }
}

export default AuthRoutes;
