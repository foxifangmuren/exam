<template>
  <div>
      <el-dialog v-model="dialogVisible" :title="props.title" width="47%" :before-close="handleClose">
          <el-form>
              <el-form-item label="部门">
                  <el-select v-model="depid" class="m-2" @change="depChange" placeholder="请选择">
                      <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
              </el-form-item>
          </el-form>
          <el-transfer v-model="value" :data="data" :titles=tit :props="transferProps" @left-check-change="leftChange"
              @right-check-change="rightChange" />
          <template #footer>
              <span class="dialog-footer">
                  <el-button @click="dialogVisible = false">取消</el-button>
                  <el-button type="primary" @click="submitForm">
                      确定
                  </el-button>
              </span>
          </template>
      </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, defineExpose,toRefs,reactive,defineProps,defineEmits } from 'vue'
import { departmentlist,studentlist,teacherlist } from '@/api/admin'
const props = defineProps({
  title:String
})
const emit = defineEmits(['confim','val'])
const dataList = reactive({
  options: [] as any,
  depid: null,
})
const dialogVisible = ref(false)
const { depid, options } = toRefs(dataList)
const getDepar = async () => {
  const res: any = await departmentlist({ page: 1, psize: 30 })
  if (res.errCode === 10000) {
      options.value = res.data.list
      // console.log(options.value);
      
  }
}
getDepar()
// 穿梭框
const tit = ref(['未选', '已选'])
const data: any = ref([]) // 左侧数据
const value: any = ref([])// 右侧数据
// 重定向数据
const transferProps = {
  label: 'username',
  key: 'id',
}

const Shuttledata: any = ref({})
const getTeacher = async (depid?: number) => {
  console.log(props.title);
  
  if (props.title == "可见老师" || props.title == "阅卷老师") {
      Shuttledata.value = await teacherlist({ page: 1, psize: 500, depid: depid })
  } else if (props.title == "考生范围") {
      Shuttledata.value = await studentlist({ page: 1, psize: 500, depid: depid })
  }
  if (Shuttledata.value.errCode === 10000) {
      data.value = Shuttledata.value.data.list
  }
}

// 部门
const depChange = (depid: number) => {
  getTeacher(depid)  
  console.log(depid);
  
}
// 穿梭框左侧数据
const leftChange = (val: any) => {
  console.log(val);
  emit("val" ,val)
  
  data.value.forEach((item: any) => {
      val.forEach((ite: any) => {
          if (item.id === ite) {
              value.value.push(item.id)
          }
      })
  })
}
// 穿梭框右侧数据
const rightChange = (val: any) => {
  val.forEach((item: any) => {
      let index = value.value.indexOf(item)
      value.value.splice(index, 1)
  })
}
// 穿梭框添加
const submitForm = () => {
  dialogVisible.value = false
  emit('confim', value.value,props.title)
  value.value = []
}


const handleClose = (done: () => void) => {
  dialogVisible.value = false
}

defineExpose({
  dialogVisible
})
</script>

<style scoped>
.transfer-footer {
  margin-left: 15px;
  padding: 6px 5px;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}

:deep(.el-transfer) {
  display: flex;
  justify-content: space-between;
}

:deep(.el-transfer__buttons) {
  display: none !important;
}

:deep(.el-transfer-panel) {
  width: 300px;
}

:deep(.el-dialog .el-dialog__body) {
  padding: 30px 20px !important;
}
</style>