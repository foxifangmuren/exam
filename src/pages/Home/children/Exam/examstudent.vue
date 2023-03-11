<template>
  <div>
    <!-- 表头 -->
    <el-page-header @back="goBack">
      <template #content>
        <span class="text-large font-600 mr-3">{{ title }}</span>
      </template>
    </el-page-header>
    <!-- 头部 -->
    <el-form :inline="true" :model="from.query" class="demo-form-inline title_box_input" >
      <el-form-item label="考生姓名">
        <el-input v-model="from.query.key" placeholder="请输入学生姓名" clearable />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="from.query.state" placeholder="全部" clearable @keyup.enter="onSubmit" @change="onSubmit" >
          <el-option label="已阅卷" value="已阅卷" />
          <el-option label="未阅卷" value="未阅卷" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门">
         <el-cascader v-model="from.dep" @change="depinfo(from.dep)"  :options="from.deplist"  :props="props1" clearable />
      </el-form-item>
      <el-form-item label="班级">
        <el-select v-model="from.query.classid" placeholder="请选择" :disabled="classname" clearable >
          <el-option  v-for="(item,index) in from.classList" :label="item.name" :value="item.id" :key="index"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
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
    <el-drawer v-model="from.drawer" :title="from.Dtitle" :before-close="handleClose" size="50%">
      <!-- 弹框内容 -->
      <div>
        <!-- 流动布局 -->
        <el-form ref="ruleFormRef" :model="from" status-icon  class="demo_ruleForm">
          <!-- 有数据时 -->
          <!-- {{Dlist}} -->
          <div  v-for="(item, index) in Dlist" :key="index">
            <!-- 学生答卷详情 -->
            <!-- 标题 -->
            <p class="styles" ><span>{{index+1}}</span> {{item.type}} <span>分值：{{item.scores}}</span></p>
            <!-- 题目 -->
            <p class="styles">
                <span v-html="replace(item.title,'[]','————,')"></span>
            </p>
            <!-- 回答 -->
            <p class="styles" :style="item.studentanswer==''? 'color:red':''"> 
              回答：{{item.studentanswer==''? '该学员未给出答案':item.studentanswer}}
            </p>
            <!-- 老师阅卷 -->
            <el-form-item  class="margin_top"   >
              <!-- 评分 -->
                <el-form-item class="item" label="打分" :rules="studentscores(item.scores)" :prop="'Dlist.' + index + '.studentscores'"   required>
                    <el-input  style="margin-bottom:20px; width:200px" v-model="item.studentscores" type="text" autocomplete="off"   />
                </el-form-item>

              <!-- 备注 -->
              <el-form-item class="item"  style="margin-left:0px" label="批注">
                <el-input  type="textarea" v-model="item.comments"/>
              </el-form-item>
            </el-form-item>
          </div>
          <!-- 数据为空时 -->
          <div v-if="Dlist.length==0">
              <el-empty description="抱歉数据丢失了" />
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
 * 部门接口的调取
 * 阅卷的正则
 */
import { ref, reactive, toRefs, toRaw } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";
import { studentlist, studentinfo ,stydenupdata} from "@/api/exam";
import {departmentlist,classeslist} from "@/api/admin";
import { ElMessageBox,ElMessage,} from "element-plus";
import { FormInstance } from "element-plus/es/components/form";
//地址栏数据
const route = useRoute();
const title = ref(route.query.title);
const testid = ref(route.query.id);
//表格数据
const from = reactive({
  dep:[],
  classList:[{name:"",id:0,type:"",title:""}],
  query: {
    testid: 0,
    page: 1,
    psize: 10,
    state: "", //状态
    key: "",
    classid:"",
  },
  //侧边栏标题
  Dtitle: "",
  //表格数据
  tableData: [],
  //题库数据
  Dlist:[{answer:"",scores:0,comments:"",type:"",title:"",studentscores:"",studentanswer:''}],
  // 侧边是否显示
  drawer: false,
  //总条数
  total: 0,
  //部门列表
  deplist:[],
});
//请求列表
const getlist = async (id: any) => {
  from.query.testid = id;
  const src = await studentlist(from.query);
  from.tableData = src.data.list;
  from.total = src.data.counts;
};

getlist(testid);
//请求部门列表
const getdeplist= async ()=>{
  const src=await departmentlist({})
  console.log(src);
  from.deplist=src.data.list
}
getdeplist()
const classname=ref(true)
const depid=ref(0)
const props1 = {
  value: 'id',
  label: 'name',
  children:"children"
};
const depinfo=async (val:any)=>{
  classname.value=!classname
  if(val===null){
    return false
  }else{
    let res = val.length-1
    depid.value=val[res]
    const src=await classeslist({depid:depid.value})
    console.log(src);
    from.classList=src.data.list
  }
};
//表格头部
const tableHeader = [
  {
    prop: "name",
    label: "姓名",
  },
  {
    prop: "classname",
    label: "班级名称",
  },
  {
    prop: "scores",
    label: "分数",
  },
  {
    prop: "readtime",
    label: "考试时间",
  },
  {
    prop: "state",
    label: "状态",
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
const goBack = () =>router.go(-1);
//查询
const onSubmit = () => {
  console.log(from.query);
  getlist(testid)
};
//侧边弹框
const go = (val: any) => {
  console.log(val);
  if(val.state=="已阅卷"){
    ElMessageBox.confirm(`本卷已阅完，是否更改结果?`)
      .then(() => {
        from.drawer = true;
        //注意传值，第一个参数是试卷，第二个是学生
        getstdent(route.query.id, val.id);                                                                          
        from.Dtitle = val.name + "的试卷";
      })
      .catch(() => { });
  }else{
    from.drawer = true;
    //注意传值，第一个参数是试卷，第二个是学生
    getstdent(route.query.id, val.id);
    from.Dtitle = val.name + "的试卷";
  }
};
//获取学生答卷详情
const getstdent = async (testid: number | any, studentid: number) => {
  const src = await studentinfo({ testid: testid, studentid: studentid });
  console.log(src);
  from.Dlist=src.data.list
};
//侧边栏叉号
const handleClose = (done: () => void) => done();
//侧边栏内容
const ruleFormRef = ref<any>()
  //域解析
  const {Dlist}=toRefs(from);
  console.log(Dlist)
  const scoresValidator = (rule: any, value: any, callback: any) => {
  console.log(rule, value, callback)

      let max=parseInt(rule.maxScores);
      let _value=parseInt(value);
      if( isNaN(_value)){
          callback(alert(`请输入分数`))
      }
      else if(_value<0 || _value>max){
          callback(alert ( `分数必须大于0小于${max}`) )  
      }
      else{
          callback();
      }
  }
  const studentscores=(scores:number)=>{
    return [{ validator:scoresValidator,maxScores:scores, trigger: 'blur' },];
  }

//正则校验

  //提交
const submitForm =(formEl: FormInstance | undefined) => {
 if (!formEl) return
    formEl.validate(async (valid) => {
      if (valid) {
          
                  let _list=toRaw(from.Dlist)
                  let _menus:Array<any>=[]
                  _list.forEach((element:any)=> _menus.push({scores:element.studentscores,answerid:element.answerid,comments:element.comments}) )
                  const src:any=await stydenupdata(_menus)
                  if(src.errCode=="10000"){
                    //关闭弹框
                    from.drawer=false
                    //提示信息
                    ElMessage({ message: '完成阅卷', type: "success", })
                    getlist(testid)
                  } 
      } else {
        console.log('error submit!')
        return false
      }
    })
}
  // 取消
 const resetForm = (formEl: FormInstance | undefined) => {
    //关闭弹框
    from.drawer=false
    if (!formEl) return
    formEl.resetFields()
  }
//替换[]
const replace=(Str:any, character:any, turnInto:any)=> {
    while (Str.indexOf(character) !== -1) {//利用indexOf函数查询特定字符串下标
        Str = Str.replace(character, turnInto);// 替换
    }
    console.log("替换后的字符串为:" + Str);
    return Str;
}
const rep = (str: string) => {
 return str.replace(/\|/g, `,`);
};
</script>

<style scoped>
.item{
  width: 500px;
}
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
    margin-top: 40px;
    margin-right: 30px;
}
.margin_top{
  margin-top: 30px;
  /* background-color: rgba(255, 202, 202, 0.596); */
  padding: 30px 20px;
}


</style>

    