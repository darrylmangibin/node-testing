import ErrorException from '@/utils/exceptions/error.exception';
import { ErrorRequestHandler } from 'express';
import { MongoServerError } from 'mongodb';
import { Error } from 'mongoose';
import Joi from 'joi';

const errorMiddleware: ErrorRequestHandler = (err: ErrorException, req, res, next) => {
  let error = { ...err };

  let errorObject: Record<string, unknown> = {};

  if (err instanceof MongoServerError) {
    if (err.code === 11000) {
      Object.keys(err.keyValue).forEach(key => {
        errorObject[key] = `${err.keyValue[key]} already exists`;
      });

      error = new ErrorException('Duplicate key', 400, errorObject);
    }
  }

  if (err instanceof Error.ValidationError) {
    Object.keys(err.errors).forEach(key => {
      errorObject[key] = err.errors[key].message;
    });

    error = new ErrorException('Validation failed', 422, errorObject);
  }

  if (err instanceof Joi.ValidationError) {
    err.details.forEach(detail => {
      errorObject[detail.context?.key as string] = detail.message;
    });

    error = new ErrorException('Validation failed', 422, errorObject);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || err.message || 'Something went wrong',
    error: error.errorObject,
  });
};

export default errorMiddleware;
