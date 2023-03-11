<template>
  <div>
    <div class="head">
      <span>部门：</span>
      <el-select 
                 class="numberValidateForm.multiples"
                 placeholder="请选择"
                 @change="changes">
        <el-option v-for="(item,index) in options"
                   :key="index"
                   :label="item.name"
                   :value="item.id" />
      </el-select>
    </div>
    <!-- 穿梭框 -->
    <el-transfer v-model="value"
                 @left-check-change="leafChange"
                 @right-check-change='rightChange'
                 :data="dataa"
                 :titles="['未选', '已选']" />

    <div class="tom">
      <el-button @click="quxiao">取消</el-button>
      <el-button type="primary"
                 @click="submit">确定</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineEmits } from "vue";
import { SeleList, ForList } from "../../api/test";
import { ElMessageBox } from "element-plus";
const emit = defineEmits(["sub", "limitss", "valuesss", "isshow"]);
const dialogVisible1 = ref(false);
const value:any = ref([]);
const options:any = reactive([]);
const dataa = ref([]);

const numberValidateForm = reactive({
  depid: "",
  multiples: "", //可见老师
});

// 请求下拉列表
const GetSeleList = async () => {
  let res:any= await SeleList({});
  console.log(res);
  if (res.errCode === 10000) {
    options.push(...res.data.list);
  }
};
GetSeleList();
// 穿梭框
const changes = async (depid: any) => {
  console.log(depid);
  let res:any = await ForList({ depid });
  console.log(res);
  if (res.errCode === 10000) {
    dataa.value = res.data.list.map((item: any) => {
      return {
        key: item.id,
        label: item.name,
      };
    });
  }
};
// 确定
const teacherid = ref([]);
const submit = () => {
  const arr = value.value.map((item: any) => {
    return { id: item };
  });
  emit("valuesss", arr);
  emit("sub", false);
  emit("isshow", false);
};
// 取消
const quxiao = () => {
  emit("sub", false);
};
// 穿梭框
interface Option {
  key: number;
  label: string;
  disabled: boolean;
}
const leafChange = (res: any) => {
  value.value = [...value.value, ...res];
  limitss.value = value.value.length;
  emit("limitss", limitss.value);
};
const limitss = ref([]);
const rightChange = (res: any) => {
  value.value = value.value.filter((item:any) => !res.includes(item));
  limitss.value = value.value.length;
  emit("limitss", limitss.value);
};
const generateData = () => {
  const data: Option[] = [];
  for (let i = 1; i <= 15; i++) {
    data.push({
      key: i,
      label: `Option ${i}`,
      disabled: i % 4 === 0,
    });
  }
  return data;
};

const data = ref<Option[]>(generateData());
</script>

<style scoped>
:deep(.el-transfer){
  margin-left: 100px;
}
.head {
  margin-left: 40px;
  margin-top: -20px;
}

dialog-footer button:first-child {
  margin-right: 10px;
}

:deep(.el-transfer__buttons) {
  display: none;
}
.topbranch{
  margin-left: 60px;
}

:deep( .el-transfer-panel){
  width: 270px;
  margin-left: 40px;
  margin-top: 25px;
}
.tom{
  position: absolute;
  top: 580px;
  right: 220px;
    float: right;
    padding-bottom: 220px;
}
.tom{
  margin-left: 500px;
  margin-top: 20px;
}
.head {
    width: 700px;
    margin-left: 100px;
}
</style>