<template>
  <div class="box">
    <!-- 头部 -->
    <div class="header">
      <span class="head">角色管理</span>
      <el-button type="primary">添加角色</el-button>
    </div>
    <!-- 表格 -->
    <div class="content">
      <div>
        <el-table
          ref="multipleTableRef"
          :data="data.tableData"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          
          <el-table-column property="name" label="学生姓名" />
          <el-table-column label="操作" width="120" #default="scope">
            <span class="zi" style="cursor:pointer;">编辑</span>
            <span class="zi" style="cursor:pointer;" @click="del(scope.row.id)">删除</span>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页 -->
    <div class="demo-pagination-block">
      <el-pagination
        v-model:current-page="data.params.page"
        v-model:page-size="data.params.psize"
        :page-sizes="[5, 10, 15, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="data.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { log } from 'console';
import { ElMessageBox,ElMessage } from 'element-plus';
import { onMounted, reactive,ref, toRefs } from 'vue';
import {rolelist ,roledel} from '../../../../api/admin'
const data = reactive({
  //表格数据
  tableData:[],
  //列表参数
  params:({
    page:1, 
    psize: 10
  }),
  key:'',
  //搜索
  value:[],
  //分页 总页数
  total:0,
  ids:[]
});
// 解构数据
const {  params} = toRefs(data)
const props = {
    expandTrigger: 'hover',
    checkStrictly: true,
    value: 'id', label: 'name'
}

interface User {
  date: string
  name: string
  address: string
}
const multipleSelection = ref<User[]>([])

const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val
}
const value:any  = ref('')

//班级列表
const rouleList = async ()=>{
  const res:any = await rolelist({...params.value, depid: data.value?data.value[data.value.length - 1]:0, key: data.key })
  console.log('班级列表',res)
  if(res.errCode === 10000){
    data.tableData = res.data.list
    data.total = res.data.counts
  }
}
//查询
const onSubmit = () => {
  console.log('hello')
  rouleList()
};
//删除的点击
const del = (ids:number) => {
  ElMessageBox.confirm('是否永久删除此文件','提示',{
    cancelButtText:"取消",
    confirmButtonText:"确定",
    type:'warning',
  })
  .then((res:any) => {
    dell(ids)
  })
  .catch((error:any)=>{
    ElMessage.error("已取消删除");
  })
}
//删除接口
const dell = async(ids:number)=>{
  const res:any = await roledel({id:ids})
  // console.log('删除',res)
  if (res.errCode === 10000) {
    ElMessage.success("删除成功");
    rouleList();
  } else {
    ElMessage.error(res.errMsg);
  }
}
//分页
const handleSizeChange = (val: number) => {
  rouleList()
}
const handleCurrentChange = (val: number) => {
  rouleList()
}

//页面加载
onMounted(()=>{
  //角色列表
  rouleList()
})


</script>

<style scoped>
.box {
  margin-left: 5px;
  /* background-color: aquamarine; */
}
.header {
  display: flex;
  justify-content: space-between;
}
.head {
  font-size: 20px;
}

.content {
  margin-top: 10px;
}
.zi{
  font-size: 6px;
  margin-right: 10px;
  color: rgb(85, 149, 227);
}



.demo-pagination-block{
  display: flex;
  justify-content: center;
  margin-top: 15px;
}
</style>
