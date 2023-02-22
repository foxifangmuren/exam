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

//部门列表
export const departmentlist = (): Promise<AxiosResponse<any>> => {
  return get('/department/list')
}
//班级列表
export const classeslist = (params: any): Promise<AxiosResponse<any>> => {
  return get('/classes/list',params)
}
//学生列表  /student/list
export const studentlist = (params: any): Promise<AxiosResponse<any>> => {
  return get('/student/list',params)
}
//角色管理
export const rolelist = (params: any): Promise<AxiosResponse<any>> => {
  return get('/role/list',params)
}