import {post,get} from "./request"
import { AxiosResponse } from 'axios';
//获取试卷列表
const examList=(params:any)=>{
    return get('test/list',params)
}
const studentlist=(params:any)=>{
    return get('student/test',params)
}
export {examList,studentlist}