<template>
  <div>
    <!-- 头部  -->
    <div>
      <p>试卷管理</p>
      <el-button type="primary" @click="gg">创建题库</el-button>
    </div>
    <!-- 搜索框  -->
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
      <el-form-item label="创建人">
        <el-checkbox v-model="checked" @change="check"
          >只看我创建的</el-checkbox
        >
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" @keyup="onSubmit"
          >查询</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button type="danger" :disabled="from.disabled">批量删除</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <MyTable
      :isTypeSelection="false"
      :tableHeader="tableHeader"
      :tableData="from.tableData"
      @del="open"
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

<script setup lang="ts">
import { reactive, ref, toRefs } from "vue";
import { getList } from "@/api/Subjects";
//请求列表
const from = reactive({
  query: {
    key: "",
    admin: "",
    ismy: 1,
    page: 1,
    psize: 10,
  },
  tableData:[],
  total:0,
});
const getlt = async () => {
  const src = await getList(from.query);
  console.log(src);
  from.tableData = src.data.list;
  from.total = src.data.counts;
};
getlt();
//表格数据
const tableHeader = [
  {
    prop: "title",
    label: "试卷名称",
  },
  {
    prop: "counts",
    label: "题量",
  },
  {
    prop: "singles",
    label: "单选",
  },
  {
    prop: "multiples",
    label: "多选",
  },
  {
    prop: "judges",
    label: "判断",
  },
  {
    prop: "blanks",
    label: "填空",
  },
  {
    prop: "databaseid",
    label: "问答",
  },
  {
    prop: "scores",
    label: "总分",
  },
  {
    prop: "admin",
    label: "创建人",
  },
  {
    prop: "addtime",
    label: "更新时间",
  },
  {
    label: "操作",
    type: "buttons",
    buttons: [
      {
        type: "primary",
        text: "编辑",
      },
      {
        type: "primary",
        event: "del",
        text: "删除",
      },
    ],
  },
];
// 分页方法
const changePage = (val: number) => {
  from.query.page = val;
  getlt();
};
const changePageSize = (val: number) => {
  from.query.psize = val;
  getlt();
};
</script>

<style lang="scss" scoped>
</style>