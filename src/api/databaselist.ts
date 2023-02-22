import {post,get} from "./request"
import { AxiosResponse } from 'axios';
const databaseList=(params:any)=>{
    return get('database/list',params)
}
export {databaseList}