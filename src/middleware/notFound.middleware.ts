import ErrorException from '@/utils/exceptions/error.exception';
import { RequestHandler } from 'express';

const notFoundMiddleware: RequestHandler = (req, res, next) => {
  next(new ErrorException('Route not found', 404));
};

export default notFoundMiddleware;
