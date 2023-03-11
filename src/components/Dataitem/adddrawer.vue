<template>
  <div>
    <el-drawer  v-model="drawer" :title="title" direction="rtl" size="45%" @close="clear">
      <!-- 内容区域 -->
      <div>
        <!-- 题干 -->
        <el-form ref="ruleFormRef" :model="ruleForm" label-width="120px" class="demo-ruleForm" status-icon >
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
                :defaultConfig-="toolbarConfig"
              />
              <Editor
                style="overflow-y: hidden"
                v-model="html" 
                :defaultConfig="editorConfig"
                @onCreated="handleCreated"
              />
            </div>
          </el-form-item>
          <!-- 选择 -->
          <div>
            <!-- 选择题  -->
            <div v-if="ruleForm.type == '单选题' || ruleForm.type == '多选题'">
              <!-- 选择项 -->
              <el-form-item label="选项">
                <!-- 选项  -->
                <el-form-item v-for="(domain, index) in ruleForm.answers" :key="index" :label="data.letter[index]" >
                  <!-- 输入框的值 -->
                  <el-input v-model="domain.content"  />
                  <!-- 删除图标 -->
                  <el-icon style="font-size: 22px; color: #f56c6c" ><CircleClose @click.prevent="removeDomain(index)" /></el-icon>
                </el-form-item>
                <!--按钮区域-->
                <el-form-item>
                  <el-icon style="margin-left: 50px; font-size: 22px; color: #48a2ff" ><CirclePlus @click="addDomain" /></el-icon>
                </el-form-item>
              </el-form-item>
              <!-- 答案（单选） -->
              <el-form-item label="答案" v-if="ruleForm.type == '单选题'">
                <el-radio-group v-model="ruleForm.answer">
                  <el-radio :label="data.letter[index]"  v-for="(item, index) in ruleForm.answers" :key="index">
                    {{ data.letter[index] }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <!-- 答案（多选） -->
              <el-form-item label="答案" v-if="ruleForm.type == '多选题'">
                <el-checkbox-group v-model="check" @change="changeCheckbox">
                  <el-checkbox :label="data.letter[index]" v-for="(item, index) in ruleForm.answers" :key="index" />
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
            <div v-if="ruleForm.type == '填空题' ? true : ruleForm.type == '问答题' ? true : false ">
              <el-form-item  label="正确答案" v-show="answerdata.length>0"  v-if="ruleForm.type == '填空题' ">
                <div v-for="(item,index) in answerdata" :key="index">
                    <el-input v-model="item.contetn" class='ti' @change="gogogo(item)" />
                </div>
              </el-form-item>
              <el-form-item label="解析">
                <el-input rows="5" style="width: 300px" v-model="ruleForm.explains" type="textarea" />
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
import { ElMessage } from "element-plus";
import { onBeforeUnmount, onUpdated, reactive, ref, shallowRef, watch ,nextTick} from "vue";
import { addDataitem } from "@/api/databaselist";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { el } from "element-plus/es/locale";

//上传图片区域
const toolbarConfig={
  toolbarKeys:[
    "bold",
    "italic",
    "underline",
    "color",
    "bgColor",
    "bulletedList",
    "numberedList",
    "justifyLeft",
    "justifyCenter",
    "justifyRight",
    "insertTable",
   {
    key:"group-image",
    title:"图片",// 必填
    menuKeys: ["uploadImage","insertImage"]
   } 
  ]
}
const editorConfig:any = { MENU_CONF: {} }
editorConfig.MENU_CONF['uploadImage'] = {
      server: 'http://www.eshareedu.cn/exam/api/upload/editeradd', // 上传图片地址
      timeout: 5 * 1000,
      fieldName: 'files',
      metaWithUrl: true, // 参数拼接到 url 上
      headers: { Authorization:sessionStorage.getItem('token') },
      maxFileSize: 10 * 1024 * 1024, // 10M
      base64LimitSize: 5 * 1024, // 5kb 以下插入 base64
      onBeforeUpload(files: any) {
        // console.log('onBeforeUpload', files)
        return files // 返回哪些文件可以上传
      },
      onProgress(progress: any) {
        // console.log('onProgress', progress)
      },
      onSuccess(file: any, res: any) {
        // console.log('onSuccess', file, res)
      },
      onFailed(file: any, res: { message: any; }) {
        alert(res.message)
        // console.log('onFailed', file, res)/
      },
      onError(file: any, err: { message: any; }, res: any) {
        alert(err.message)
        console.error('onError', file, err, res)
      },
       // 用户自定义插入图片
      customInsert(res:any, insertFn:any) {
        const imgInfo = res.data[0].url.slice(1)
        insertFn("http://www.eshareedu.cn/exam/upload/"+imgInfo)
      },
}
//选择题部分（删除）
const removeDomain = (index: any) => {
  ruleForm.answers.splice(index, 1);
};
const addDomain = () => {
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
let check = ref([]);
const changeCheckbox = (e: any) => { ruleForm.answer = e.join("|"); };

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
  html.value=props.questionsdata.title
  for (let item in ruleForm) {
    ruleForm[item] = props.questionsdata[item];
  }
});
//富文本
const title = ref("添加试题");
const emit = defineEmits(["getlist"]);
const editorRef = shallowRef();
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
    editor.destroy();
});

const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
//表单数据
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
  ruleForm.answer=abc.value.push(val.contetn).join('|')
}
//添加方法
const add=async ()=>{
    if(ruleForm.answer==""){
        ElMessage({
          message: '请填写答案',
          type: 'warning',
        })
    }else{
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
    }
   
}
//添加按钮
const submitForm = async () => {
  add()
  //刷新列表
  emit("getlist");
};
//保存并取消
const save = async () => {
  //拿去id
  add()
  //关闭弹框
  drawer.value = true;
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
  drawer.value = false;
  clear();
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