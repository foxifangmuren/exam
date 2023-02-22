import {post,get} from "./request"
import { AxiosResponse } from 'axios';
const examList=(params:any)=>{
    return get('test/list',params)
}
export {examList}