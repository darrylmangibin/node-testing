import { model, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { CommentData, CommentDocument } from './comment.interface';

import CommentSchema from './comment.schema';

CommentSchema.plugin(paginate);

const Comment = model<CommentData, PaginateModel<CommentDocument>>(
  'Comment',
  CommentSchema
);

export default Comment;
