import signToken from '@/utils/token/sign.token';
import { NextFunction, Request, Response } from 'express';
import AuthService from './auth.service';

class AuthController {
  private authService = new AuthService();

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.authService.register(req.body);

      const token = signToken({ id: user.id });

      res.status(201).json({ token });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
