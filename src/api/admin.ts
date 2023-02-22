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
//班级添加
export const classesadd = (params: any): Promise<AxiosResponse<any>> => {
  return post('/classes/add',params)
}
//班级删除  
export const classesdel = (params: any): Promise<AxiosResponse<any>> => {
  return get('/classes/delete',params)
}
//学生列表 
export const studentlist = (params: any): Promise<AxiosResponse<any>> => {
  return get('/student/list',params)
}
//删除学生
export const studentdel = (params: any): Promise<AxiosResponse<any>> => {
  return get('/student/delete',params)
}
//角色管理列表
export const rolelist = (params: any): Promise<AxiosResponse<any>> => {
  return get('/role/list',params)
}
//师资列表
export const teacherlist = (params: any): Promise<AxiosResponse<any>> => {
  return get('/teacher/list',params)
}
//删除师资/老师  
export const teacherdel = (params: any): Promise<AxiosResponse<any>> => {
  return get('/teacher/delete',params)
}