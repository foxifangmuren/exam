<template>
  <div>
    <!-- 头部 -->
    <div>
      <p class="titile_header">阅卷管理</p>
      <div class="title_box_input">
        <p>关键字:</p>
        <el-input
          class="titl_input"
          v-model="input"
          placeholder="请输入题库名称"
          clearable
        />
        <el-button type="primary" @click="query">搜索</el-button>
      </div>
    </div>
    <!-- 表格 -->

    <Table :tableData="tableData" :tableHeader="tableHeader"></Table>
    <!-- <el-table :data="tableData" style="width: 100%" :header-cell-style="{ background: '#f5f7fa' }">
      <el-table-column  />
      <el-table-column  />
      <el-table-column />
      <el-table-column  />
      <el-table-column />
      <el-table-column />
      <el-table-column " width="180">
        <el-button key="primary" type="primary" link @click="goStudent()">阅卷</el-button >
      </el-table-column>
    </el-table> -->


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
import { ref } from "vue";
import router from '@/router';
import Table from "@/components/Table.vue"
//搜索框
const input = ref("");
//查询功能--由于只有一个输入框，不需要监听输入查询
const query=()=>{
  console.log(input.value);
  
}
//表格数据--数组中又多少数据就有多少条数据
const tableData = [
     {
        id: 3533,
        title: "850",
        info: "20",
        addtime: "2023-02-22 08:46:00.0",
        teacherid: 1828,
        admin: "超级管理员",
                begintime: null,
                endtime: null,
                currenttime: null,
                studentStartTime: null,
                stuEndTime: null,
                limittime: 0,
                qorder: 0,
                aorder: 0,
                num: 0,
                pastnum: 0,
                scores: 100.0,
                pastscores: 60.0,
                studentScores: 0.0,
                subjectnum: 1,
                isshow: 1,
                answershow: 1,
                studentcounts: 1,
                incomplete: 1,
                passCounts: 0,
                unpassCounts: 0,
                limits: null,
                markteachers: null,
                students: null,
                databaseid: 0,
                state: 1,
                result: null,
                studentIsComplete: 0,
                isread: 2,
                questions: null
            },
];
//分页
const currentPage4 = ref(4);
const pageSize4 = ref(100);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);
//分页操作
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};
//跳转页面
const goStudent=()=>{
  router.push('/Exam_student');
}



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

    