<template>
  <el-form
    ref="ruleFormRef"
    :model="list"
    :rules="rules"
    label-width="120px"
    class="demo-ruleForm"
    :size="formSize"
    status-icon
  >
    <el-dialog
      v-model="dialogVisible"
      title="重置密码"
      width="35%"
    >
      <span class="box">
        <el-form-item label="姓名" prop="">
          {{data.name}}
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input v-model="list.pass"  type="password"  show-password/>
        </el-form-item>
        <el-form-item label="确认密码" prop="pass1">
          <el-input v-model="list.pass1"  type="password"  show-password/>
        </el-form-item>
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="qu(ruleFormRef)">取消</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </el-form>
</template>
<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus';
import {
  ref,
  defineExpose,
  reactive,
  toRefs,
  watch,
} from 'vue';
import { ElMessage } from 'element-plus';
import {changepass} from '../../api/admin'
const dialogVisible = ref(false);
const data = ref();
const emits = defineEmits(['studentList']);
const formSize = ref('default');
const ruleFormRef = ref<any>();
const ruleForm: any = reactive({
  list: {
    pass:'',
    pass1:''
  },
});
defineExpose({
  dialogVisible,
  data
});
console.log(data)
let repeatValidate = (rule:any, value:any, callback:any) => {
      if (value !== ruleForm.list.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

const rules = reactive<any>({
  
  pass: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 6, max: 12, message: '请输入6~12位密码', trigger: 'blur' },
  ],
  pass1:[
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { validator: repeatValidate, trigger: 'blur' }

  ]

});

const submitForm = async (formEl: any | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid: any, fields: any) => {
    if (valid) {
      console.log({oldpass:data.value.pass,pass:ruleForm.list.pass})
      let params = {
        
        "id": data.value.id,
        "username": data.value.username,
        "pass": ruleForm.list.pass,
        "name": data.value.name,
        "tel": data.value.photo,
        "depid": data.value.depid,
        "roleid": data.value.classid
      }
     let res:any = await changepass(params)
     console.log(res)
      if (res.errCode===10000) {
        ElMessage({
          message: '重置成功成功',
          type: 'success',
        });
        watch(
          () => dialogVisible,
          (newValue, oldValue) => {
            console.log(newValue.value, oldValue, 124653);
            if (formEl != undefined) {
              formEl.resetFields();
            }
          },
          { immediate: true }
        );
        dialogVisible.value = false;
        ruleForm.list.pass=''
        ruleForm.list.pass1=''
        emits('studentList');
      } 
    } 
  });
};

const qu = (formEl: any | undefined) => {
  watch(
    () => dialogVisible,
    (newValue, oldValue) => {
      console.log(newValue.value, oldValue, 124653);
      if (formEl != undefined) {
        formEl.resetFields();
      }
    },
    { immediate: true }
  );
  dialogVisible.value = false;
  ruleForm.list.pass=''
  ruleForm.list.pass1=''
  emits('studentList');
};
const { list} = toRefs(ruleForm);
</script>
<style lang="less" scoped>
.box {
  display: block;
  width: 400px;
}
</style>
