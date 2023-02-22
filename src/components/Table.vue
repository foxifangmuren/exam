<template>
  <el-table :data="tableData" style="width: 100%">
    <!-- 复选框 -->
    <el-table-column type="selection" v-if="isTypeSelection" width="55" />
    <!-- 表格行 -->
    <el-table-column v-for="item in tableHeader" :prop="item.prop" :label="item.label" :key="item.id">
      <!-- 建立插槽 -->
      <template #default="scope">
        <!-- 按钮 按钮是个数组 -->
        <div v-if="item.type === 'buttons'">
          <!-- 循环按钮数组 -->
          <span v-for="(btn, index) in item.buttons" :key="index">
            <!-- 利用子传递父亲，做按钮点击事件处理 text为按钮的文本 type是按钮的类型 -->
            <el-button
              link
              :type="btn.type"
              size="small"
              @click="$emit(btn.event, scope.row)"
              >{{ btn.text }}</el-button
            >
          </span>
        </div>
        <!-- 文本 -->
        <div v-if="item.label=='开放时间'">
          <span>{{scope.row.endtime==null? '不限':scope.row.addtime-scope.row.endtime}}</span>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts" >
/***
 * 接受两个参数，
 *      TableHeader(格式)
 *      TableData(数据参数)
 *
 */
const props = withDefaults(
  defineProps<{
    isTypeSelection?: boolean;
    tableHeader: any[];
    tableData: any[];
  }>(),
  {
    isTypeSelection: true,
    tableHeader: () => [],
    tableData: () => [],
  }
);
</script>
