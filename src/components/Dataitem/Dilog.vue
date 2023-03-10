<template>
  <el-dialog v-model="dialogVisible" title="创建题库" width="45%" :before-close="handleClose">
      <el-form ref="ruleFormRef" :model="state.user" :rules="rules" label-width="120px" class="demo-ruleForm" status-icon>
          <el-form-item label="题库名称" prop="title">
              <el-input style="width: 350px;" v-model="user.title" />
          </el-form-item>
          <el-form-item label="被他人使用">
              <div class="mb-2 flex items-center text-sm">
                  <el-radio-group v-model="user.isshow" class="ml-4">
                      <el-radio :label="1" size="large">允许所有老师使用</el-radio>
                      <el-radio :label="2" size="large">不允许任何老师使用</el-radio>
                      <el-radio :label="3" size="large" @click="open"> 允许部分老师使用 </el-radio>
                  </el-radio-group>
              </div>
          </el-form-item>
      </el-form>
      <template #footer>
          <span class="dialog-footer">
              <el-button @click="cancel">取消</el-button>
              <el-button type="primary" @click="add">
                  确认
              </el-button>
          </span>
      </template>
  </el-dialog>
  <portion ref="Refer" :title="title" @confim="confim"></portion>
</template>

<script lang="ts" setup>
import { ref, defineExpose, reactive, toRefs, defineProps, watch, defineEmits } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { addlist } from '../../api/databaselist'
import portion from './Dillog_content.vue'
const emit = defineEmits(['getlist',"id"])
const props = defineProps({
  update: Object,
})

const ruleFormRef = ref<any>()
const state: any = reactive({
  user: {
      id: 0,
      title: '',
      isshow: 1,
      limits: []
  },
  title:'可见老师'
})
const { user,title } = toRefs(state)

watch(props, (newval: any, oldval: any) => {
  console.log(props.update);
  state.user.id = newval.update.id
  state.user.title = newval.update.title
  state.user.isshow = newval.update.isshow
})
let Refer = ref<any>(false)
const open = ()=>{
  Refer.value.dialogVisible = true
}

const confim = (val:any)=>{
  emit('id',val)
  console.log(val);
  val.map((item:any)=>{
      state.user.limits.push({id:item})
  })
}

// ----显示/隐藏
const dialogVisible = ref(false)


// ----取消
const cancel = () => {
  emit('getlist')
  dialogVisible.value = false
  state.user = {
      id: 0,
      title: '',
      isshow: 1,
      limits: []
  }
}
// ----添加
const add = async () => {
  const res: any = await addlist(state.user)
  console.log(res);
  if (res.errCode === 10000) {
      dialogVisible.value = false
      if (state.user.id === 0) {
          ElMessage({
              message: '添加成功',
              type: 'success',
          })
      } else {
          ElMessage({
              message: '修改成功',
              type: 'success',
          })
      }
      emit('getlist')
      state.user = {
          id: 0,
          title: '',
          isshow: 1,
          limits: []
      }
  } else {
      if (state.user.id === 0) {
          ElMessage({
              message: '添加失败',
              type: 'error',
          })
      } else {
          ElMessage({
              message: '修改失败',
              type: 'error',
          })
      }
  }
}

const handleClose = (done: () => void) => {
  dialogVisible.value = false
  state.user = {
      id: 0,
      title: '',
      isshow: 1,
      limits: []
  }
  emit('getlist')
}
defineExpose({
  dialogVisible
})

const rules = reactive<any>({
  title: [
      { required: true, message: '请输入题库名称', trigger: 'blur' },
  ],
})




</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}

:deep(.el-dialog__body) {
  padding: 0 !important;
}

.flex {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column-reverse;
}

:deep(.el-radio-group) {
  display: inline-flex;
  align-items: normal;
  /* flex-wrap: wrap; */
  font-size: 0;
  flex-direction: column;
}
</style>