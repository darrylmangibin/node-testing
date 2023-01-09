import CommentFactory from '@/resources/comment/comment.factory';
import Comment from '@/resources/comment/comment.model';
import PostFactory from '@/resources/post/post.factory';
import Post from '@/resources/post/post.model';
import server from '@/src/server';
import signToken from '@/utils/token/sign.token';
import supertest from 'supertest';
import UserFactory from '../user.factory';
import User from '../user.model';

const endpoint = '/api/users';

describe(`UserRoutes - ${endpoint}/:userId`, () => {
  it('should return 403 error response', async () => {
    const user = await new UserFactory().create();
    const token = signToken({ id: user.id });

    const res = await supertest(server.app)
      .delete(`${endpoint}/${user.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
  });

  it('should return deleted user response', async () => {
    let users = await new UserFactory().createMany(5);
    const admin = await new UserFactory().create({ role: 'admin' });
    const token = signToken({ id: admin.id });
    const randomIndex = Math.floor(Math.random() * users.length);
    const randomUser = users[randomIndex];
    let posts = await new PostFactory().createMany(5, { user: randomUser.id });
    const randomPost = posts[Math.floor(Math.random() * posts.length)];
    let comments = await new CommentFactory().createMany(5, {
      user: randomUser.id,
      post: randomPost.id,
    });
    const otherPost = await new PostFactory().create();
    const otherComment = await new CommentFactory().create();

    expect(await Post.find({ user: randomUser.id })).toHaveLength(posts.length);
    expect(await Comment.find({ user: randomUser.id })).toHaveLength(comments.length);

    const res = await supertest(server.app)
      .delete(`${endpoint}/${randomUser.id}`)
      .set('Authorization', `Bearer ${token}`);

    const updatedUsersCount = await User.countDocuments({ _id: { $ne: admin.id } });

    expect(res.statusCode).toBe(200);
    expect(updatedUsersCount).not.toEqual(users.length);

    users = await User.find();
    const userIds = users.map(user => user.id);

    expect(userIds.includes(randomUser.id)).toBeFalsy();
    expect(await Post.find({ user: randomUser.id })).toEqual([]);
    expect(await Comment.find({ user: randomUser.id })).toEqual([]);
    expect(await Post.findById(otherPost.id)).not.toBeNull();
    expect(await Comment.findById(otherComment.id)).not.toBeNull();
  });
});
