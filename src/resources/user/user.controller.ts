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
}

export default UserController;
