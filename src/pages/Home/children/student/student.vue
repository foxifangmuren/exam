<template>
  <div class="box">
    <!-- 头部 -->
    <div class="header">
      <span class="head">学生管理</span>
      <div>
        <el-button @click="adds">批量添加</el-button>
        <el-button type="primary" v-show="1" @click="add"
          >添加学生</el-button
        >
      </div>
    </div>

    <!-- 搜索框 -->
    <div class="content">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="班级名称">
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
        <el-form-item label="班级">
          <el-cascader
            v-model="data.value"
            :options="data.classlist"
            :props="props"
            @change="handleChange"
            clearable
          ></el-cascader>
          
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
          <el-button type="danger" @click="dels">批量删除</el-button>
        </el-form-item>
      </el-form>
      <!-- 表格 -->
      <div>
        <el-table
          ref="multipleTableRef"
          :data="data.tableData"
          style="width: 100%"
          :header-cell-style="{ background: '#fafafa' }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column property="name" label="学生姓名" />
          <el-table-column property="remarks" label="备注" />
          <el-table-column property="depname" label="所属部门" />
          <el-table-column property="classname" label="所在班级" />
          <el-table-column property="username" label="账号" />
          <el-table-column property="addtime" label="添加时间">
            <template #default="scope">
              <span>{{ scope.row.addtime.substr(0,16) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="150" #default="scope">
            <span class="zi" style="cursor: pointer" @click="pass(scope.row)">重置密码</span>
            <span class="zi" style="cursor: pointer" @click="update(scope.row)">修改</span>
            <span class="zi" style="cursor: pointer" @click="del(scope.row.id)"
              >删除</span>
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
    <studentAdd ref="studadd"  @studentList="studentList"></studentAdd>
    <studentUp ref="studup" @studentList="studentList"></studentUp>
    <studentPass ref="studpass" @studentList="studentList"></studentPass>
    <studentAdds @imports="imports" :isImport="isImport" @isImports="isImports"></studentAdds>
  </div>
</template>

<script setup lang="ts">
import studentAdds from '../../../../components/student/studentAdds.vue'
import studentAdd from '../../../../components/student/studentAdd.vue'
import studentPass from '../../../../components/student/studentPass.vue'
import studentUp from '../../../../components/student/studentUp.vue'
import { onMounted, reactive, ref, toRefs } from 'vue';
import {
  departmentlist,
  studentlist,
  classeslist,
  studentdel,
  studentdelall,
} from '../../../../api/admin';
import { ElMessageBox, ElMessage } from 'element-plus';
let studadd = ref<any>(null)
let studup = ref<any>(null)
let studpass = ref<any>(null)
let obj = ref({})
//引入添加学生的对话框

const data = reactive({
  //表格数据
  tableData: [],
  //列表参数
  params: {
    classname: '',
    name: '',
    depname: '',
    page: 1,
    psize: 10,
    
  },
  key: '',
  //搜索
  value: [],
  value1:[],
  //部门
  options: [],
  //班级
  classlist: [],
  //分页 总页数
  total: 0,
  ids: [],
  //添加学生
  isStu: false,
  isImport:false,
});
// 解构数据
const { params, ids,isImport } = toRefs(data);
const props = {
  expandTrigger: 'hover',
  checkStrictly: true,
  value: 'id',
  label: 'name',
};
const handleChange = (e: any) => {
  data.value = e;
};
//全选
const handleSelectionChange = (val: any) => {
  data.ids = val.map((item: any) => item.id);
};
const value: any = ref('');
//部门级联调接口
const departmentList = async () => {
  const res: any = await departmentlist(data.params);
  if (res.errCode === 10000) {
    data.options = res.data.list;
  }
};
// 班级级联列表
const getclasseslist = async () => {
  const res: any = await classeslist(data.params);
  if (res.errCode === 10000) {
    data.classlist = res.data.list;
  }
};

//学员列表
const studentList = async () => {
  const res: any = await studentlist({
    ...params.value,
    depid: data.value ? data.value[data.value.length - 1] : 0,
    key: data.key,
    classid: data.value ? data.value[data.value.length - 1] : 0,
  });
  if (res.errCode === 10000) {
    data.tableData = res.data.list;
    data.total = res.data.counts;
  }
};
//添加
const add = async () => {
  studadd.value.dialogVisible = true

};
//弹出学生批量添加
const adds = ()=>{
  isImport.value = true
}
const imports = (e:any) => {
  console.log('父组件',e);
}
const isImports = (e:any) => {
  isImport.value = e
}

//修改
const update = (data:any) => {
  studup.value.dialogVisible = true
  studup.value.ruleForm.list = data
  obj.value = data
}
//点击修改密码
const pass = (data:any)=>{
  studpass.value.dialogVisible = true
  studpass.value.data = data
}
//删除接口
const dell = async (ids: number) => {
  const res: any = await studentdel({ id: ids });
  if (res.errCode === 10000) {
    ElMessage.success('删除成功');
    studentList();
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
//批量删除接口
const dells = async () => {
  const res: any = await studentdelall({ ids: ids.value });
  if (res.errCode === 10000) {
    ElMessage.success('删除成功');
    studentList();
  } else {
    ElMessage.error(res.errMsg);
  }
};

//批量删除
const dels = async () => {
  const conf = await ElMessageBox.confirm('是否永久删除此文件', '提示', {
    cancelButtText: '取消',
    confirmButtonText: '确定',
    type: 'warning',
  }).catch((error: any) => {
    ElMessage.error('已取消删除');
  });
  if (conf) dells();
};
//查询
const onSubmit = () => {
  console.log('hello');
  studentList();
};

//分页
const handleSizeChange = (val: number) => {
  studentList();
};
const handleCurrentChange = (val: number) => {
  studentList();
};

//页面加载
onMounted(() => {
  //学生列表
  studentList();
  //部门级联
  departmentList();
  // 班级列表
  getclasseslist();
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
.el-button--text {
  margin-right: 15px;
}
.el-select {
  width: 300px;
}
.el-input {
  width: 300px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
