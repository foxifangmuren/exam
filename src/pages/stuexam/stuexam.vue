<template>
  <div class="stu">
    <div class=""></div>
  </div>
</template>
<script lang="ts" setup>
import {getteststart} from '../../api/stutest'
import { useRoute,useRouter} from 'vue-router'
import{onMounted,reactive} from 'vue'
const route = useRoute()
const obj = reactive({
  list:[]
})
const getList =async ()=>{
  let res = await getteststart({testid:route.query.testid})
  console.log(res)
  if(res.errCode===10000){
    obj.list = res.data
  }
}
onMounted(() => {
  getList()
})
</script>
<style lang="less" scoped>
</style>