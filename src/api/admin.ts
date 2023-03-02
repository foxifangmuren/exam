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
export const departmentlist = (params: any): Promise<AxiosResponse<any>>  => {
  return get('/department/list',params)
}
//部门添加  
export const departmentadd = (params: any): Promise<AxiosResponse<any>> => {
  return post('/department/add',params)
}
//部门删除 
export const departmentdelete = (params: any): Promise<AxiosResponse<any>> => {
  return get('/department/delete',params)
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
//学员列表 
export const studentlist = (params: any): Promise<AxiosResponse<any>> => {
  return get('/student/list',params)
}
//学员添加
export const studentadd = (params: any): Promise<AxiosResponse<any>> => {
  return post('/student/add',params)
}
//删除学员
export const studentdel = (params: any): Promise<AxiosResponse<any>> => {
  return get('/student/delete',params)
}
//批量删除学员
export const studentdelall = (params: any): Promise<AxiosResponse<any>> => {
  return post('/student/deleteall',params)
}
//角色管理列表
export const rolelist = (params: any): Promise<AxiosResponse<any>> => {
  return get('/role/list',params)
}
//角色删除
export const roledel = (params: any): Promise<AxiosResponse<any>> => {
  return get('/role/delete',params)
}
//角色添加
export const roleadd = (params: any): Promise<AxiosResponse<any>> => {
  return post('/role/add',params)
}
//师资列表
export const teacherlist = (params: any): Promise<AxiosResponse<any>> => {
  return get('/teacher/list',params)
}
//删除师资/老师  
export const teacherdel = (params: any): Promise<AxiosResponse<any>> => {
  return get('/teacher/delete',params)
}
//考试列表
export const TextList = (params: any): Promise<AxiosResponse<any>> => {
  return get('/test/list',params)
}
//添加老师
export const teacherAdd = (params: any): Promise<AxiosResponse<any>> => {
  return post('/teacher/add',params)
}
//老师修改密码
export const changePass = (params: any): Promise<AxiosResponse<any>> => {
  return post('/teacher/changePass',params)
}