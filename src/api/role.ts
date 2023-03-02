import { post, get } from './request';
import { AxiosResponse } from 'axios';
// 获取获取权限功能列表接口
export const menuList = (params: any): Promise<AxiosResponse<any>> => {
  return get('/menu/list',  params );
};