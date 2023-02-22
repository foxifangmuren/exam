<template>
  <div>
    <!-- 表头 -->
    <el-page-header @back="goBack">
      <template #content>
        <span class="text-large font-600 mr-3"> Title </span>
      </template>
    </el-page-header>
    <!-- 头部 -->
    <el-form
      :inline="true"
      :model="formInline"
      class="demo-form-inline title_box_input"
    >
      <el-form-item label="考生姓名">
        <el-input
          v-model="formInline.user"
          placeholder="Approved by"
          clearable
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="formInline.region"
          placeholder="Activity zone"
          clearable
        >
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门">
        <el-tree-select
          v-model="value"
          :data="data"
          :render-after-expand="false"
          clearable
        />
      </el-form-item>
      <el-form-item label="班级">
        <el-select
          v-model="formInline.region"
          placeholder="Activity zone"
          disabled="true"
          clearable
        >
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->


    <el-table
      :data="tableData"
      style="width: 100%"
      :header-cell-style="{ background: '#f5f7fa' }"
    >
      <el-table-column prop="date" label="Date" />
      <el-table-column prop="name" label="Name" />
      <el-table-column label="Address" width="180">
        <el-button key="primary" type="primary" link  @click="drawer = true">阅卷</el-button>
      </el-table-column>
    </el-table>


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
    <!-- 侧栏弹框 -->
    <el-drawer
      v-model="drawer"
      title="I am the title"
      :direction="direction"
      :before-close="handleClose"
    >
      <!-- 弹框内容 -->
      <span>Hi, there!</span>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref,reactive  } from "vue";
//侧边弹框引入
import { ElMessageBox } from "element-plus";
import router from "@/router";
//表格数据
const tableData = [
  {
    date: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-02",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-04",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-01",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
];

//分页数据
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

    