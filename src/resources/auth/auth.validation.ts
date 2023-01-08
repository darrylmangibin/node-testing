import Joi from 'joi';
import { UserData } from '../user/user.interface';
import { AuthUpdatePasswordRequestBody } from './auth.interface';

export const authRegisterValidation = Joi.object<UserData>({
  name: Joi.string().required(),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6),
});

export const authLoginValidation = Joi.object<UserData>({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});

export const authUpdateProfileValidation = Joi.object<UserData>({
  email: Joi.string().required().email(),
  name: Joi.string().required(),
});

export const authUpdatePasswordValidation = Joi.object<AuthUpdatePasswordRequestBody>({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().required().min(6),
});
