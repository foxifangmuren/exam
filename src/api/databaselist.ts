import {post,get} from "./request"
import { AxiosResponse } from 'axios';
//题库列表
const databaseList=(params:any)=>{
    return get('database/list',params)
}
//添加题库
const addlist=(params:any)=>{
    return post('database/add',params)
}
//删除题库
const del=(params:any)=>{
    return get('database/delete',params)
}
const wy=(params:any)=>{
  return get('/subjects/get',params)
}
export {databaseList,addlist,del,wy}