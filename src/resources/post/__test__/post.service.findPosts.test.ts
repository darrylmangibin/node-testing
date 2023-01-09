import CommentFactory from '@/resources/comment/comment.factory';
import keysPaginate from '@/utils/paginate/keys.paginate';
import { PaginateOptions } from 'mongoose';
import PostFactory from '../post.factory';
import PostService from '../post.service';

describe('PostService findPosts', () => {
  const postService = new PostService();

  it('should return pagination results', async () => {
    const query = {};
    const options = {
      limit: 10,
      page: 1,
    };
    const posts = await new PostFactory().createMany(20);
    const results = await postService.findPosts(query, options);

    expect(Object.keys(results)).toEqual(expect.arrayContaining(keysPaginate));
    expect(results.docs.length).toEqual(options.limit);
    expect(results.totalDocs).toEqual(posts.length);
    expect(results.page).toEqual(options.page);
  });

  it('should return pagination results with comments', async () => {
    const query = {};
    const options = {
      limit: 10,
      page: 1,
      populate: [
        {
          path: 'comments',
          perDocumentLimit: 3,
          populate: {
            path: 'user',
            select: 'name',
          },
        },
      ],
    } satisfies PaginateOptions;
    const posts = await new PostFactory().createMany(20);
    const randomPost = posts[Math.floor(Math.random() * posts.length)];
    await new CommentFactory().createMany(10, { post: randomPost.id });
    const results = await postService.findPosts(query, options);

    expect(Object.keys(results)).toEqual(expect.arrayContaining(keysPaginate));
    expect(results.docs.length).toEqual(options.limit);
    expect(results.totalDocs).toEqual(posts.length);
    expect(results.page).toEqual(options.page);
    results.docs.forEach(doc => {
      expect(doc).toHaveProperty('comments');
    });
  });
});
