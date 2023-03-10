<template>
  <div class="box">
    <!-- 头部 -->
    <div class="header">
      <span class="head">班级管理</span>
      <el-button type="primary" @click="add"
        >添加班级</el-button
      >
    </div>
    
  
    <!-- 内容 -->
    <div class="content">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="班级名称">
          <el-input v-model="data.key" placeholder="请输入关键字" />
        </el-form-item>
        <el-form-item label="部门" prop="depid">
          <el-cascader
            v-model="data.value"
            :options="data.options"
            :props="props"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
        <!-- 批量删除 -->
    <div v-if="va !=''">
      <el-button type="danger" @click="batchdel">批量删除</el-button>
    </div>
      <div>
        <el-table
          ref="multipleTableRef"
          :data="data.tableData"
          style="width: 100%"
          :header-cell-style="{ background: '#fafafa' }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column property="name" label="班级名称" />
          <el-table-column property="depname" label="部门" />
          <el-table-column label="操作" width="120" #default="scope">
            <span class="zi" style="cursor: pointer" @click="update(scope.row)">修改</span>
            <span class="zi" style="cursor: pointer" @click="del(scope.row.id)"
              >删除</span
            >
          </el-table-column>
        </el-table>
      </div>
    </div>
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
    <classUp ref="up" @getclasseslist="getclasseslist"></classUp>
    <classAdd ref="classadd" @getclasseslist="getclasseslist"></classAdd>
  </div>
</template>

<script setup lang="ts">
import classAdd from '../../../../components/class/classAdd.vue'
import classUp from '../../../../components/class/classUp.vue'
import { onMounted, reactive, ref, toRefs } from 'vue';
import {
  departmentlist,
  classeslist,
  classesdel,
  delAll
} from '../../../../api/admin';
import { ElMessageBox, ElMessage, Action } from 'element-plus';
let up = ref<any>(null)
let classadd = ref<any>(null)
const form = reactive({
  id: 0,
  name: '',
  depid: 3069,
});
const data = reactive({
  //表格数据
  tableData: [],
  //参数
  params: {
    id: 0,
    name: '',
    depname: '',
    page: 1,
    psize: 10,
  },
  key: '',
  //搜索
  value: [],
  //部门
  options: [],
  //分页 总页数
  total: 0,
  ids:[],
});
// 解构数据
const { params,ids } = toRefs(data);
const va:any = ref('')
//全选
const handleSelectionChange = (val: any) => {
  data.ids = val.map((item: any) => item.id);
  va.value = val;
  multipleSelection.value = val
};
let obj = ref({})
const props = {
  expandTrigger: 'hover',
  checkStrictly: true,
  value: 'id',
  label: 'name',
};
const handleChange = (e: any) => {
  data.value = e;
};

const multipleSelection = ref<any[]>([]);

const value: any = ref('');
//级联调接口
const departmentList = async () => {
  const res: any = await departmentlist(data.params);
  console.log('级联', res);
  if (res.errCode === 10000) {
    data.options = res.data.list;
  }
};
//班级列表
const getclasseslist = async () => {
  const res: any = await classeslist({
    ...params.value,
    depid: data.value ? data.value[data.value.length - 1] : 0,
    key: data.key,
  });
  console.log('班级列表', res);
  if (res.errCode === 10000) {
    data.tableData = res.data.list;
    data.total = res.data.counts;
  }
};
//查询
const onSubmit = () => {
  getclasseslist();
};

//添加
const add = async () => {
  classadd.value.dialogVisible = true
};
//修改
const update =(data:any)=>{
  up.value.dialogVisible = true
  console.log(up.value)
  up.value.ruleForm.list = JSON.parse(JSON.stringify(data))
  obj.value = data
}
//请求删除接口
const delinfo = async (ids: number) => {
  const res: any = await classesdel({ id: ids });
  // console.log('删除',res)
  if (res.errCode === 10000) {
    ElMessage.success('删除成功');
    getclasseslist();
  } else {
    ElMessage.error(res.errMsg);
  }
};
//删除
const del = (ids: number) => {
  ElMessageBox.confirm('是否永久删除此文件', '提示', {
    cancelButtText: '取消',
    confirmButtonText: '确定',
    type: 'warning',
  })
    .then((res: any) => {
      delinfo(ids);
    })
    .catch((error: any) => {
      ElMessage.error('已取消删除');
    });
};
// 批量删除
const dells =async ()=>{
    const res:any = await delAll({ids:ids.value})
    console.log(res);
    if(res.errCode === 10000){
        ElMessage.success("删除成功")
        getclasseslist()
    }else{
        ElMessage.error(res.errMsg)
    }
}
const batchdel = async()=>{
   const conf = await ElMessageBox.confirm('是否永久删除此文件', '提示', {
    cancelButtText: '取消',
    confirmButtonText: '确定',
    type: 'warning',
  }).catch((error: any) => {
    ElMessage.error('已取消删除');
  });
  if (conf) dells();
}

//分页
const handleSizeChange = (val: number) => {
  getclasseslist();
};
const handleCurrentChange = (val: number) => {
  getclasseslist();
};

//页面加载
onMounted(() => {
  //班级列表
  getclasseslist();
  //部门级联
  departmentList();
});
</script>

<style scoped>
.box {
  margin-left: 5px;
  background-color: #fff;
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
.zi {
  font-size: 6px;
  margin-right: 10px;
  color: rgb(85, 149, 227);
}

.element.style {
  background: rgb(250, 250, 250);
}

.demo-pagination-block {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
