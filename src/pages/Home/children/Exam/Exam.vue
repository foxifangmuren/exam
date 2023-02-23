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
        <el-button type="primary" @click="query" @keyup.enter="query">搜索</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <MyTable
      :tableData="form.tableData"
      :tableHeader="tableHeader"
      :isTypeSelection="false"
      @go="goStudent"
    ></MyTable>
    <!-- 分页 -->
    <!-- 封装公共分页功能 需要传递参数 总页数、分页相关方法、page psize -->
    <MyPages
      :total="form.total"
      :page="form.query.page"
      :psize="form.query.psize"
      @changPageSize="handleSizeChange"
      @changPage="handleCurrentChange"
    ></MyPages>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import router from "@/router";
import { examList } from "@/api/exam";
import { ElMessage } from "element-plus";
/***
 * 列表请求
 * 添加
 * 删除
 *
 */

//查询功能--由于只有一个输入框，不需要监听输入查询
const query = () => {
  if (!form.query.key) {
    ElMessage({ message: "当前查询为查询全部！！", type: "warning", });
  } else {
    getlist();
  }
};
//表格数据--数组中又多少数据就有多少条数据
const form = reactive({
  //请求数据
  query: {
    key: "",
    page: 1,
    psize: 10,
    isread: "1",
  },
  total: 0,
  //列表数据
  tableData: [],
});
// 请求列表并调用
const getlist = async () => {
  const sre = await examList(form.query);
  form.tableData = sre.data.list;
  form.total = sre.data.counts;
};
getlist();
//分页操作
const handleSizeChange = (val: number) => {
  form.query.psize = val;
  getlist();
};
const handleCurrentChange = (val: number) => {
  form.query.page = val;
  getlist();
};
//跳转页面
const goStudent = (val:any) => {
  router.push("/Exam_student?id="+val.id+"&title="+val.title);
};
//表格数据开头
const tableHeader = [
  {
    prop: "title",
    label: "考试名称",
  },
  {
    prop: "info",
    label: "考试说明",
  },
  {
    prop: "subjectnum",
    label: "题量",
  },
  {
    prop: "studentcounts",
    label: "考试人数",
  },
  {
    prop: "incomplete",
    label: "未判人数",
  },
  {
    prop: "endtime",
    label: "开放时间",
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

    