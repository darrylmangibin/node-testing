import FactoryDatabase from '@/utils/database/factory.database';
import { faker } from '@faker-js/faker';
import UserFactory from '../user/user.factory';
import { PostData, PostDocument } from './post.interface';
import Post from './post.model';

class PostFactory extends FactoryDatabase<PostDocument, PostData> {
  public model = Post;

  public data = async (arg?: Partial<PostData>) => {
    return {
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      user: arg?.user ? arg.user : (await new UserFactory().create()).id,
      ...arg,
    };
  };
}

export default PostFactory;
