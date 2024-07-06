import { SetMetadata } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';

export const IS_PAGINATION = 'IS_PAGINATION';
export const Pagination = () => SetMetadata(IS_PAGINATION, true);

export type PaginateQuery = {
  page?: number;
  limit?: number;
  lastId?: string; // ! Prepare for cursor-based pagination
};

export type PaginateResult<T> = [T[], number];

export interface PaginateResponse<T> {
  data: T[];
  count: number;
  total: number;
}

export const checkPaginatedResp = <T>(data: any): data is PaginateResponse<T> => {
  return data.data !== undefined && !isNaN(data.count) && !isNaN(data.total);
};

export const paginate = <T, M>(model: Model<M>, query: FilterQuery<T>, paginateQuery: PaginateQuery) => {
  const res = model.find<T>(query);

  const skip = ((paginateQuery.page ?? 1) - 1) * paginateQuery.limit ?? 0;

  return Promise.all([
    res
      .skip(skip)
      .limit(paginateQuery.limit ?? 0)
      .exec(),
    model.countDocuments(query).exec(),
  ]);
};
