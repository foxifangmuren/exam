<template>
  <el-drawer
    :drawer="drawer"
    :title="title"
    :direction="direction"
    :before-close="handleClose"
  >
    <span>Hi, there!</span>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'
const handleClose = (done: () => void) =>done()
const prpos = withDefaults(
    defineProps<{
       drawer:boolean;
       title:string
    }>(),{
        drawer:false,
        title:"标题"
    }
)
</script>
