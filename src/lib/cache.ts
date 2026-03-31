
import { NoticeResponse } from './types';

let cachedData: NoticeResponse | null = null;

export const getCachedNotices = () => cachedData;

export const setCachedNotices = (data: NoticeResponse) => {
  cachedData = data;
};
