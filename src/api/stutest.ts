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
// 获取学生考试结果
export const getForResult = (params:any):Promise<AxiosResponse<any>>=>{
  return get('/test/getForResult',params)
}
//学生端的修改
export const StudentChangepass= (params:any):Promise<AxiosResponse<any>>=>{
  return post('/student/changepass',params)
}