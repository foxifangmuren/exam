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
      @compile="compile"
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
    <SubjectsdlogVue :title="from.title" :data="from.data"  ref="subdata"></SubjectsdlogVue>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { getList, delinfo,subjectsinfo } from "@/api/Subjects";
import { ElMessageBox ,ElMessage} from "element-plus";
import router from "@/router";
//试卷详情
const subdata=ref<any>()
const gopage=async(val:any)=>{
  from.title=val.title
  const src=await subjectsinfo({id:val.id})
  from.data=src.data
  subdata.value.dialogTableVisible=true
}
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
  //详情
  data:{},
  title:'',
});
const getlt = async () => {
  const src = await getList(from.query);
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
        text: "表头",
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
        event: "compile",
      },
      {
        type: "primary",
        event: "del",
        text: "删除",
      },
    ],
  },
];
//编辑
const compile=(vla:any)=>{
  // console.log(vla.id);
   router.push(`/testadd/${vla.id}`);
}
//跳转详情页面
const skip=()=>{
  router.push("/testadd/1");
}
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

</script>


<style scoped>
.title_header {
  display: flex;
  justify-content: space-between;
}
</style>
