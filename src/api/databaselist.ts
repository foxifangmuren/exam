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
//试题列表
const questions=(params:any)=>{
    return get('databasequestion/list',params)
}
//根据单个ID导出我们的试题
const exportExcel=(params:any)=>{
    return get('subjects/exportExcel',params)
}
export {databaseList,addlist,del,questions,exportExcel}