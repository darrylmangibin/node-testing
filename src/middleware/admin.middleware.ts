import ErrorException from '@/utils/exceptions/error.exception';
import { NextFunction, Request, Response } from 'express';

const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role === 'admin') {
    return next();
  }

  next(new ErrorException('Forbidden. Admin only', 403));
};

export default adminMiddleware;
