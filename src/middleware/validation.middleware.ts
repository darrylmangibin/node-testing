import { RequestHandler } from 'express';
import Joi from 'joi';

const validationMiddleware =
  (schema: Joi.Schema): RequestHandler =>
  async (req, res, next) => {
    try {
      const options: Joi.AsyncValidationOptions = {
        abortEarly: false,
        allowUnknown: false,
        errors: {
          wrap: {
            label: '',
          },
        },
      };

      const values = await schema.validateAsync(req.body, options);

      req.body = values;

      next();
    } catch (error) {
      next(error);
    }
  };

export default validationMiddleware;
