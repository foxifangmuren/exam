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
        <el-form-item label="电话" prop="tel">
          <el-input v-model="list.tel" />
        </el-form-item>
        <el-form-item label="部门" prop="depid">
          <el-cascader
            placeholder="请选择角色"
            v-model="list.depid"
            :props="props"
            :options="depList"
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item label="角色" prop="roleid">
          <el-select v-model="list.roleid" placeholder="请选择角色">
            <el-option
              v-for="item in rolelist1"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
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
import { departmentlist, rolelist, teacherAdd } from '../api/admin';
import { ElMessage } from 'element-plus';
import { fa } from 'element-plus/es/locale';
import {defineProps} from "vue"
const dialogVisible = ref(false);

const emits = defineEmits(['teacherList']);

const formSize = ref('default');
const ruleFormRef = ref<any>();
const ruleForm: any = reactive({
  depid1: [],
  list: {
    id: 0,
    username:'',
    pass:'',
    name: '' ,
    tel:'',
    depid: '',
    roleid:'',
  },
  depList: [],
  rolelist1: [],
});

console.log(ruleForm.list.id);
const data: any = reactive({
  list1: {
    id: 0,
    username: '',
    pass: '',
    name: '',
    tel: '',
    depid: '',
    roleid: '',
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
// 请求角色部门列表接口
const getrolelist = async () => {
  let res: any = await rolelist(null);
  if (res.errCode === 10000) {
    ruleForm.rolelist1 = res.data.list;
  }
};
onMounted(() => {
  //调用部门列表接口
  getdepartmentlist();
  //调用角色列表接口
  getrolelist();
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
  roleid: [
    {
      required: true,
      message: '角色不能为空',
      trigger: 'change',
    },
  ],
  username: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
  pass: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
});

const submitForm = async (formEl: any | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid: any, fields: any) => {
    if (valid) {
      let res: any = await teacherAdd(ruleForm.list);
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
        ruleForm.list.roleid = '';
        // ruleForm.list = data.list1
        emits('teacherList');
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

  emits('teacherList');
  // console.log(data.list1)
  ruleForm.depid1 = '';
  ruleForm.list.roleid = '';
  ruleForm.list.id = 0;
  ruleForm.list.username = '';
  ruleForm.list.tel = '';
  ruleForm.list.pass = '';
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
  ruleForm.list.roleid = '';
  ruleForm.list.id = 0;
  ruleForm.list.username = '';
  ruleForm.list.tel = '';
  ruleForm.list.pass = '';
  ruleForm.list.name = '';
  emits('teacherList');
};
const { list, depList, rolelist1, depid1 } = toRefs(ruleForm);
</script>
<style lang="less" scoped>
.box {
  display: block;
  width: 400px;
}
</style>
