import { Request } from 'express';
import { PaginateOptions } from 'mongoose';

const optionsPaginate = (reqQuery: Request['query']): PaginateOptions => {
  return {
    limit: Number(reqQuery.limit) || 10,
    page: Number(reqQuery.page) || 1,
    populate: reqQuery.populate as PaginateOptions['populate'],
  };
};

export default optionsPaginate;
