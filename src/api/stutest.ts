import { post, get } from './request';
import { AxiosResponse } from 'axios';
// 学生考试列表
export const getList = (params: any): Promise<AxiosResponse<any>> => {
  return get('/test/list', { params });
};