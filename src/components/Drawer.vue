<template>
  <el-drawer
    :drawer="drawer"
    title="I am the title"
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

    }>(),{
        drawer:false
    }
)
</script>
