import ErrorException from '@/utils/exceptions/error.exception';
import { faker } from '@faker-js/faker';
import { Error, Types } from 'mongoose';
import UserFactory from '../user.factory';
import { UserData } from '../user.interface';
import User from '../user.model';
import UserService from '../user.service';

describe('UserService findUserAndUpdate', () => {
  const userService = new UserService();

  it('should throw validation error when inputs ar invalid', async () => {
    try {
      const user = await new UserFactory().create();

      await userService.findUserAndUpdate(user.id, {
        email: '',
        name: '',
        password: '',
        role: 'user',
      });
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error.ValidationError);
      expect(Object.keys(error.errors)).toEqual(
        expect.arrayContaining(['name', 'email', 'password'])
      );
      expect(error.errors).toHaveProperty;
    }
  });

  it('should throw not found error when no user found', async () => {
    try {
      const userId = new Types.ObjectId().toString();

      await userService.findUserAndUpdate(userId, {
        name: faker.name.fullName(),
        email: faker.internet.email(),
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorException);
      expect(error).toEqual(
        expect.objectContaining({
          message: 'User not found',
          statusCode: 404,
        })
      );
    }
  });

  it('should update a user', async () => {
    const user = await new UserFactory().create();

    const data: Partial<UserData> = {
      name: faker.name.fullName(),
      email: faker.internet.email(),
      role: 'admin',
    };

    const updatedUser = await userService.findUserAndUpdate(user.id, data);

    expect(updatedUser).toEqual(
      expect.objectContaining({
        name: data.name,
        email: data.email,
        role: data.role,
      })
    );

    const latestUserdata = (await User.findById(user.id)) || user;

    expect(latestUserdata.name).not.toEqual(user.name);
    expect(latestUserdata.email).not.toEqual(user.email);
    expect(latestUserdata.role).not.toEqual(user.role);
    expect(latestUserdata.name).toEqual(updatedUser.name);
    expect(latestUserdata.email).toEqual(updatedUser.email);
    expect(latestUserdata.role).toEqual(updatedUser.role);
  });
});
