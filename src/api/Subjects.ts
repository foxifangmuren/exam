import { post, get } from './request';
import { AxiosResponse } from 'axios';
//试卷管理
const getList = (params: any): Promise<AxiosResponse<any>> => {
  return get('subjects/list', params);
};
//删除数据
const delinfo = (params: any): Promise<AxiosResponse<any>> => {
  return get('subjects/delete', params);
};
//添加数据
const addsub = (params: any): Promise<AxiosResponse<any>> => {
  return post('subjects/add', params);
};
//获取单个试卷信息
const subjectsinfo = (params: any): Promise<AxiosResponse<any>> => {
  return get('subjects/get', params);
};
//根据试卷ID导出
const exportExcel = (params: any): Promise<AxiosResponse<any>> => {
  return get('subjects/exportExcel', params, { responseType: 'blob' });
};
const getTest = (id: any) => {
  return get('test/get', { id });
};
export { getList, getTest, delinfo, subjectsinfo, addsub, exportExcel };
