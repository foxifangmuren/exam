<template>
  <div>
    <!-- 头部 -->
    <div>
      <p class="titile_header">阅卷管理</p>
      <div class="title_box_input">
        <p>关键字:</p>
        <el-input
          class="titl_input"
          v-model="form.query.key"
          placeholder="请输入题库名称"
          clearable
        />
        <el-button type="primary" @click="query" >搜索</el-button>
        <el-button @click="drawer = true">1111</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <MyTable :tableData="form.tableData" :tableHeader="tableHeader" ></MyTable>
    <!-- 分页 -->
    <div class="demo-pagination-block">
      <el-pagination
        v-model:current-page="currentPage4"
        v-model:page-size="pageSize4"
        :page-sizes="[100, 200, 300, 400]"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref,reactive  } from "vue";
import router from '@/router';
import {examList} from "@/api/exam"
import { log } from "console";
/***
 * 列表请求
 * 添加
 * 删除
 * 
 */


//查询功能--由于只有一个输入框，不需要监听输入查询
const query=()=>{
    getlist()
}
//表格数据--数组中又多少数据就有多少条数据
const form = reactive({
    query:{
      key:"",
      page:"",
      psize:"",
      isread:"1",
    },
    tableData:[]
});
const getlist=async()=>{
  const sre=await examList(form.query)
  console.log(sre);
  form.tableData=sre.data.list
}
getlist()
//分页
const currentPage4 = ref(4);
const pageSize4 = ref(100);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);
//分页操作
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
  
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};
//跳转页面
const goStudent=()=>{
  router.push('/Exam_student');
}
//表格数据开头
const tableHeader=[
  {
    prop:"title" ,
    label:"考试名称"
  },
  {
   prop:"info" ,
   label:"考试说明"
  },
   {
    prop:"subjectnum" ,
    label:"题量"
  },
   {
   prop:"studentcounts" ,
   label:"考试人数"
  },
   {
   prop:"incomplete" ,
   label:"未判人数"
  },
   {
   prop:"endtime" ,
   label:"开放时间"
  },
   {
    label:"操作",
    type:"buttons",
    buttons:[
      {
        text:"阅卷",
        type:"primary"
      }
    ]
  },
]
</script>

<style scoped>
.titile_header {
  font-size: 20px;
}
.title_box_input {
  display: flex;
  align-items: center;
  margin: 20px 0;
}
.titl_input {
  width: 200px;
  margin: 0 30px 0 10px;
}
.demo-pagination-block {
  width: 600px;
  margin: 20px auto;
}
</style>

    