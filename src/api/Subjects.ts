import {post ,get} from "./request"
import { AxiosResponse } from "axios";
//试卷管理
export const getList=(params:any): Promise<AxiosResponse<any>>=>{
    return get('subjects/list',params)
}
