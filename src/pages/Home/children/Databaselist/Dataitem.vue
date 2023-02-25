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
        <el-button size="default" @click="">添加试题</el-button>
        <el-button type="primary" size="default" @click="">批量添加</el-button>
      </div>
    </div>

    <!-- 头部 -->
    <el-form :inline="true" :model="from.query" class="demo-form-inline title_box_input" >
      <el-form-item label="题目名称">
        <el-input v-model="from.query.key"  placeholder="请输入题目名称" clearable />
      </el-form-item>
      <el-form-item label="创建人">
        <el-input v-model="from.query.admin" placeholder="请输入题目名称" clearable />
      </el-form-item>
      <el-form-item label="题目类型">
        <el-select v-model="from.query.type"  placeholder="全部" clearable @keyup.enter="onSubmit" @change="onSubmit" >
          <el-option label="单选题" value="单选题" />
          <el-option label="多选题" value="多选题" />
          <el-option label="问答题" value="问答题" />
          <el-option label="判断题" value="判断题" />
          <el-option label="填空题" value="填空题" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="danger" @click="onSubmit" :disabled="true">批量删除</el-button>
        <el-button @click="download">导出excel</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 接受：表格数据（tableData）表格头部（tableHeader） 是否有复选框（isTypeSelection） -->
    <MyTable :tableData="from.tableData" :tableHeader="tableHeader" :isTypeSelection="true"
      @goinfo="goinfo"
      @goinfotow="goinfo"
    ></MyTable>
    <!--  分页 接受：总条数（total） 页数（page） 条数（psize） 方法（changPageSize）（changPage） -->
    <MyPages :total="from.total" :page="from.query.page" :psize="from.query.psize" @changePageSize="changePageSize" @changePage="changePage" ></MyPages>
    <!-- 侧栏弹框 -->
    <el-drawer v-model="from.drawer" title="试题修改" :close-on-click-modal="true" :before-close="handleClose" size="50%">
      <!-- 弹框内容 -->
      <div>
        111
      </div>
    </el-drawer>

  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";
import { questions,exportExcel } from "@/api/databaselist";
import { ElMessageBox, ElMessage, FormInstance } from "element-plus";
import { log } from "console";
//地址栏数据
const route = useRoute();
const title = ref(route.query.title);
const testid = ref(route.query.id);
//表格数据
const from = reactive({
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
  drawer: false,
  //总条数
  total: 0,
});
const getlist = async (id: any) => {
  from.query.databaseid = id;
  const src = await questions(from.query);
  // console.log(src);
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
  router.go(-1);
};
//查询
const onSubmit = () => {
  getlist(testid);
};
//下载试卷内容
const download=async()=>{
  console.log(testid.value,"111");
  
  const src=await exportExcel({id:testid.value})
  console.log(src);
  
}
//试卷详情
const goinfo = () => {
  from.drawer = true;
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
const go = (val: any) => {
  console.log(val);
  if (val.state == "已阅卷") {
    ElMessageBox.confirm(`本卷已阅完，是否更改结果?`)
      .then(() => {
        ElMessage({ message: "没有权限", type: "error" });
      })
      .catch(() => {});
  } else {
    from.drawer = true;
    //注意传值，第一个参数是试卷，第二个是学生
    getstdent(route.query.id, val.id);
    from.Dtitle = val.name + "的试卷";
  }
};
const getstdent = async (testid: number | any, studentid: number) => {
  const src = await studentinfo({ testid: testid, studentid: studentid });
  console.log(src);
  from.Dlist = src.data.list;
};
const handleClose = (done: () => void) => done();
//侧边栏内容
const ruleFormRef = ref<FormInstance>();
//域解析
const { Dlist } = toRefs(from);
const scoresValidator = (rule: any, value: any, callback: any) => {
  let max = parseInt(rule.maxScores);
  let _value = parseInt(value);
  if (isNaN(_value)) {
    callback(new Error(`请输入分数`));
  } else if (_value < 0 || _value > max) {
    callback(new Error(`分数必须大于0小于${max}`));
  } else {
    callback();
  }
};
//正则校验
const studentscores = (scores: number) => {
  return [{ validator: scoresValidator, maxScores: scores, trigger: "blur" }];
};
//提交
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      console.log("submit!");
    } else {
      console.log("error submit!");
      return false;
    }
  });
};
// 取消
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
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

    
    