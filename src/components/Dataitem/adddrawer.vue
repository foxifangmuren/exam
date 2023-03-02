<template>
<div>
    <el-drawer
    v-model="drawer"
    title="试题添加"
    direction="rtl"
    size="45%"
  >
  <!-- 内容区域 -->
  <div>
      <!-- 题干 -->
          <el-form ref="ruleFormRef"
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
              <div  class="box">
                <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" />
                <Editor style="overflow-y: hidden;" v-model="ruleForm.title" @onCreated="handleCreated" />
              </div>
          </el-form-item>
      <!-- 选择 -->
      <div>
        <!-- 选择题单选  -->
        <div v-if="ruleForm.type=='单选题'">
            <!-- 选择项 -->
            <el-form-item label="单选">
              <el-input v-model="ruleForm.desc" type="textarea" />
              
            </el-form-item>
            <!-- 答案 -->
            <el-form-item label="答案">
              <el-radio-group v-model="ruleForm.answer">
                <el-radio label="A">A</el-radio>
                <el-radio label="B">B</el-radio>
                <el-radio label="C">C</el-radio>
                <el-radio label="D">D</el-radio>
              </el-radio-group>
            </el-form-item>
        </div>
        <!-- 多选题  -->
        <div v-if="ruleForm.type=='多选题'">
           <el-form-item label="Activity form">
              <el-input v-model="ruleForm.desc" type="textarea" />
            </el-form-item>
        </div>
        <!-- 判断题  -->
        <div v-if="ruleForm.type=='判断题'">
            <el-form-item label="判断题">
               <el-button-group>
                  <el-button  type="primary" plain @click="ruleForm.answer ='正确'">正确</el-button>
                  <el-button  type="primary" plain @click ="ruleForm.answer ='错误'"> 错误 </el-button>
                </el-button-group>
            </el-form-item>
        </div>
        <!-- 填空问答 -->
        <div v-if='ruleForm.type=="填空题"?true:(ruleForm.type=="问答题"?true:false)'>
            <el-form-item label="解析">
              <el-input rows="5" style="width:300px" v-model="ruleForm.desc" type="textarea" />
            </el-form-item>
        </div>
      </div>
      <!-- 分值 -->
      <el-form-item label="分值：">
          <el-input-number v-model="ruleForm.scores" class="mx-4" min="0"  controls-position="right" @change="handleChange" />
      </el-form-item>
      <!-- 按钮区域 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm()">保存</el-button>
        <el-button @click="resetForm(ruleFormRef)">保存并取消</el-button>
        <el-button @click="resetForm(ruleFormRef)">取消</el-button>
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
import { onBeforeUnmount,reactive, ref, shallowRef } from 'vue'
import {addDataitem} from "@/api/databaselist"
import { useRoute } from "vue-router";

//地址栏数据
const route = useRoute();
const title: any = ref(route.query.title);
const testid:any = ref(route.query.id);

const drawer = ref(false)
defineExpose({
  drawer
})
//刷新列表
const emit=defineEmits(['getlist'])
//分值
const num = ref(1)
const handleChange = (value: number) => {
  console.log(value)
}

//富文本编辑器
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { log } from 'console'
    const editorRef = shallowRef()
    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
        const editor = editorRef.value
        if (editor == null) return
        editor.destroy()
    })
 
    const handleCreated = (editor:any) => {
      console.log("记录 editor 实例，重要！",editor);
      editorRef.value = editor // 记录 editor 实例，重要！
    }
//表单数据对象
const ruleFormRef = ref<any>({
 
})
//数据存放
const ruleForm = reactive({
    databaseid:0,
    title: "",
    type: "单选题",
    answer: "",
    tags: "",
    explains: "",
    answers: []
})
// 正则校验
const rules = reactive<any>({
  desc: [
    { required: true, message: 'Please input activity form', trigger: 'blur' },
  ],
})
//成功时候的按钮
const submitForm = async () => {
  console.log(testid.value);
  ruleForm.databaseid=testid.value
    console.log(ruleForm,"1212");
    const src=await addDataitem(ruleForm)
    console.log(src);
    drawer.value=false
    emit('getlist')
}
//失败时候的按钮
const resetForm = (formEl: any| undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>
<style scoped>
/* 富文本编辑器 */
  .box{
    width: 700px;
    height: 442px;
    border:1px solid;
    margin: 0 auto;
  }
  :deep(.w-e-text-container){
    height: 320px;
  }
  :deep(.w-e-scroll){
    height: 300px;
  }
</style>