<template>
 <div>
        <el-dialog v-model="teacher" title="可见老师">
          <div style="margin-left: 20px; margin-bottom: 20px">
            <el-form-item label="部门">
              <!-- <el-cascader v-model=""  :options="from.deplist"  :props="props1" clearable /> -->
              <el-select v-model="from.query.depid" placeholder="请选择" :disabled="classname" clearable @change="changedepid" >
                <el-option  v-for="(item,index) in from.deplist" :label="item.name" :value="item.id" :key="index"/>
              </el-select>
            </el-form-item> 
          </div>
          <div style="margin-left: 20px">
            <el-transfer
              v-model="from.depval"
              :props="{
                key: 'id',
                label: 'name',
              }"
              @left-check-change="leftChange"
              @right-check-change="rightChange"
              :data="from.teacherdata"
              :titles="['未选','已选']"
            />
          </div>

          <template #footer>
            <span class="dialog-footer">
              <el-button @click="teacher = false">取消</el-button>
              <el-button type="primary" @click="generateData">
                确定
              </el-button>
            </span>
          </template>
        </el-dialog>
      </div>
</template>
<script lang='ts' setup>
import {departmentlist,teacherlist} from "@/api/admin"
import {reactive, ref} from "vue"
//定义参数
const from =reactive({
  deplist:[],
  teacherdata:[],
  query:{
    page: 1,
    psize:  500,
    depid:0,
  },
  depval:[],
  deplength:[]
})
//接受参数--定义
const teacher=ref(false)
//接受参数--暴露
defineExpose({teacher})
//请求部门列表
const deplist=async ()=>{
  const src = await departmentlist('')
  // console.log(src);
  from.deplist=src.data.list
}
deplist()
//更改
const changedepid=()=>{
  getthears()
}
//请求老师列表
const getthears=async ()=>{
  const src=await teacherlist(from.query)
  from.teacherdata=src.data.list 
}
getthears()
//选中事件
const leftChange=(val:any)=>{
  console.log(val );
  from.depval.push(val)
}
const rightChange=(val:any)=>{
  console.log(val,'111');
  
}
</script>
<style scoped>
:deep(.el-transfer__buttons){
  display: none;
}
:deep(.el-transfer){
  display: flex;
  justify-content: space-between;
}
</style>
    