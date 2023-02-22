<template>
  <div class="box">
    <!-- 头部 -->
    <div class="header">
      <span class="head">师资管理</span>
      <el-button type="primary">添加师资</el-button>
    </div>
    <!-- 内容 -->
    <div class="content">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="关键字">
          <el-input v-model="data.key" placeholder="请输入关键字" />
        </el-form-item>
        <el-form-item label="部门">
          <el-cascader
            v-model="data.value"
            :options="data.options"
            :props="props"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="角色">
          <el-cascader
            v-model="data.value"
            
            :props="props"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-table
          ref="multipleTableRef"
          :data="data.tableData"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column property="name" label="学生" />
          <el-table-column property="depname" label="部门" />
          <el-table-column property="tel" label="电话" />
          <el-table-column property="rolename" label="角色" />
          <el-table-column property="username" label="账号" />
          <el-table-column label="操作" width="150" #default="scope">
            <span class="zi" style="cursor: pointer">重置密码</span>
            <span class="zi" style="cursor: pointer">修改</span>
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
  </div>
</template>

<script setup lang="ts">
import { log } from 'console';
import { onMounted, reactive, ref, toRefs } from 'vue';
import {
  departmentlist,
  teacherlist,
  teacherdel
} from '../../../../api/admin';
import { ElMessageBox, ElMessage, Action } from 'element-plus';
const data = reactive({
  //表格数据
  tableData: [],
  //列表参数
  params: {
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
  //角色

  //分页 总页数
  total: 0,
});
// 解构数据
const { params } = toRefs(data);
const props = {
  expandTrigger: 'hover',
  checkStrictly: true,
  value: 'id',
  label: 'name',
};
const handleChange = (e: any) => {
  data.value = e;
};

interface User {
  date: string;
  name: string;
  address: string;
}
const multipleSelection = ref<User[]>([]);

const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val;
};
const value: any = ref('');
//部门级联调接口
const departmentList = async () => {
  const res: any = await departmentlist();
  console.log('部门级联', res);
  if (res.errCode === 10000) {
    data.options = res.data.list;
  }
};
// 角色级联列表
// const getclasseslist = async ()=>{
//   const res:any = await classeslist(data.params)
//   console.log('班级列表',res)
//   if(res.errCode === 10000){
//     data.tableData = res.data.list
//   }
// }
//师资列表
const teacherList = async () => {
  const res: any = await teacherlist({
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
//删除接口
const dell = async (ids: number) => {
  const res: any = await teacherdel({ id: ids });
  // console.log('学生删除',res)
  if (res.errCode === 10000) {
    ElMessage.success('删除成功');
    teacherList();
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
      dell(ids);
    })
    .catch((error: any) => {
      ElMessage.error('已取消删除');
    });
};
//查询
const onSubmit = () => {
  console.log('hello');
  teacherList();
};

//分页
const handleSizeChange = (val: number) => {
  teacherList();
};
const handleCurrentChange = (val: number) => {
  teacherList();
};

//页面加载
onMounted(() => {
  //学生列表
  teacherList();
  //部门级联
  departmentList();
  // 角色列表
});
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
</style>
