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
      title="修改"
      width="35%"
    >
      <span class="box">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="list.name" />
        </el-form-item>
        <el-form-item label="部门" prop="depid">
          <el-cascader
            placeholder="请选择部门"
            v-model="list.depid"
            :props="props"
            :options="depList"
            @change="handleChange"
          />
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
  onMounted,
  nextTick,
  watch,
  toRaw,
} from 'vue';
import { ElMessageBox } from 'element-plus';
import { departmentlist, classesadd } from '../../api/admin';
import { ElMessage } from 'element-plus';
import { fa } from 'element-plus/es/locale';
import {defineProps} from "vue"
const dialogVisible = ref(false);

const emits = defineEmits(['getclasseslist']);

const formSize = ref('default');
const ruleFormRef = ref<any>();
const ruleForm: any = reactive({
  depid1: [],
  list: {
    id: 0,
    name: '' ,
    depid: '',
  },
  depList: [],
});

console.log(ruleForm.list.id);
const data: any = reactive({
  list1: {
    id: 0,
    name: '',
    depid: '',
  },
});
defineExpose({
  dialogVisible,
  ruleForm,
});
const props = {
  value: 'id',
  label: 'name',
};


const handleChange = (value: any) => {
  // console.log(value)
  ruleForm.list.depid = value[toRaw(value).length - 1];
};
//请求部门列表接口
const getdepartmentlist = async () => {
  let res: any = await departmentlist(null);
  if (res.errCode === 10000) {
    ruleForm.depList = res.data.list;
  }
};

onMounted(() => {
  //调用部门列表接口
  getdepartmentlist();
});
const rules = reactive<any>({
  name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
  depid: [
    {
      required: true,
      message: '部门不能为空',
      trigger: 'change',
    },
  ],
});

const submitForm = async (formEl: any | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid: any, fields: any) => {
    if (valid) {
      let res: any = await classesadd(ruleForm.list);
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
        ruleForm.depid1 = '';
        // ruleForm.list = data.list1
        emits('getclasseslist');
      } else {
        ElMessage(res.errMsg);
      }
    } else {
      console.log('error submit!', fields);
    }
  });
};

const handleClose = (formEl: any | undefined) => {
  // console.log(dialogVisible.value)
  //   watch(()=>dialogVisible,(newValue, oldValue)=>{
  //   console.log(newValue.value,oldValue,124653)

  // },{immediate:true})

  emits('getclasseslist');
  // console.log(data.list1)
  ruleForm.depid1 = '';
  ruleForm.list.id = 0;
  ruleForm.list.name = '';
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
  // ruleForm.list = data.list1
  ruleForm.depid1 = '';
  ruleForm.list.id = 0;
  ruleForm.list.name = '';
  emits('getclasseslist');
};
const { list, depList, depid1 } = toRefs(ruleForm);
</script>
<style lang="less" scoped>
.box {
  display: block;
  width: 400px;
}
</style>
