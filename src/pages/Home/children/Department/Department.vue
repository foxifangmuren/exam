<template>
    <div class="left">
      <el-tree
        :data="tabledata.arr"
        :props="defaultProps"
        @node-click="handleNodeClick"
        default-expand-all
      />
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { departmentlist } from '../../../../api/admin';
const tabledata =reactive({arr:[]})
const list =async ()=>{
  const res = await departmentlist(null)
  console.log(res);
  tabledata.arr =res.data.list
}
onMounted(() => {
  list();
});
const handleNodeClick = (data: any) => {
  console.log(data)
}
const defaultProps = {
  children: 'children',
  label: 'name',
}
</script>

<style lang="less" scoped>
div .left {
  width: 0%;
  // height: 500px;
  // background-color: aqua;
}
.kao {
  font-size: 20px;
  margin-bottom: 15px;
}
.add {
  margin-left: 20px;
}
.el-button {
  width: 100px;
  font-size: 10px;
}
</style>
