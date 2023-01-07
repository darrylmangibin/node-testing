import { faker } from '@faker-js/faker';

import User from './user.model';
import FactoryDatabase from '@/utils/database/factory.database';
import { UserData, UserDocument, UserRole } from './user.interface';

class UserFactory extends FactoryDatabase<UserDocument, UserData> {
  public model = User;

  public data = async (data?: Partial<UserData>) => {
    return {
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: '123456',
      role: 'user' as UserRole,
      ...data,
    };
  };
}

export default UserFactory;
