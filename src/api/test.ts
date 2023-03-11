import { post, get } from './request';
// 考试列表
export const testList = (data: any) => {
  return get('/test/list', data)
} 
// 考试详情 
export const testDetails = (data: any) => {
  return get('/test/get', data)
  }
  // 删除考试 
  export const testDel = (data: any) => {
    return get('/test/delete', data)
  }
  // 批删
  export const testDelAll = (data: any) => {
    return post('/test/deleteall', data)
  }
  // 修改状态
  export const testState = (data: any) => {
    return post('/test/updateState', data)
  } 
  // 部门列表 
  export const departmentList = (data: any) => {
    return get('/department/list', data)
  }
  // 班级列表  
  export const classList = (data: any) => {
    return get('/classes/list', data)
  }
  //老师列表 
  export const teacherList = (data: any) => {
    return get('/teacher/list', data)
  }
  // 题库列表
  export const baseList = (data: any) => {
    return get('/database/list', data)
  }
  // 考试添加 
  export const testAdd = (data: any) => {
    return post('/test/add', data)
  }
  // 穿梭框 学生列表 
  export const studentlist = (params: any) => {
    return get('/student/list', params)
  }
// 考试分析 
export const testAnalyse = (params: any) => {
  return get('/test/analyse', params)
}
export const SeleList = (params: any) => {
  return get('department/list', params)
}
export const ForList = (params: any) => {
  return get('teacher/list', params)
}
// 获取学员列表 
export const studentTest = (params: any) => {
  return get('/student/test', params)
}
// 学生考试结果 
export const getForResult= (params: any) => {
  return get('/test/getForResult', params)
}
// 获取考试信息 
export const testGet= (params: any) => {
  return get('/test/get', params)
}
// 获得考试结果 
export const testResult= (params: any) => {
  return get('/test/getForResult', params)
}
// 开始考试 
export const testStart= (params: any) => {
  return get('/test/start', params)
}
// 学生答题 /
export const stuAdd = (data: any) => {
  return post('/studentanswer/add', data)
}
// 
export const databasequestion_list= (params: any) => {
  return get('/databasequestion/list', params)
}
// 试卷列表 
export const subjects_list= (params: any) => {
  return get('/subjects/list', params)
}
// 单条试卷 /
export const subjects_get= (params: any) => {
  return get('/subjects/get', params)
}
// 导出Excel 
export const testExcel= (params: any) => {
  return get('/test/exportExcel', params)
}