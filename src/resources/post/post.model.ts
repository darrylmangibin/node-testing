import { model, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { CommentDocument } from '../comment/comment.interface';
import Comment from '../comment/comment.model';
import { PostData, PostDocument } from './post.interface';

import PostSchema from './post.schema';

PostSchema.plugin(paginate);

PostSchema.pre<CommentDocument>('remove', async function (next) {
  await Comment.deleteMany({ post: this._id });

  next();
});

const Post = model<PostData, PaginateModel<PostDocument>>('Post', PostSchema);

export default Post;
