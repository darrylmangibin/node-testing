import { model, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { PostData, PostDocument } from './post.interface';

import PostSchema from './post.schema';

PostSchema.plugin(paginate);

const Post = model<PostData, PaginateModel<PostDocument>>('Post', PostSchema);

export default Post;
