<template>
  <div>
    <!-- 表头 -->
    <el-page-header @back="goBack">
      <template #content>
        <span class="text-large font-600 mr-3">{{ title }}</span>
      </template>
    </el-page-header>
    <!-- 头部 -->
    <el-form
      :inline="true"
      :model="from.query"
      class="demo-form-inline title_box_input"
    >
      <el-form-item label="考生姓名">
        <el-input v-model="from.query.key" placeholder="请输入学生姓名" clearable />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="from.query.state"  placeholder="全部" clearable >
          <el-option label="已阅卷" value="shanghai" />
          <el-option label="未阅卷" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门">
        <el-tree-select v-model="from.query.dep" :data="data" :render-after-expand="false"  clearable />
      </el-form-item>
      <el-form-item label="班级">
        <el-select v-model="from.query.classname" placeholder="请选择" disabled="true" clearable >
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <!-- 此处为封装表格，表格内容为 是否有复选框（isTypeSelection） 格式（tableHeader），数据（tableData），若干方法等 -->
    <MyTable
      :tableData="from.tableData"
      :tableHeader="tableHeader"
      :isTypeSelection="false"
    ></MyTable>
    <!-- 分页 -->
    <!-- 此处为封装分页，分页内容为，分页相关方法（）（），总页数（total）,页数（page）条数（psize） -->
    <MyPages
      :total="from.total"
      :page="from.query.page"
      :psize="from.query.psize"
      @changePageSize="changePageSize"
      @changePage="changePage"
    ></MyPages>
    <!-- 侧栏弹框 -->
    <!-- <el-drawer
      v-model="drawer"
      title="I am the title"
      :direction="direction"
      :before-close="handleClose"
    > -->
      <!-- 弹框内容 -->
      <!-- <span>Hi, there!</span> -->
    <!-- </el-drawer> -->
  </div>
</template>

<script lang="ts" setup>
import { ref,reactive  } from "vue";
import { useRoute } from "vue-router"
import router from "@/router";
import {studentlist} from "@/api/exam"
const route = useRoute()
const title=ref(route.query.title)
const testid=ref(route.query.id)
//表格数据
const from=reactive({
    query:{
      testid:0,
      page:  1,
      psize:  10,
      state:"",//状态
      key:"" ,
      dep:"",
    },
    tableData:[],
      //总条数
  total: "",
})
const getlist=async (id:any)=>{
    from.query.testid=id
    const src = await studentlist(from.query)
    console.log(src);
    from.tableData=src.data.list
      from.total = src.data.counts;
}
getlist(testid)
//表格头部
const tableHeader = [
  {
    prop: "name",
    label: "姓名",
  },
  {
    prop: "classname",
    label: "班级名称",
  },
  {
    prop: "scores",
    label: "分数",
  },
  {
    prop: "readtime",
    label: "考试时间",
  },
  {
    prop: "state",
    label: "状态",
  },
  {
    label: "操作",
    type: "buttons",
    buttons: [
      {
        text: "exam",
        type: "primary",
        event:"go"
      },
    ],
  },
];
//分页操作
const changePage = (val: number) => {
  from.query.page = val;
  getlist(testid);
};
const changePageSize = (val: number) => {
  from.query.psize = val;
  getlist(testid);
};
//返回
const goBack = () => {
    router.go(-1)
}
//表单操作
const formInline = reactive({
  user: "",
  region: "",
});

const onSubmit = () => {
  console.log("submit!");
};

//树形控制
const data = [
  {
    value: "1",
    label: "Level one 1",
    children: [
      {
        value: "1-1",
        label: "Level two 1-1",
        children: [
          {
            value: "1-1-1",
            label: "Level three 1-1-1",
          },
        ],
      },
    ],
  },
  {
    value: "2",
    label: "Level one 2",
    children: [
      {
        value: "2-1",
        label: "Level two 2-1",
        children: [
          {
            value: "2-1-1",
            label: "Level three 2-1-1",
          },
        ],
      },
      {
        value: "2-2",
        label: "Level two 2-2",
        children: [
          {
            value: "2-2-1",
            label: "Level three 2-2-1",
          },
        ],
      },
    ],
  },
  {
    value: "3",
    label: "Level one 3",
    children: [
      {
        value: "3-1",
        label: "Level two 3-1",
        children: [
          {
            value: "3-1-1",
            label: "Level three 3-1-1",
          },
        ],
      },
      {
        value: "3-2",
        label: "Level two 3-2",
        children: [
          {
            value: "3-2-1",
            label: "Level three 3-2-1",
          },
        ],
      },
    ],
  },
];
//侧边弹框
const drawer = ref(false);
const handleClose = (done: () => void) => {
  done();
};
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

    