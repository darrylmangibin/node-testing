import PostFactory from '@/resources/post/post.factory';
import keysPaginate from '@/utils/paginate/keys.paginate';
import { FilterQuery, PaginateOptions } from 'mongoose';
import CommentFactory from '../comment.factory';
import { CommentData } from '../comment.interface';
import CommentService from '../comment.service';

describe('CommentService findComments', () => {
  const commentService = new CommentService();

  it('should return comments paginate results', async () => {
    const post = await new PostFactory().create();
    const comments = await new CommentFactory().createMany(10, { post: post.id });
    await new CommentFactory().createMany(5);
    const query = {
      post: post.id,
    } satisfies FilterQuery<CommentData>;
    const options = {
      limit: 5,
      page: 1,
    } satisfies PaginateOptions;

    const results = await commentService.findComments(query, options);

    expect(Object.keys(results)).toEqual(expect.arrayContaining(keysPaginate));
    expect(results.totalDocs).toEqual(comments.length);
    expect(results.docs.length).toEqual(options.limit);
  });
});
