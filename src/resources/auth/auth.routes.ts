import adminMiddleware from '@/middleware/admin.middleware';
import authMiddleware from '@/middleware/auth.middleware';
import validationMiddleware from '@/middleware/validation.middleware';
import { Router } from 'express';
import AuthController from './auth.controller';
import {
  authLoginValidation,
  authRegisterValidation,
  authUpdateProfileValidation,
} from './auth.validation';

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

    this.router
      .route('/profile')
      .get(authMiddleware, this.authController.getProfile)
      .put(
        authMiddleware,
        validationMiddleware(authUpdateProfileValidation),
        this.authController.updateProfile
      )
      .delete(authMiddleware, this.authController.deleteProfile);
  }
}

export default AuthRoutes;
