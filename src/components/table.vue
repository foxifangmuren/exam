<template>
  <el-table
    @selection-change="handleSelectionChange"
    :data="tableData"
    style="width: 100%"
    highlight-current-row
    :header-cell-style="{ background: '#F7FBFE', color: '#000' }"
  >
    <!-- 复选框 -->
    <el-table-column type="selection" v-if="isTypeSelection" width="55" />
    <!-- 单选框 -->
    <el-table-column  v-else-if="isshow">
      <template #default="scope">
        <el-radio-group v-model="num" @click="ta(scope.row)" class="ml-4">
          <el-radio :label="scope.row.id" size="large"></el-radio>
        </el-radio-group>
      </template>
    </el-table-column>
    <!-- 表格行 -->
    <el-table-column
      v-for="item in tableHeader"
      :prop="item.prop"
      :label="item.label"
      :key="item.id"
    >
      <!-- 建立插槽 -->
      <template #default="scope">
        <!-- 按钮 按钮是个数组 -->
        <div v-if="item.type === 'buttons'">
          <!-- 循环按钮数组 -->
          <span v-for="(btn, index) in item.buttons" :key="index">
            <!-- 阅卷按钮，最后按钮判断 -->
            <span v-if="btn.text == 'exam'">
              <el-button
                link
                :type="btn.type"
                @click="$emit(btn.event, scope.row)"
                >{{ scope.row.incomplete > 0 ? "阅卷" : "查看" }}</el-button >
                
            </span>
            <!-- 板块表头跳转 -->
            <span v-else-if="btn.text == '表头'">
              <el-button
                link
                :type="btn.type"
                @click="$emit(btn.event, scope.row)"
                ><span v-html="scope.row.title"></span
              ></el-button>
            </span>
            <!-- 利用子传递父亲，做按钮点击事件处理 text为按钮的文本 type是按钮的类型 -->
            <el-button
              v-else
              link
              :type="btn.type"
              size="small"
              @click="$emit(btn.event, scope.row)"
              >{{ btn.text }}</el-button
            >
          </span>
        </div>
        <!-- 文本(阅卷未判人数) -->
        <div v-if="item.label == '开放时间'">
            <span v-if=" scope.row.endtime == null">不限</span>
            <span v-else >{{ scope.row.addtime.slice(0,16) +"至"+scope.row.endtime.slice(0,16)}}</span>
        </div>
        <!-- 颜色更改(阅卷未判人数) -->
        <div v-if="item.label == '未判人数'">
          <span v-if="scope.row.incomplete > 0" style="color: red">
            {{ scope.row.incomplete }}
          </span>
          <span v-else style="color: green"> 已经全部阅完 </span>
        </div>
        <!-- 阅卷状态行为 -->
        <span v-if="item.label=='状态'">
            <span v-if="scope.row.state=='已阅卷'" style="color:red;">{{scope.row.state}}</span>
            <span v-if="scope.row.state=='未阅卷'" >{{scope.row.state}}</span>
        </span>
        <!-- 如果没有值显示 TODO -->
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts" >
import { ref, defineEmits } from "vue";
const num = ref(0);
const id = ref();
const emit = defineEmits(['clickToFather',"delarrinfo",'delarrinf']);
const ta = (da: any) => {
  emit('clickToFather', da.id);
};
/***
 * 接受两个参数，
 *      TableHeader(格式)
 *      TableData(数据参数)
 *
 */
const props = withDefaults(
  defineProps<{
    radio?:boolean;
    isTypeSelection?: boolean;
    tableHeader: any[];
    tableData: any[];
    isshow?: boolean;
  }>(),
  {
    loading: false,
    radio:false,
    isshow: false,
    isTypeSelection: false,
    tableHeader: () => [],
    tableData: () => [],
  }
);
//接受参数
const handleSelectionChange = (val: any) => {
  const deldata: Array<any> = val.map((item: { id: any }) => item.id);
  emit("delarrinfo", deldata);
  emit("delarrinf", val);
};
</script>