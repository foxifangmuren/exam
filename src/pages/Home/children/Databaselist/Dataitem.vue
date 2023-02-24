<template>
  <div>
    <!-- 表头 -->
    <el-page-header @back="goBack">
      <template #content>
        <span class="text-large font-600 mr-3">{{ title }}</span>
      </template>
    </el-page-header>
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
          v-model="from.query.key"
          placeholder="请输入题目名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="题目类型">
        <el-select
          v-model="from.query.state"
          placeholder="全部"
          clearable
          @keyup.enter="onSubmit"
          @change="onSubmit"
        >
          <el-option label="已阅卷" value="已阅卷" />
          <el-option label="未阅卷" value="未阅卷" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
         <el-button type="primary" @click="onSubmit">批量删除</el-button>
          <el-button type="primary" @click="onSubmit">导出excel</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 接受：表格数据（tableData）表格头部（tableHeader） 是否有复选框（isTypeSelection） -->
    <MyTable
      :tableData="from.tableData"
      :tableHeader="tableHeader"
      :isTypeSelection="false"
      @go="go"
    ></MyTable>
    <!--  分页 接受：总条数（total） 页数（page） 条数（psize） 方法（changPageSize）（changPage） -->
    <MyPages
      :total="from.total"
      :page="from.query.page"
      :psize="from.query.psize"
      @changePageSize="changePageSize"
      @changePage="changePage"
    ></MyPages>
    <!-- 侧栏弹框 -->
    <el-drawer
      v-model="from.drawer"
      :title="from.Dtitle"
      :before-close="handleClose"
    >
      <!-- 弹框内容 -->
      <div>
        <!-- 流动布局 -->
        <el-form ref="ruleFormRef" :model="from" status-icon label-width="120px" class="demo-ruleForm">

          <div v-for="(item, index) in Dlist" :key="index">
            <!-- 学生答卷详情 -->
            <!-- 标题 -->
            
              <p class="styles" ><span>{{index+1}}、</span> {{item.type}} <span>分值：{{item.scores}}</span></p>
      
            <!-- 题目 -->
            
              <p class="styles">{{item.title}}</p>
            
            <!-- 回答 -->
            
              <p class="styles" :style="item.answer==null? 'color:red':''"> 回答：{{item.answer==null? '该学员未给出答案':item.answer}}</p>
            
            <!-- 老师阅卷 -->
            <el-form-item class="margin_top" :rules="studentscores(item.scores)" :prop="'list.' + index + '.studentscores'" >
              <!-- 评分 -->
               <el-form-item label="打分" >
                <el-input  v-model="item.studentscores" type="text" autocomplete="off" />
              </el-form-item>
              <!-- 备注 -->
              <el-form-item label="批准">
                <el-input  type="textarea" />
              </el-form-item>
            </el-form-item>

          </div>

          <!-- 按钮区域 -->
          <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)" >阅卷完毕</el-button >
            <el-button @click="resetForm(ruleFormRef)">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
/***
 * 分页格式---TODO （css样式，适应每一个页面）
 */
import { ref, reactive, toRefs } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";
import { studentlist, studentinfo } from "@/api/exam";
import { ElMessageBox,ElMessage,FormInstance } from "element-plus";
//地址栏数据
const route = useRoute();
const title = ref(route.query.title);
const testid = ref(route.query.id);
//表格数据
const from = reactive({
  query: {
    testid: 0,
    page: 1,
    psize: 10,
    state: "", //状态
    key: "",
    dep: "",
  },
  Dtitle: "",
  tableData: [],
  Dlist:[],
  drawer: false,
  //总条数
  total: "",
});
const getlist = async (id: any) => {
  from.query.testid = id;
  const src = await studentlist(from.query);
  console.log(src);
  from.tableData = src.data.list;
  from.total = src.data.counts;
};
getlist(testid);
//表格头部
const tableHeader = [
  {
    prop: "name",
    label: "题目名称",
    
  },
  {
    prop: "classname",
    label: "题量类型",
  },
  {
    prop: "scores",
    label: "创建时间",
  },
  {
    prop: "readtime",
    label: "创建人",
  },
  {
    label: "操作",
    type: "buttons",
    buttons: [
      {
        text: "exam",
        type: "primary",
        event: "go",
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
  if(val.state=="已阅卷"){
    ElMessageBox.confirm(`本卷已阅完，是否更改结果?`)
      .then(() => {
        ElMessage({ message: "没有权限", type: "error", });
      })
      .catch(() => { });
  }else{
     from.drawer = true;
    //注意传值，第一个参数是试卷，第二个是学生
    getstdent(route.query.id, val.id);
    from.Dtitle = val.name + "的试卷";
  }
};
const getstdent = async (testid: number | any, studentid: number) => {
  const src = await studentinfo({ testid: testid, studentid: studentid });
  console.log(src);
  from.Dlist=src.data.list

};
const handleClose = (done: () => void) => done();
//侧边栏内容
  const ruleFormRef = ref<FormInstance>()
  //域解析
  const {Dlist}=toRefs(from);
  const scoresValidator = (rule: any, value: any, callback: any) => {
    let max=parseInt(rule.maxScores);
    let _value=parseInt(value);
    if( isNaN(_value)){
        callback(new Error(`请输入分数`))
    }
    else if(_value<0 || _value>max){
        callback(new Error(`分数必须大于0小于${max}`))
    }
    else{
        callback();
    }
}
//正则校验
  const studentscores=(scores:number)=>{
    return [{ validator:scoresValidator,maxScores:scores, trigger: 'blur' },];
  }
  //提交
  const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
      if (valid) {
        console.log('submit!')
      } else {
        console.log('error submit!')
        return false
      }
    })
  }
  // 取消
  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
  }
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
.styles{
  height: 40px;
  line-height: 80px;
}
.margin_top{
  margin-top: 30px;
  background-color: rgb(255, 202, 202);
}

</style>

    
    