<template>
  <el-button text @click="dialogVisible = true">
    click to open the Dialog
  </el-button>

  <el-dialog v-model="dialogVisible" title="可见老师" width="40%" :before-close="handleClose" >

    <div>
      <!-- 搜索框 -->
      <div>部门 ：
        <el-select v-model="dep" class="m-2" placeholder="Select" >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <!-- 身体 -->
      <div class="mytransfer">
        <el-transfer 
        v-model="value" 
        :data="data" 
        filterable
         :filter-method="filterMethod"
        />
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          Confirm
        </el-button>
      </span>
    </template>

  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { ElMessageBox } from "element-plus";
const dep=ref('')
//下拉栏数据
const options = [
  {
    value: "Option1",
    label: "Option1",
  },
  {
    value: "Option2",
    label: "Option2",
  },
  {
    value: "Option3",
    label: "Option3",
  },
  {
    value: "Option4",
    label: "Option4",
  },
  {
    value: "Option5",
    label: "Option5",
  },
];
//选择数据
interface Option {
  key: number;
  label: string;
  disabled: boolean;
}

const generateData = () => {
  const data: Option[] = [];
  for (let i = 1; i <= 90; i++) {
    // 加到数组里面
    data.push({ key: i, label: `Option ${i}`, disabled: false, });
  }
  return data;
};

const data = ref<Option[]>(generateData());
const value = ref([]);

const filterMethod = (query: string, item: { initial: string; }) => {
  return item.initial.toLowerCase().includes(query.toLowerCase())
}
//弹框信息
const dialogVisible = ref(false);
//叉号
const handleClose = (done: () => void) => {

      done();
};

</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
.mytransfer {
  margin: 30px auto 0;
  display: flex;
  justify-content: space-between;
}
:deep(.el-transfer-panel__list) {
  height: 400px;
}
:deep(.el-transfer-panel__body) {
  height: 400px;
}
:deep(.el-transfer){
    width: 100%;
    display: flex;
    justify-content: space-between;
}
</style>
