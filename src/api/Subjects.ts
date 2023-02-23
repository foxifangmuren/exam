import {post ,get} from "./request"
import { AxiosResponse } from "axios";
//试卷管理
 const getList=(params:any): Promise<AxiosResponse<any>>=>{
    return get('subjects/list',params)
}
//删除数据
 const delinfo=(params:any):Promise<AxiosResponse<any>>=>{
    return get('subjects/delete',params)
}
export {getList, delinfo}