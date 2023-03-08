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
      title="添加"
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
            placeholder="请选择部门"
            v-model="list.depid"
            :props="props"
            :options="depList"
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item label="班级" prop="classid">
          <el-select v-model="list.classid" placeholder="请选择班级">
            <el-option
              v-for="item in classlist1"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input v-model="list.username" />
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input v-model="list.pass"  type="password"  show-password />
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
import {
  ref,
  defineExpose,
  reactive,
  toRefs,
  onMounted,
  watch,
  toRaw,
} from 'vue';
import { departmentlist, classeslist, classesadd } from '../../api/admin';
import { ElMessage } from 'element-plus';
const dialogVisible = ref(false);

const emits = defineEmits(['studentList']);
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
    classid:'',
  },
  depList: [],
  classlist1: [],
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
    classid: '',
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
// 请求班级列表接口
const getclasslist = async () => {
  let res: any = await classeslist(null);
  if (res.errCode === 10000) {
    ruleForm.classlist1 = res.data.list;
  }
};
onMounted(() => {
  //调用部门列表接口
  getdepartmentlist();
  //调用班级列表接口
  getclasslist();
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
  classid: [
    {
      required: true,
      message: '班级不能为空',
      trigger: 'change',
    },
  ],
  username: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
  pass: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 12, message: '请输入6~12位密码', trigger: 'blur' },
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
          message: '添加成功',
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
        ruleForm.list.classid = '';
        // ruleForm.list = data.list1
        emits('studentList');
      } else {
        ElMessage(res.errMsg);
      }
    } else {
      console.log('error submit!', fields);
    }
  });
};

const handleClose = (formEl: any | undefined) => {
  emits('studentList');
  ruleForm.depid1 = '';
  ruleForm.list.classid = '';
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
  ruleForm.list.classid = '';
  ruleForm.list.id = 0;
  ruleForm.list.username = '';
  ruleForm.list.tel = '';
  ruleForm.list.pass = '';
  ruleForm.list.name = '';
  emits('studentList');
};
const { list, depList, classlist1, depid1 } = toRefs(ruleForm);
</script>
<style lang="less" scoped>
.box {
  display: block;
  width: 400px;
}
</style>
