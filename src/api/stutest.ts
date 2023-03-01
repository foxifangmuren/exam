import { post, get } from './request';
import { AxiosResponse } from 'axios';
// 学生考试列表
export const getList = (params: any): Promise<AxiosResponse<any>> => {
  return get('/test/list',  params );
};
// 根据id获取单条考试信息
export const getTest = (params: any): Promise<AxiosResponse<any>> => {
  return get('/test/get',  params );
};
//获取考试题目 
export const getteststart = (params: any): Promise<AxiosResponse<any>> => {
  return get('/test/start',  params );
};
  return get('/test/list', { params });
};
export const updateState = (params: any): Promise<AxiosResponse<any>> => {
  return post('/test/updateState', params );
};
export const deleteall = (params: any): Promise<AxiosResponse<any>> => {
  return post('/test/deleteall', params );
};
export const del= (id: any): Promise<AxiosResponse<any>> => {
  return get('/test/delete', id );
};
export const testadd= (params: any): Promise<AxiosResponse<any>> => {
  return post('/test/add', params );
};  
