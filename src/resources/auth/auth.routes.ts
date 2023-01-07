import validationMiddleware from '@/middleware/validation.middleware';
import { Router } from 'express';
import AuthController from './auth.controller';
import { authLoginValidation, authRegisterValidation } from './auth.validation';

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

    this.router.post(
      '/login',
      validationMiddleware(authLoginValidation),
      this.authController.login
    );
  }
}

export default AuthRoutes;
