import UserFactory from '@/resources/user/user.factory';
import { UserData } from '@/resources/user/user.interface';
import signToken from '../token/sign.token';

const generateUser = async (data?: Partial<UserData>) => {
  const user = await new UserFactory().create(data);

  const token = signToken({ id: user.id });

  return { user, token };
};

export default generateUser;
