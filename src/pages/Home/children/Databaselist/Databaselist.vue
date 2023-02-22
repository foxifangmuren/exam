<template>
  <div>
    <!-- 头部标题 -->
    <div class="title_header">
      <p>题库管理</p>
      <el-button type="primary">创建题库</el-button>
    </div>
    <!-- 搜索框 -->
    <el-form class="demo-form-inline" :inline="true" :model="from.query">
      <el-form-item label="题库名称">
        <el-input
          v-model="from.query.key"
          placeholder="请输入题库名称"
          @keyup.enter="onSubmit"
        />
      </el-form-item>
      <el-form-item label="创建人">
        <el-input
          v-model="from.query.admin"
          placeholder="请输入创建人"
          @keyup.enter="onSubmit"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" @keyup="onSubmit"
          >查询</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <MyTable
      :isTypeSelection="true"
      :tableHeader="tableHeader"
      :tableData="from.tableData"
    ></MyTable>
    <!-- 分页 -->
    <MyPages
      :total="from.total"
      :page="from.query.page"
      :psize="from.query.psize"
      @changePageSize="changePageSize"
      @changePage="changePage"
    ></MyPages>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { databaseList } from "@/api/databaselist";
//查询
const onSubmit = () => {
  console.log("submit!");
  getlist();
};
//表格数据
const tableHeader = [
  {
    prop: "title",
    label: "题库",
  },
  {
    prop: "counts",
    label: "题量数目",
  },
  {
    prop: "addtime",
    label: "创建时间",
  },
  {
    prop: "admin",
    label: "创建人",
  },
  {
    label: "操作",
    type: "buttons",
    buttons: [
      {
        type: "primary",
        text: "试题",
      },
      {
        type: "primary",
        text: "编辑",
      },
      {
        type: "primary",
        text: "删除",
      },
    ],
  },
];
//请求列表
const from = reactive({
  //表单数据---查询功能
  query: {
    page: 1,
    psize: 10,
    key: "",
    ismy: "",
    admin: "",
  },
  total: "",
  tableData: [],
});
const getlist = async () => {
  const src = await databaseList(from.query);
  console.log(src);
  from.tableData = src.data.list;
  from.total = src.data.counts;
};
getlist();
// 分页方法
const changePage = (val: number) => {
  from.query.page = val;
  getlist();
};
const changePageSize = (val: number) => {
  from.query.psize = val;
  getlist();
};
</script>



<style scoped>
.title_header {
  display: flex;
  justify-content: space-between;
}
</style>
