import Joi from 'joi';
import { CommentData } from './comment.interface';

export const commentCreateOrUpdateValidation = Joi.object<CommentData>({
  body: Joi.string().required(),
});
