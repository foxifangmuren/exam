<template>
  <div class="box">
    <el-form
      ref="ruleFormRef"
      :model="data"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <el-form-item label="旧密码" prop="oldpass">
        <el-input v-model="data.oldpass" />
      </el-form-item>
      <el-form-item label="新密码" prop="pass">
        <el-input type="password" v-model="data.pass" />
      </el-form-item>
      <el-form-item label="确定新密码" prop="pass1">
        <el-input type="password" v-model="data.pass1" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          修改密码
        </el-button>
        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref ,toRefs} from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import {StudentChangepass} from '../../../../api/stutest'
import { useRouter } from 'vue-router'
const router = useRouter()
const formSize = ref('default')
const ruleFormRef = ref<any>()
const state:any = reactive({
  data:{
    "oldpass": "",
    "pass": "",
    'pass1':''
  }
})
var repasswordValidator = (rule:any, value:any, callback:any) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== state.data.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
const rules = reactive<any>({
  oldpass: [
    { required: true, message: '原密码必填', trigger: 'blur' },
  ],
  pass: [
    { required: true, message: '新密码必填', trigger: 'blur' },
  ],
  pass1: [
    { required: true, message: '确认密码必填', trigger: 'blur' },
    { validator: repasswordValidator,trigger: 'blur' },
  ]
})

const submitForm = async (formEl: any | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid:any, fields:any) => {
    if (valid) {
      // console.log('submit!')
      // console.log('chengg ')
      let res:any = await StudentChangepass({oldpass:state.data.oldpass,pass:state.data.pass})

      console.log(res)
      if(res.errCode===10000){
        ElMessage({
          message: '修改成功，请重新登录',
          type: 'success',
        })
        router.push('/')
        sessionStorage.clear()
      }else{
        ElMessage.error(res.errMsg)
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

const {data} = toRefs(state)
const resetForm = (formEl: any | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>
<style lang="less" scoped>
  .box{
    width: 400px;
    margin-top: 100px;
    margin-left: 200px;
  }
</style>
