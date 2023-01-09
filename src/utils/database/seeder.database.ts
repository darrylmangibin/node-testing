import CommentFactory from '@/resources/comment/comment.factory';
import { CommentData } from '@/resources/comment/comment.interface';
import PostFactory from '@/resources/post/post.factory';
import Post from '@/resources/post/post.model';
import UserFactory from '@/resources/user/user.factory';
import 'colors';
import 'dotenv/config';
import e from 'express';
import connectDatabase from './connect.database';

class SeederDatabase {
  constructor() {
    connectDatabase();
  }

  public importData = async () => {
    try {
      console.log('Generating admin...'.green);
      const admin = new UserFactory().create({
        email: 'admin@test.com',
        role: 'admin',
      });

      console.log('Generating users...'.green);
      const users = await new UserFactory().createMany(10);

      for await (let user of users) {
        console.log(`Generating posts of ${user.name}...`.green);
        const randomPostCount = Math.floor(Math.random() * 15);

        await new PostFactory().createMany(randomPostCount, {
          user: user.id,
        });
      }

      const commentData: Partial<CommentData>[] = [];
      const posts = await Post.find();

      for await (let _k of Array.from({ length: 1200 })) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomPost = posts[Math.floor(Math.random() * posts.length)];

        commentData.push({
          user: randomUser.id,
          post: randomPost.id,
        });
      }

      console.log('Generating comments...'.green);
      const comments = await new CommentFactory().insertMany(commentData);

      console.log('Data imported...'.green.bold);

      process.exit();
    } catch (error) {
      console.log(error);

      process.exit(1);
    }
  };

  public destroyData = async () => {
    try {
      console.log('Deleting users...'.red);
      await new UserFactory().deleteMany();

      console.log('Deleting posts...'.red);
      await new PostFactory().deleteMany();

      console.log('Deleting comments...'.red);
      await new CommentFactory().deleteMany();

      console.log('Data destroyed...'.red.bold);

      process.exit();
    } catch (error) {
      console.log(error);

      process.exit(1);
    }
  };
}

export default SeederDatabase;
