import FactoryDatabase from '@/utils/database/factory.database';
import { faker } from '@faker-js/faker';
import PostFactory from '../post/post.factory';
import UserFactory from '../user/user.factory';
import { CommentData, CommentDocument } from './comment.interface';
import Comment from './comment.model';

class CommentFactory extends FactoryDatabase<CommentDocument, CommentData> {
  public model = Comment;

  public data = async (arg?: Partial<CommentData>) => {
    return {
      body: faker.lorem.paragraph(),
      user: arg?.user ? arg.user : (await new UserFactory().create()).id,
      post: arg?.post ? arg.post : (await new PostFactory().create()).id,
    };
  };
}

export default CommentFactory;
