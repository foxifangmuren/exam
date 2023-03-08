<template>
  <div>
      <el-dialog v-model="teacher" title="可见老师" width="47%" :before-close="handleClose">
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
                  <el-button @click="teacher = false">取消</el-button>
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
import { departmentlist,teacherlist,studentlist } from '@/api/admin'
const props = defineProps({
  title:String
})
const emit = defineEmits(['confim','val'])
const dataList = reactive({
  options: [] as any,
  depid: null,
})
//暴露属性
const teacher = ref(false)
defineExpose({
  teacher
})

const { depid, options } = toRefs(dataList)
const getDepar = async (depid?:any) => {
  const res: any = await departmentlist({ page: 1, psize: 500 ,depid: depid})
  if (res.errCode === 10000) {
      options.value = res.data.list
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
  Shuttledata.value = await teacherlist({ page: 1, psize: 500, depid: depid })
  if (Shuttledata.value.errCode === 10000) {
      data.value = Shuttledata.value.data.list
  }
}
getTeacher()
// 部门
const depChange = (depid: number) => {
  // console.log(depid);
  getTeacher(depid)  
}
// 穿梭框左侧数据
const leftChange = (val: any) => {
  // console.log(val);
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
  teacher.value = false
  console.log(value.value);
  emit('confim', value.value)
  value.value = []
}

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