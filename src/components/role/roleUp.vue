<template>
  <div>
    <el-form ref="ruleFormRef" :model="form">
      <el-dialog
        v-model="dialogVisible"
        title="修改"
        width="30%"
        
      >
        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input v-model="form.name"  />
        </el-form-item>
        
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
  </div>
</template>

<script setup lang="ts">
import { reactive, ref,watch } from "vue";
import {roleadd} from '../../api/admin'
import {ElMessage} from 'element-plus'
const dialogVisible = ref(false)
const formLabelWidth = '140px';
const ruleFormRef = ref<any>();
  const emits = defineEmits(['roleList']);
const form = reactive({
  name:''
})
defineExpose({
  dialogVisible,
  form
})
const submitForm = async (formEl: any | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid: any, fields: any) => {
    if (valid) {
      let res: any = await roleadd(form.name);
      // console.log(ruleForm.list)
      console.log(res);
      if (res.errCode === 10000) {
        ElMessage({
          message: '修改成功',
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
       
        emits('roleList');
      } else {
        ElMessage(res.errMsg);
      }
    } else {
      console.log('error submit!', fields);
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
  
  form.name = '';
  emits('roleList');
};
</script>

<style scoped></style>
