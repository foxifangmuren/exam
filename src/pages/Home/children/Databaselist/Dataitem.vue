<template>
  <div>
    <!-- 表头 -->
    <div class="Dataitem_title">
      <div>
        <el-page-header @back="goBack">
          <template #content>
            <span class="text-large font-600 mr-3">{{ title }}</span>
          </template>
        </el-page-header>
      </div>
      <div>
        <el-button size="default">添加试题</el-button>
        <el-button type="primary" size="default" @click="addall" >批量添加</el-button >
      </div>
    </div>
    
    <!-- 头部 -->
    <el-form
      :inline="true"
      :model="from.query"
      class="demo-form-inline title_box_input"
    >
      <el-form-item label="题目名称">
        <el-input
          v-model="from.query.key"
          placeholder="请输入题目名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="创建人">
        <el-input
          v-model="from.query.admin"
          placeholder="请输入题目名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="题目类型">
        <el-select
          v-model="from.query.type"
          placeholder="全部"
          clearable
          @keyup.enter="onSubmit"
          @change="onSubmit"
        >
          <el-option label="单选题" value="单选题" />
          <el-option label="多选题" value="多选题" />
          <el-option label="问答题" value="问答题" />
          <el-option label="判断题" value="判断题" />
          <el-option label="填空题" value="填空题" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="danger" @click="onSubmit" :disabled="true"
          >批量删除</el-button
        >
        <el-button @click="download">导出excel</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 接受：表格数据（tableData）表格头部（tableHeader） 是否有复选框（isTypeSelection） -->
    <MyTable
      :tableData="from.tableData"
      :tableHeader="tableHeader"
      :isTypeSelection="true"
      @goinfo="goinfo"
      @goinfotow="goinfotow"
      @del="datadel"
    ></MyTable>
    <!--  分页 接受：总条数（total） 页数（page） 条数（psize） 方法（changPageSize）（changPage） -->
    <MyPages
      :total="from.total"
      :page="from.query.page"
      :psize="from.query.psize"
      @changePageSize="changePageSize"
      @changePage="changePage"
    ></MyPages>
    <!-- 侧栏弹框  试题详情-->
    <el-drawer
      v-model="from.drawer"
      title="试题修改"
      :close-on-click-modal="true"
      :before-close="handleClose"
      size="50%"
    >
      <!-- 弹框内容 -->
      <div>111</div>
    </el-drawer>

    <!-- 批量添加弹框 -->
    <DataDialog :dialogVisible="from.dialogVisible"></DataDialog>


  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";
import { questions, exportExcel,} from "@/api/databaselist";
//地址栏数据
const route = useRoute();
const title = ref(route.query.title);
const testid = ref(route.query.id);

//表格数据
const from = reactive({
  //批量添加框
  dialogVisible: true,
  query: {
    databaseid: 0,
    page: 1,
    psize: 10,
    key: "",
    tags: "",
    type: "",
    admin: "",
  },
  Dtitle: "",
  tableData: [],
  Dlist: [],
  Authorization:{Authorization:sessionStorage.getItem('token')},
  drawer: false,
  //总条数
  total: 0,
  addFile:[],
});

const getlist = async (id: any) => {
  from.query.databaseid = id;
  const src = await questions(from.query);
  from.tableData = src.data.list;
  from.total = src.data.counts;
};
getlist(testid);
//表格头部
const tableHeader = [
  {
    prop: "title",
    label: "题目名称",
    type: "buttons",
    buttons: [
      {
        text: "title",
        type: "primary",
        event: "goinfo",
      },
    ],
  },
  {
    prop: "type",
    label: "题量类型",
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
        text: "编辑",
        type: "primary",
        event: "goinfotow",
      },
      {
        text: "删除",
        type: "primary",
        event:'del'
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
const goBack = () => router.go(-1);
//查询
const onSubmit = () => getlist(testid);
//下载试卷内容
const download = async () => {
  console.log(testid.value, "111");
  const src = await exportExcel({id:testid.value}).then(
    (src:any)=>{
        let blob= new Blob([src], {type: 'application/vnd.ms-excel'});
        let url= URL.createObjectURL(blob);
        let a= document.createElement("a");
        a.href=url;
        a.style.display="none";
        document.body.appendChild(a);
        a.setAttribute("download",'瞎子啊');
        a.click();
        document.body.removeChild(a);
    }
  )
  console.log(src);
  
};
//试卷详情
const goinfo = () => {
  from.drawer = true;
};
//批量添加===弹框
const addall = () =>  from.dialogVisible = true;

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
.styles {
  height: 40px;
  line-height: 80px;
}
.margin_top {
  margin-top: 30px;
  background-color: rgb(255, 202, 202);
}
.Dataitem_title {
  display: flex;
  justify-content: space-between;
}
</style>

    
    