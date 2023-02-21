import { post, get } from './request';
import { AxiosResponse } from 'axios';
interface Iadmin {
  (admin_name: string, pwd: string): Promise<AxiosResponse<any>>;
}
export const login: Iadmin = (
  admin_name: string,
  pwd: string
): Promise<AxiosResponse<any>> => {
  return post('/admin/login', { admin_name, pwd });
};

export const getList = (params: any): Promise<AxiosResponse<any>> => {
  return get('/admin/list', { params });
};

export const getvisituserlist = (params: any) => {
  return get('/visituser/list', params);
};
export const getvisitail = (id: any) => {
  return get('/visituser/show', id);
};
export const addvisitail = (params: any): Promise<AxiosResponse<any>> => {
  // console.log(params);

  return post('/visituser/add', params);
};
export const vtshow = (id: any): Promise<AxiosResponse<any>> => {
  // console.log(params);

  return get('/visituser/show', id);
};
export const adminlist = (id: any): Promise<AxiosResponse<any>> => {
  // console.log(params);

  return get('/admin/list', id);
};
export const changestatus = (params: any): Promise<AxiosResponse<any>> => {
  // console.log(params);

  return post('/admin/changestatus', params);
};
export const shenList = (params: any): Promise<AxiosResponse<any>> => {
  // console.log(params);

  return get('/auditlog/list', params);
};
//点位/地址列表
export const addresslist = (params: any) => {
  return get('/address/list', params);
};
//轨迹管理添加
export const traveladd = (params: any) => {
  return post('/travel/add', params);
};
//核检人列表
export const reviewerList = (params: any): Promise<AxiosResponse<any>> => {
  return get('/reviewer/list', params);
}; //核检人添加
export const reviewerAdd = (params: any): Promise<AxiosResponse<any>> => {
  return post('/reviewer/add', params);
};
//核销人是否启用
export const reviewers = (params: any) => {
  // console.log(params)
  return post('/reviewer/changestatus', params);
};
// 部门列表
export const department = (params: any): Promise<AxiosResponse<any>> => {
  return get('/department/list', params);
};

// 核检人删除
export const reviewerdel = (params: any): Promise<AxiosResponse<any>> => {
  return get('/reviewer/del', params);
};
// 核检人修改
export const revieweredit = (params: any): Promise<AxiosResponse<any>> => {
  return post('/reviewer/edit', params);
};

// 核检人单条数据
export const reviewershow = (params: any): Promise<AxiosResponse<any>> => {
  return get('/reviewer/show', params);
};

// 定位删除
export const addressdel = (params: any): Promise<AxiosResponse<any>> => {
  return get('/address/del', params);
};
// 定位添加

export const addressadd = (params: any): Promise<AxiosResponse<any>> => {
  return post('/address/add', params);
};
//定位修改
export const addressedit = (params: any): Promise<AxiosResponse<any>> => {
  return post('/address/edit', params);
};
//定位详情
export const addressshow = (params: any): Promise<AxiosResponse<any>> => {
  return get('/address/show', params);
};
export const admindel = (params: any): Promise<AxiosResponse<any>> => {
  // console.log(params);

  return get('/admin/del', params);
};
export const adminshow = (admin_id: any): Promise<AxiosResponse<any>> => {
  // console.log(params);

  return get('/admin/show', admin_id);
};
export const reviewer = (params: any): Promise<AxiosResponse<any>> => {
  // console.log(params);

  return get('/reviewer/log', params);
};

//校园动态管理列表
export const compusList = (params: any): Promise<AxiosResponse<any>> => {
  return get('/news/list', params);
};
//校园动态添加
export const addcompus = (params: any): Promise<AxiosResponse<any>> => {
  return post('/news/add', params);
};
//校园动态删除
export const delcompus = (params: any): Promise<AxiosResponse<any>> => {
  return get('/news/del', params);
};
//校园动态获取单条数据
export const showcompus = (params: any): Promise<AxiosResponse<any>> => {
  return get('/news/show', params);
};
//校园动态修改
export const updatacompus = (params: any): Promise<AxiosResponse<any>> => {
  return post('/news/edit', params);
};
//角色列表
export const rolelist = (params: any): Promise<AxiosResponse<any>> => {
  return get('/role/list', params);
};
// 角色添加
export const addRole = (params: any): Promise<AxiosResponse<any>> => {
  return post('/role/add', params);
};
//角色删除
export const delRole = (params: any): Promise<AxiosResponse<any>> => {
  return get('/role/del', params);
};
// 角色修改
export const editRole = (params: any): Promise<AxiosResponse<any>> => {
  return post('/role/edit', params);
};
