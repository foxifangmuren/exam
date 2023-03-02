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
        <el-button size="default" @click="addtest">添加试题</el-button>
        <el-button type="primary" size="default" @click="addall"
          >批量添加</el-button
        >
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
        <el-button type="danger"  :disabled="from.disabled"
          @click="dell">批量删除</el-button
        >
        <el-button @click="download">导出excel</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 接受：表格数据（tableData）表格头部（tableHeader） 是否有复选框（isTypeSelection） -->
    <MyTable
      :tableData="from.tableData"
      :tableHeader="tableHeader"
      :isTypeSelection="true"
      @delarrinfo="delarrinfo"
      @goinfo="goinfo"
      @del="datadel"
      
    ></MyTable>
    <!--  分页 接受：总条数（total） 页数（page） 条数（psize） 方法（changPageSize）（changPage） -->
    <MyPages :total="from.total" :page="from.query.page" :psize="from.query.psize"  @changePageSize="changePageSize" @changePage="changePage" ></MyPages>
    <!-- 侧边详情框 -->
    <MyCDatadrawer :list="from.data" ref="mycdatadrawer"></MyCDatadrawer>
    <!-- 批量添加弹框 -->
    <MyDialog @getlist="getlist" ref="adddata"></MyDialog>
    <!-- 添加侧边框 -->
    <Adddrawer @getlist="getlist" ref="draweraddinfo"></Adddrawer>
  </div>
</template>

<script lang="ts" setup>
/**
 * 试卷详情，
 * 查询，
 * 删除
 * 弹框
 *
 */
import { ref, reactive, provide } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";
import { questions, exportExcel, databasequestiondel,testdel} from "@/api/databaselist";
import { ElMessageBox } from "element-plus";
//试题添加
const draweraddinfo=ref<any>()
const addtest=()=>{
  console.log('添加试题');
  console.log(draweraddinfo,"暴露属性");
  draweraddinfo.value.drawer=true
}
//详情列表的渲染
const mycdatadrawer=ref<any>()
const goinfo = (vla: any) => {
  from.data=vla
  mycdatadrawer.value.drawer=true
};
//地址栏数据
const route = useRoute();
const title: any = ref(route.query.title);
const testid:any = ref(route.query.id);
//表格数据
const from = reactive({
  //批量添加框
  dialogVisible: false,
  // 查询数据
  query: {
    databaseid: 0,
    page: 1,
    psize: 10,
    key: "",
    tags: "",
    type: "",
    admin: "",
  },
  //列表数据
  tableData: [],
  //详情数据框
  drawer: false,
  data:{},
  //详情数据列表
  particulars: [],
  //总条数
  total: 0,
  //试卷批量删除
  disabled: true,
  delarray:[]
});
//批量删除
const delarrinfo=(val:any)=>{
  console.log(val);
  
    if(val){
      from.disabled=false
      from.delarray=val
    }
}
const dell=async()=>{
    const src=await testdel({"ids":from.delarray})
    getlist();
    console.log(src);
}
//请求列表接口
const getlist = async () => {
  from.query.databaseid = testid;
  const src = await questions(from.query);
  from.tableData = src.data.list;
  from.total = src.data.counts;
};
getlist();
//返回
const goBack = () => router.go(-1);
//查询
const onSubmit = () => getlist();
//表格头部
const tableHeader = [
  {
    prop: "title",
    label: "题目名称",
    type: "buttons",
    buttons: [
      {
        text: "表头",
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
        event: "del",
      },
    ],
  },
];
//批量添加===弹框
const adddata=ref<any>()
const addall = () => {
  adddata.value.dialogVisible = true
};
//试题删除===单个试题的删除
const datadel = (vla: any) => {
  ElMessageBox.confirm("确定删除该条数据吗?")
    .then(async () => {
      const src = await databasequestiondel({ id: vla.id });
      //刷新列表
      getlist();
    })
    .catch(() => {});
};
//分页操作
const changePage = (val: number) => {
  from.query.page = val;
  getlist();
};
const changePageSize = (val: number) => {
  from.query.psize = val;
  getlist();
};
//下载试卷内容
const download = async () => {
  const src = await exportExcel({ id: testid.value }).then((src: any) => {
    let blob = new Blob([src], { type: "application/vnd.ms-excel" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.style.display = "none";
    document.body.appendChild(a);
    a.setAttribute("download", title.value);
    a.click();
    document.body.removeChild(a);
  });
};
</script>

<style scoped lang="less">
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

    
    