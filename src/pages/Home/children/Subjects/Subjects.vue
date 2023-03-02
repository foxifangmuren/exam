<template>
  <div>
    <!-- 头部  -->
    <div class="title_header">
      <p>试卷管理</p>
      <el-button type="primary" @click="skip">创建试卷</el-button>
    </div>
    <!-- 搜索框  -->
    <el-form class="demo-form-inline" :inline="true" :model="from.query">
      <el-form-item label="题库名称">
        <el-input  v-model="from.query.key" placeholder="请输入题库名称" @keyup.enter="onSubmit" />
      </el-form-item>
      <el-form-item label="创建人">
        <el-input v-model="from.query.admin" placeholder="请输入创建人" @keyup.enter="onSubmit" />
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="checked" @change="check" >只看我创建的</el-checkbox >
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" @keyup="onSubmit" >查询</el-button >
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <MyTable
      :isTypeSelection="false"
      :tableHeader="tableHeader"
      :tableData="from.tableData"
      @del="del"
      @gopage="gopage"
    ></MyTable>
    <!-- 分页 -->
    <MyPages
      :total="from.total"
      :page="from.query.page"
      :psize="from.query.psize"
      @changePageSize="changePageSize"
      @changePage="changePage"
    ></MyPages>
    <!-- 试卷详情  -->
    <el-dialog v-model="dialogTableVisible" title="Shipping address"  width="80%">
      <div>111</div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { getList, delinfo } from "@/api/Subjects";
import { ElMessageBox ,ElMessage} from "element-plus";
import router from "@/router";
const dialogTableVisible = ref(false)
//请求列表
const from = reactive({
  query: {
    key: "",
    admin: "",
    ismy: 0,
    page: 1,
    psize: 10,
  },
  tableData: [],
  total: 0,
});
const getlt = async () => {
  const src = await getList(from.query);
  // console.log(src);
  from.tableData = src.data.list;
  from.total = src.data.counts;
};
getlt();
//表格数据
const tableHeader = [
  {
    prop: "title",
    label: "试卷名称",
    type: "buttons",
     buttons: [
      {
        type: "primary",
        text: "title",
        event:"gopage"
      },
  ]

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
    type:"time",
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
//查询
const onSubmit = () => {
  console.log("submit!");
  getlt();
};
//只看我创建的---待优化添加提示，根据请求结果
let checked: any = ref(false);
const check = (done: () => void) => {
  if (checked.value == true) {
    ElMessageBox.confirm(`确定要切换本人创建的吗?`)
      .then(() => {
        from.query.ismy = 1;
        checked.value = true;
        getlt();
      })
      .catch(() => { checked.value = false; });
  } else {
    ElMessageBox.confirm(`确定要切换全部试题吗?`)
      .then(() => {
        from.query.ismy = 0;
        getlt();
        checked.value = false;
      })
      .catch(() => {checked.value = true;});
  }
};
//删除
const del = (val: any) => {
  ElMessageBox.confirm(`确定要删除该条数据吗?`)
    .then(async () => {
      const src :any= await delinfo({ id: val.id });
      if(src.errCode=="10000"){ElMessage({ message: src.errMsg, type: "success", });getlt()}
    })
    .catch(() => {
      ElMessage({ message: "已取消", type: "error", });
    });
};
//跳转详情页面
const skip=()=>{
  router.push("/subjectsitem");
}
//试卷详情
const gopage=()=>{
  console.log('当前是试卷详情');
dialogTableVisible.value=true
  
}
</script>


<style scoped>
.title_header {
  display: flex;
  justify-content: space-between;
}
</style>
