import { post, get } from './request';
import { AxiosResponse } from 'axios';
interface Iadmin {
  (username: string, pass: string): Promise<AxiosResponse<any>>;
}
export const login: Iadmin = (
  username: string,
  pass: string
): Promise<AxiosResponse<any>> => {
  return post('/teacher/checklogin', { username, pass });
};

export const getList = (params: any): Promise<AxiosResponse<any>> => {
  return get('/admin/list', { params });
};

export const getvisituserlist = (params: any) => {
  return get('/visituser/list', params);
};