<template>
  <div>
    <el-form ref="ruleFormRef" :model="form.list">
      <el-dialog v-model="dialogVisible" title="修改">
      <el-form :model="form">
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="form.list.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.list.photo" autocomplete="off" />
        </el-form-item>
        <el-form-item label="部门" :label-width="formLabelWidth">
          <el-cascader
            v-model="form.list.depid"
            :options="form.options"
            :props="porps"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="班级" :label-width="formLabelWidth">
          <el-cascader
            v-model="form.list.classid"
            :options="form.Class"
            :props="porps"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="form.list.remarks" type="textarea" />
        </el-form-item>
      </el-form>
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
import { onMounted, reactive, ref, toRefs,watch } from 'vue';
import {departmentlist,classeslist,studentadd} from '../../api/admin'
import {ElMessage} from 'element-plus'
const dialogVisible=ref(false)
const formLabelWidth = '140px'
const ruleFormRef = ref<any>();
const form = reactive({
  list:{
    id:0,
    photo:'',
    name:'',
    classid:'',
    depid:'',
    remarks:'', //备注
  },
  params: {
    classid: 0,
    name: '',
    depname: '',
    page: 1,
    psize: 10,
    
  },
  Class:[],
  options:[]
})
defineExpose({
  dialogVisible,
  form,
});
const porps = {
  value: 'id',
  label: 'name',
}

//部门级联调接口
const departmentList = async () => {
  const res: any = await departmentlist(form.params);
  console.log('部门级联', res);
  if (res.errCode === 10000) {
    form.options = res.data.list;
  }
};
// 班级级联列表
const getclasseslist = async () => {
  const res: any = await classeslist(form.params);
  console.log('班级列表', res);
  if (res.errCode === 10000) {
    form.Class = res.data.list;
  }
};
const emits = defineEmits(['studentList']);
const submitForm = async (formEl: any | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid: any, fields: any) => {
    if (valid) {
      let res: any = await studentadd(form.list);
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
       
        emits('studentList');
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
  form.list.photo = '';
  form.list.id = 0;
  form.list.name = '';
  form.list.classid = '';
  form.list.depid = '';
  form.list.remarks = '';
  emits('studentList');
};
onMounted(()=>{
  departmentList();
  getclasseslist();
})
</script>

<style scoped>

</style>