import ErrorException from '@/utils/exceptions/error.exception';
import { ErrorRequestHandler } from 'express';

const errorMiddleware: ErrorRequestHandler = (err: ErrorException, req, res, next) => {
  let error = { ...err };

  let errorObject: Record<string, unknown> = {};

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || err.message || 'Something went wrong',
    error: error.errorObject,
  });
};

export default errorMiddleware;
