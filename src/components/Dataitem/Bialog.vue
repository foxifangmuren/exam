<template>
  <!-- 题库添加 -->
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="题库添加"
      width="30%"
      :before-close="handleClose"
    >
      <div>
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
        >
          <el-form-item label="题库名称" prop="title">
            <el-input v-model="ruleForm.title" />
          </el-form-item>
          <el-form-item label="使用权限" prop="resource">
            <el-radio-group v-model="ruleForm.isshow">
              <el-form-item>
                <el-radio :label="1">允许所有老师使用</el-radio>
              </el-form-item>
              <el-form-item>
                <el-radio :label="2">不允许任何老师使用</el-radio>
              </el-form-item>
              <el-radio v-model="ruleForm.limits" @click="teacher = true"
                >允许部分老师使用</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-dialog v-model="teacher" title="可见老师">
          <div style="margin-left: 20px; margin-bottom: 20px">
            <el-form-item label="部门">
              <el-cascader clearable />
            </el-form-item>
          </div>
          <div style="margin-left: 20px">
            <el-transfer />
          </div>

          <template #footer>
            <span class="dialog-footer">
              <el-button @click="teacher = false">取消</el-button>
              <el-button type="primary" @click="teacher = false">
                确定
              </el-button>
            </span>
          </template>
        </el-dialog>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="add"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts" >
import { ref, reactive, watch } from "vue";
import { addlist } from "@/api/databaselist";
const ruleFormRef = ref<any>();
const props = defineProps({
  val: {
    type: Object,
    default: null,
  },
});
watch(props, (nweProps, oldProps) => {
  console.log(props.val);
  for (let item in ruleForm) {
    ruleForm[item] = props.val[item];
  }
});

//刷新列表
const emit = defineEmits(["getlist"]);
//显示不显示
const dialogVisible = ref(false);
const teacher = ref(false);
//暴漏
defineExpose({
  dialogVisible,
});
//叉号
const handleClose = (done: () => void) => done();
// 表单
const formSize = ref("default");
const ruleForm: any = reactive({
  id: 0,
  title: "",
  isshow:1,
  limits: [],
});
//非空校验
const rules = reactive<any>({
  name: [{ required: true, message: "请输入题库名称", trigger: "blur" }],
});
//添加按钮
const add = async () => {
  const src = await addlist(ruleForm);
  // 关闭弹框
  dialogVisible.value = false;
  //调用列表
  emit("getlist");
  //清空列表
  ruleForm.id = 0;
  (ruleForm.title = ""), (ruleForm.isshow = 0);
  ruleForm.limits = 0;
};
</script>

<style scoped>
:deep(.el-radio-group) {
  display: block;
  flex-direction: column;
  align-items: center;
}
</style>
    