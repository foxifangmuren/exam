<template>
  <div class="demo-pagination-block">
    <el-pagination
      :page="page"
      :psize="psize"
      :page-sizes="[10, 15, 20, 25]"
      :small="small"
      :disabled="false"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script lang="ts" setup>
/**
 * 分页封装
 * 将原本的分页数据每页显示条数进行更改
 * 分页按钮加上背景色
 * 每页显示多少条数据，第几页进行双向数据绑定，
 * 接受总页数，接受每页显示多少条，第几页
 * 方法
 * small是否使用小型分页
 */
 //接受参数
    const props=withDefaults(defineProps<{
        total:number,
        page:number,
        psize:number,
        small?:boolean
    }>(),{
        total:0,
        psize:0,
        page:0,
        small:true
    })
    //子组件向父组件传递方法
    const emits=defineEmits(['changePageSize','changePage'])

    const handleSizeChange = (val: number) => {
        emits('changePageSize',val)
    }
    const handleCurrentChange = (val: number) => {
        emits("changePage",val)
    }
</script>

<style scoped>
.demo-pagination-block{
    width: 600px;
    margin: 20px auto;
}
</style>
