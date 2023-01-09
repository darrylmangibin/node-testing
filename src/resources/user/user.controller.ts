import optionsPaginate from '@/utils/paginate/options.paginate';
import { NextFunction, Request, Response } from 'express';
import { FilterQuery, PopulateOptions } from 'mongoose';
import { UserData } from './user.interface';
import UserService from './user.service';

class UserController {
  private userService = new UserService();

  public findUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query: FilterQuery<UserData> = {
        _id: { $ne: req.user.id },
        ...(req.query.filter as unknown as PopulateOptions),
      };

      const options = optionsPaginate(req.query);

      const results = await this.userService.findUsers(query, options);

      res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  };

  public findUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.findUserById(req.params.userId);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  public findUserAndUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedUser = await this.userService.findUserAndUpdate(
        req.params.userId,
        req.body
      );

      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  };

  public findUserAndDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deletedUser = await this.userService.findUserAndDelete(req.params.userId);

      res.status(200).json(deletedUser);
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
