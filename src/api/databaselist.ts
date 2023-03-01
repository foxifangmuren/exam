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
    return get('databasequestion/exportExcel',params,{responseType: 'blob'})
}
//试题批量上传
const Daddlist=(params:any)=>{
    return post('databasequestion/addlist',params)
}
//试题删除信息
const databasequestiondel=(params:any)=>{
    return get('databasequestion/delete',params)
}
//批量删除
const dells=(params:any)=>{
    return post('database/deleteall',params)
}
//试题批量删除
const testdel=(params:any)=>{
    return post('databasequestion/deleteall',params)
}
//试题添加
const addDataitem=(params:any)=>{
    return post('databasequestion/add',params)
}
export {databaseList,addlist,del,questions,exportExcel,Daddlist,databasequestiondel,dells,
    testdel,
    addDataitem
}