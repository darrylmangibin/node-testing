import Joi from 'joi';
import { PostData } from './post.interface';

export const postCreateOrUpdateValidation = Joi.object<PostData>({
  title: Joi.string().required(),
  description: Joi.string().allow(''),
});
