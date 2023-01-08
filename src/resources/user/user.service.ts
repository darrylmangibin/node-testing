import notFoundException from '@/utils/exceptions/notFound.exception';
import User from './user.model';

class UserService {
  private User = User;

  public findUserById = async (userId: string) => {
    try {
      const user = await this.User.findById(userId);

      if (!user) {
        return notFoundException('User not found');
      }

      return user;
    } catch (error) {
      throw error;
    }
  };
}

export default UserService;
