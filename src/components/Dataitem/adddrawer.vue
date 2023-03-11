<template>
  <div>
    <el-drawer
      v-model="drawer"
      :title="title"
      direction="rtl"
      size="45%"
      @close="clear"
    >
      <!-- 内容区域 -->
      <div>
        <!-- 题干 -->
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
          status-icon
        >
          <!-- 题型选择 -->
          <div>
            <el-radio-group v-model="ruleForm.type">
              <el-radio label="单选题">单选题</el-radio>
              <el-radio label="多选题">多选题</el-radio>
              <el-radio label="判断题">判断题</el-radio>
              <el-radio label="填空题">填空题</el-radio>
              <el-radio label="问答题">问答题</el-radio>
            </el-radio-group>
          </div>
          <!-- 富文本 -->
          <el-form-item label=" 题干：">
            <div class="box">
              <Toolbar
                style="border-bottom: 1px solid #ccc"
                :editor="editorRef"
              />
              <Editor
                style="overflow-y: hidden"
                v-model="html"
                @onCreated="handleCreated"
              />
            </div>
          </el-form-item>
          <!-- 选择 -->
          <div>
            <!-- 选择题单选  -->
            <div v-if="ruleForm.type == '单选题'">
              <!-- 选择项 -->
              <el-form-item label="选项">
                <!-- 选项  -->
                <el-form-item
                  v-for="(domain, index) in ruleForm.answers"
                  :key="index"
                  :label="data.letter[index]"
                >
                  <!-- 输入框的值 -->
                  <el-input v-model="domain.content"  />
                  <!-- 删除图标 -->
                  <el-icon style="font-size: 22px; color: #f56c6c"
                    ><CircleClose @click.prevent="removeDomain(index)"
                  /></el-icon>
                </el-form-item>
                <!--按钮区域-->
                <el-form-item>
                  <el-icon
                    style="margin-left: 50px; font-size: 22px; color: #48a2ff"
                    ><CirclePlus @click="addDomain"
                  /></el-icon>
                </el-form-item>
              </el-form-item>
              <!-- 答案 -->
              <el-form-item label="答案">
                <el-radio-group v-model="ruleForm.answer">
                  <el-radio
                    :label="data.letter[index]"
                    v-for="(item, index) in ruleForm.answers"
                    :key="index"
                  >
                    {{ data.letter[index] }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <!-- 多选题  -->
            <div v-if="ruleForm.type == '多选题'">
              <!-- 选择项 -->
              <el-form-item label="选项">
                <!-- 选项  -->
                <el-form-item
                  v-for="(domain, index) in ruleForm.answers"
                  :key="index"
                  :label="data.letter[index]"
                >
                  <!-- 输入框的值 -->
                  <el-input v-model="domain.content"   />
                  <!-- 删除图标 -->
                  <el-icon style="font-size: 22px; color: #f56c6c"
                    ><CircleClose @click.prevent="removeDomain(index)"
                  /></el-icon>
                </el-form-item>
                <!--按钮区域-->
                <el-form-item>
                  <el-icon
                    style="margin-left: 50px; font-size: 22px; color: #48a2ff"
                    ><CirclePlus @click="addDomain"
                  /></el-icon>
                </el-form-item>
              </el-form-item>
              <!-- 答案 -->
              <el-form-item label="答案">
                <el-checkbox-group v-model="check" @change="changeCheckbox">
                  <el-checkbox
                    :label="data.letter[index]"
                    v-for="(item, index) in ruleForm.answers"
                    :key="index"
                  />
                </el-checkbox-group>
              </el-form-item>
            </div>
            <!-- 判断题  -->
            <div v-if="ruleForm.type == '判断题'">
              <el-form-item label="判断题">
                <el-radio-group v-model="ruleForm.answer" size="large">
                  <el-radio-button label="正确" />
                  <el-radio-button label="错误" />
                </el-radio-group>
              </el-form-item>
            </div>
            <!-- 填空问答 -->
            <div
              v-if="
                ruleForm.type == '填空题'
                  ? true
                  : ruleForm.type == '问答题'
                  ? true
                  : false
              "
            >
              <el-form-item  label="正确答案" v-show="answerdata.length>0"  v-if="ruleForm.type == '填空题' ">
                <div v-for="(item,index) in answerdata" :key="index">
                    <el-input v-model="item.contetn" class='ti' @change="gogogo(item)" />
                </div>
              </el-form-item>

              <el-form-item label="解析">
                <el-input
                  rows="5"
                  style="width: 300px"
                  v-model="ruleForm.explains"
                  type="textarea"
                />
              </el-form-item>
            </div>
          </div>
          <!-- 分值 -->
          <el-form-item label="分值：">
            <el-input-number
              v-model="ruleForm.scores"
              class="mx-4"
              :min="0"
              controls-position="right"
            />
          </el-form-item>
          <!-- 按钮区域 -->
          <el-form-item>
            <el-button type="primary" @click="submitForm()">保存</el-button>
            <el-button @click="save">保存并取消</el-button>
            <el-button @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>
<script lang='ts' setup>
/**
 * 添加和修改同时使用的该面
 * 功能
 *    Tab切换
 *    标题判断
 *    试题添加
 *    刷新列表
 *    传值父级
 */
import { ElMessage } from "element-plus";
import { onBeforeUnmount, onUpdated, reactive, ref, shallowRef, watch ,nextTick} from "vue";
import { addDataitem } from "@/api/databaselist";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

import "@wangeditor/editor/dist/css/style.css"; // 引入 css
// import { nextTick } from "process";

//选择题部分
const removeDomain = (index: any) => {
  ruleForm.answers.splice(index, 1);
};
const addDomain = () => {
  console.log(ruleForm.answers);
  if (ruleForm.answers.length == 26) {
    ElMessage({
      message: "只能添加这些选项",
      type: "warning",
    });
    return;
  }
  ruleForm.answers.push({
    id: 0,
    answerno: data.letter[ruleForm.answers.length],
    questionid: 0,
    content: "",
  });
};
let check = ref([]); //复选框正确答案的值
// 多选框内容改变
const changeCheckbox = (e: any) => {
  console.log(e);
  ruleForm.answer = e.join("|");
};
//暴露属性显示隐藏
const drawer = ref(false);
defineExpose({ drawer });
//修改接受传递过来的参数
const props: any = defineProps({
  questionsdata: {
    type: Object,
    defind: null,
  },
  id: {
    type: String,
    defind: null,
  },
});
watch(props, (nweProps, oldProps) => {
  console.log(props.questionsdata);
  for (let item in ruleForm) {
    ruleForm[item] = props.questionsdata[item];
  }
});
//标题更改
const title = ref("添加试题");
//刷新列表
const emit = defineEmits(["getlist"]);
//富文本编辑器
const editorRef = shallowRef();
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor: any) => {
  // console.log("记录 editor 实例，重要！",editor);
  editorRef.value = editor; // 记录 editor 实例，重要！
};
//表单数据对象
const ruleFormRef = ref<any>({});
//数据存放
const ruleForm: any = reactive({
  id: 0,
  databaseid: 0,
  scores: "",
  title: "",
  type: "单选题",
  answer: "",
  tags: "",
  explains: "",
  answers: [
    {
      id: 0,
      answerno: "A",
      questionid: 0,
      content: "",
    },
    {
      id: 0,
      answerno: "B",
      questionid: 0,
      content: "",
    },
    {
      id: 0,
      answerno: "C",
      questionid: 0,
      content: "",
    },
    {
      id: 0,
      answerno: "D",
      questionid: 0,
      content: "",
    },
  ],
});
//填空题处理区域
const html:any=ref('')
const answerdata:any=ref<any>([])
const abc:any=ref<any>([])

watch(html,(newValue)=>{
     answerdata.value=[]
     let res=newValue.match(/\[\]/g);
      if(res){
        let len=res?.length
        for(let index=0; index < len; index++ ){
            answerdata.value.push({contetn:""})            
        }
      }
})
const gogogo=(val:any)=>{
  abc.value.push(val.contetn)
  ruleForm.answer=abc.value.join('|')
  // console.log( ruleForm.answer);
}
// 正则校验
const rules = reactive<any>({
  desc: [
    { required: true, message: "Please input activity form", trigger: "blur" },
  ],
});
//成功时候的按钮
const submitForm = async () => {
  //拿去id
  ruleForm.databaseid = props.id;
  ruleForm.title=html
  if (ruleForm.type == "问答题") {
    ruleForm.answer = "：略";
  }
  //发送请求
  const src = await addDataitem(ruleForm).then((src: any) => {
    ElMessage({
      message: "添加成功",
      type: "success",
    });
  });
  //关闭弹框
  drawer.value = false;
  //刷新列表
  emit("getlist");
};
//保存并取消
const save = async () => {
  //拿去id
  ruleForm.databaseid = props.id;
   ruleForm.title=html
  if (ruleForm.type == "问答题") {
    ruleForm.answer = "：略";
  }
  //发送请求
  const src = await addDataitem(ruleForm).then((src: any) => {
    ElMessage({
      message: "添加成功",
      type: "success",
    });
  });
  //刷新列表
  emit("getlist");
  //刷新列表
  clear();
};
//取消
const cancel = () => {
  //关闭弹框
  drawer.value = false;
  //清空列表
  clear();
};
//失败时候的按钮
const resetForm = (formEl: any | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
//关闭回调
const clear = () => {
  for (let item in ruleForm) {
    if (item == "type") {
      ruleForm[item] = "单选题";
    } else if (item == "answers") {
      ruleForm[item] = [
        {
          id: 0,
          answerno: "A",
          questionid: 0,
          content: "",
        },
        {
          id: 0,
          answerno: "B",
          questionid: 0,
          content: "",
        },
        {
          id: 0,
          answerno: "C",
          questionid: 0,
          content: "",
        },
        {
          id: 0,
          answerno: "D",
          questionid: 0,
          content: "",
        },
      ];
    } else {
      ruleForm[item] = "";
    }
  }
};
const data = reactive({
  letter: [
    //选项的名
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "G",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ],
  leng: [],
});
</script>
<style scoped>
/* 富文本编辑器 */
.box {
  width: 700px;
  height: 442px;
  border: 1px solid;
  margin: 0 auto;
}
:deep(.w-e-text-container) {
  height: 320px;
}
:deep(.w-e-scroll) {
  height: 300px;
}
:deep(.el-form-item__label) {
  margin-left: -50px;
}
:deep(.el-input__wrapper) {
  width: 800px;
  margin-bottom: 20px;
  margin-right: 10px;
}
:deep(.el-input) {
  width: 60%;
}
:deep(.el-form-item__content) {
  display: flex;
  flex-wrap: wrap;
}
:deep(.el-input-number.is-controls-right .el-input-number__increase) {
  bottom: auto;
  left: 79px;
}
:deep(.el-input-number.is-controls-right .el-input-number__decrease) {
  right: 38px;
  top: 17px;
}
</style>