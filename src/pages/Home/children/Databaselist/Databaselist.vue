<template>
  <div>
    <!-- 头部标题 -->
    <div class="title_header">
      <p>题库管理</p>
      <el-button type="primary" @click="gg"
        >创建题库</el-button
      >
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
      :isTypeSelection="true"
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
    <!-- 弹框 -->
    <MyBialog ref="Refer" @getlist="getlist"></MyBialog>

  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs } from "vue";
import { databaseList ,del} from "@/api/databaselist";
import { ElMessageBox } from "element-plus";

//弹框区域
let Refer=ref<any>(null)
const gg =()=>{
  console.log(Refer.value)
  Refer.value.dialogVisible=true
}


//只看我创建的
let checked: any = ref(false);
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
        event: 'del',
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
  loading:true,
  //总条数
  total: 0,
  //表格数据
  tableData: [],
  //批量删除按钮
  disabled: true,
});
const getlist = async () => {
  const src = await databaseList(from.query);
  console.log(src);
  from.tableData = src.data.list;
  from.total = src.data.counts;
};
getlist();
//删除
const open= async(val:any) =>{
  //删除刷新列表，删除时有提示信息，删除时出现Login效果
  const src:any=await del({id:val.id})
  console.log(src);
  if(src.errCode=="10000"){
    //请求列表
    getlist()
  }else{
    console.log();
    
  }
  
}
// 分页方法
const changePage = (val: number) => {
  from.query.page = val;
  getlist();
};
const changePageSize = (val: number) => {
  from.query.psize = val;
  getlist();
};
//复选框监听
const check = (done: () => void) => {
  if (checked.value == true) {
    // console.log('111')
    from.query.ismy = "3";
    getlist();

    ElMessageBox.confirm(`确定要切换本人创建的吗?`)
      .then(() => {
        checked.value = true;
      })
      .catch(() => {
        // catch error
        checked.value = false;
      });
  } else {
    ElMessageBox.confirm(`确定要切换全部试题吗?`)
      .then(() => {
        checked.value = false;
      })
      .catch(() => {
        // catch error
        checked.value = true;
      });
  }
};
</script>



<style scoped>
.title_header {
  display: flex;
  justify-content: space-between;
}
</style>
