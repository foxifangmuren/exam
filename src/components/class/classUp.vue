<template>
  <div>
    <el-form ref="ruleFormRef" :model="list">
      <el-dialog v-model="dialogVisible" title="修改">
        <el-form :model="form">
          <el-form-item label="班级名称" :label-width="formLabelWidth">
            <el-input v-model="list.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="部门"  :label-width="formLabelWidth">
              <el-cascader
                v-model="list.depid"
                :props="porps"
                :options="form.department"
                clearable 
              ></el-cascader>
            </el-form-item>
          
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="qu(ruleFormRef)">取消</el-button>
            <el-button type="primary" @click="submitForm(ruleFormRef)"> 确定 </el-button>
          </span>
        </template>
      </el-dialog>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import { onMounted, reactive, ref, toRefs,watch } from "vue";
import {departmentlist,classesadd} from '../../api/admin'
const dialogVisible = ref(false)
const ruleFormRef = ref<any>()
const formLabelWidth = '140px'
const form = reactive({
  depid1:[],
  list:{
    id:0,
    name:'',
    depid:'',
  },
  params:{
    id:0,
    name:''
  },
  //部门列表
  department:[],
})
const {list} = toRefs(form)
const porps = {
  value: 'id',
  label: 'name',
}
//部门列表
const department = async()=>{
  const res:any = await departmentlist(form.params)
  // console.log('部门级联框列表',res)
  if(res.errCode === 10000){
    form.department = res.data.list
  }
}
const emits = defineEmits(['classList']);
//点击修改
const submitForm = async(formEl: any | undefined)=>{
  if(!formEl) return;
  await formEl.validate(async (valid:any,fields:any)=>{
    if(valid){
      let res:any = await classesadd(form.list);
      // console.log('111',res)
      if (res.errCode === 10000) {
        ElMessage({
          message:'修改成功',
          type: 'success',
        });
        watch(
          () => dialogVisible,
          (newValue, oldValue)=>{
            // console.log(newValue.value, oldValue,);
            if (formEl != undefined) {
              formEl.resetFields();
            }
          },
          {immediate: true}
        );
        dialogVisible.value = false;
        form.list.depid = '';
        emits('classList');
      } else {
        console.log(fields);
      }
    }
  });
};
//取消
const qu = (formEl:any|undefined)=>{
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
  form.list.id = 0;
  form.list.name = '';
  form.list.depid = '';
  emits('classList');
}
defineExpose({
  dialogVisible,
  form
})
onMounted(()=>{
  //部门级联
  department()
})
</script>

<style scoped>

</style>