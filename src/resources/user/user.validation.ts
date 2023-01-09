import Joi from 'joi';
import { UserData } from './user.interface';

export const userUpdateValidation = Joi.object<UserData>({
  email: Joi.string().required().email(),
  name: Joi.string().required(),
  role: Joi.string().required().valid('user', 'admin'),
});
