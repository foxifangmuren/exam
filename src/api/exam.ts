import {post,get} from "./request"
import { AxiosResponse } from 'axios';
//获取试卷列表
const examList=(params:any)=>{
    return get('test/list',params)
}
//考试学生
const studentlist=(params:any)=>{
    return get('student/test',params)
}
//学生单个信息
const studentinfo=(params:any)=>{
    return get('question/listforstu',params)
}
//老师判卷
const stydenupdata=(params:any)=>{
    return post('studentanswer/update',params)
}
export {examList,studentlist,studentinfo,stydenupdata}