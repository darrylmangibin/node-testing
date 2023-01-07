import { NextFunction, Request, Response } from 'express';

class AuthController {
  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.send('register');
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
