<template>
  <div class="box">
    <!-- 头部 -->
    <div class="header">
      <span class="head">班级管理</span>
      <el-button type="primary">添加班级</el-button>
    </div>
    <!-- 内容 -->
    <div class="content">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="班级名称">
          <el-input v-model="data.key" placeholder="请输入关键字" />
        </el-form-item>
        <el-form-item label="部门">
          <el-cascader v-model="data.value" :options="data.options" :props="props" 
          @change="handleChange" clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-table
          ref="multipleTableRef"
          :data="data.tableData"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column property="name" label="班级名称" />
          <el-table-column property="depname" label="部门"/>
          <el-table-column label="操作" width="120">
            <span class="zi">修改</span><span class="zi">删除</span>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="demo-pagination-block">
      <el-pagination
        v-model:current-page="data.params.page"
        v-model:page-size="data.params.psize"
        :page-sizes="[5, 10, 15, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="data.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { log } from 'console';
import { onMounted, reactive,ref, toRefs } from 'vue';
import {departmentlist,classeslist} from '../../../../api/admin'
const data = reactive({
  //表格数据
  tableData:[],
  //列表参数
  params:({
    name:'',
    depname:"",
    page:1, 
    psize: 10
  }),
  key:'',
  //搜索
  value:[],
  //部门
  options:[],
  //分页 总页数
  total:0
});
// 解构数据
const {  params} = toRefs(data)
const props = {
    expandTrigger: 'hover',
    checkStrictly: true,
    value: 'id', label: 'name'
}
const handleChange = (e: any) => {
    data.value = e
}

interface User {
  date: string
  name: string
  address: string
}
const multipleSelection = ref<User[]>([])

const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val
}
const value:any  = ref('')
//级联调接口
const departmentList = async () => {
  const res:any = await departmentlist()
  console.log('级联',res)
  if(res.errCode === 10000){
    data.options = res.data.list
  }
}
//班级列表
const getclasseslist = async ()=>{
  const res:any = await classeslist({...params.value, depid: data.value?data.value[data.value.length - 1]:0, key: data.key })
  console.log('班级列表',res)
  if(res.errCode === 10000){
    data.tableData = res.data.list
    data.total = res.data.counts
  }
}
//查询
const onSubmit = () => {
  console.log('hello')
  getclasseslist()
};

//分页
const handleSizeChange = (val: number) => {
  getclasseslist()
  }
  const handleCurrentChange = (val: number) => {
    getclasseslist()
  }

//页面加载
onMounted(()=>{
  //班级列表
  getclasseslist()
  //部门级联
  departmentList()
})


</script>

<style scoped>
.box {
  margin-left: 5px;
  /* background-color: aquamarine; */
}
.header {
  display: flex;
  justify-content: space-between;
}
.head {
  font-size: 20px;
}

.content {
  margin-top: 10px;
}
.zi{
  font-size: 6px;
  margin-right: 10px;
  /* color: #; */
}

.element.style {
    background: rgb(250, 250, 250);
}

.demo-pagination-block{
  margin-left: 100px;
}
</style>
