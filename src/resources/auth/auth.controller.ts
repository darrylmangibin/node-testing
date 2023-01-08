import signToken from '@/utils/token/sign.token';
import { NextFunction, Request, Response } from 'express';
import UserService from '../user/user.service';
import AuthService from './auth.service';

class AuthController {
  private authService = new AuthService();
  private userService = new UserService();

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.authService.register(req.body);

      const token = signToken({ id: user.id });

      res.status(201).json({ token });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.authService.login(req.body);

      const token = signToken({ id: user.id });

      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  };

  public getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.findUserById(req.user.id);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  public updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.findUserAndUpdate(req.user.id, req.body);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  public deleteProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deletedUser = await this.userService.findUserAndDelete(req.user.id);

      res.status(200).json(deletedUser);
    } catch (error) {
      next(error);
    }
  };

  public updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedUser = await this.authService.updatePassword(req.user.id, req.body);

      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
