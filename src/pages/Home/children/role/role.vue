<template>
  <div class="box">
    <!-- 头部 -->
    <div class="header">
      <span class="head">角色管理</span>
      <el-button type="primary" @click="dialogFormVisible = true"
        >添加角色</el-button
      >
    </div>

    <!-- 添加弹出框 -->
    <el-dialog v-model="dialogFormVisible" title="添加">
      <el-form :model="form">
        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <div v-for="(item, index) in state.list" :key="item.id">
            <!-- {{ item.name }}
        <div style="margin-left:50px" v-for="item2 in item.children">
        {{item2.name  }}
      
      </div> -->
            {{ item.ced }}
            <el-checkbox
              v-model="item.ced"
              :indeterminate="item.isIndeterminate"
              @change="handleCheckAllChange(index)"
              >{{ item.name }}</el-checkbox
            >
            {{ item.checkedCities }}
            <el-checkbox-group
              v-model="item.checkedCities"
              style="margin-left: 50px"
            >
              <el-checkbox
                @change="handleCheckedCitiesChange(index)"
                v-for="item2 in item.children"
                :key="item2.id"
                :label="item2.id"
                >{{ item2.name }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="add"> 添加 </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 表格 -->
    <div class="content">
      <div>
        <el-table
          ref="multipleTableRef"
          :data="data.tableData"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          stripe 
        >
          <el-table-column property="name" label="学生姓名" />
          <el-table-column label="操作" width="120" #default="scope">
            <span class="zi" style="cursor: pointer">编辑</span>
            <span class="zi" style="cursor: pointer" @click="del(scope.row.id)"
              >删除</span
            >
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
import { ElMessageBox, ElMessage } from 'element-plus';
import { onMounted, reactive, ref, toRefs } from 'vue';
import { rolelist, roledel, roleadd } from '../../../../api/admin';
import{menuList} from '../../../../api/role'
const dialogFormVisible = ref(false);
const formLabelWidth = '140px';
const data = reactive({
  //表格数据
  tableData: [],
  //列表参数
  params: {
    page: 1,
    psize: 10,
  },
  key: '',
  //搜索
  value: [],
  //分页 总页数
  total: 0,
  ids: [],
});
// 解构数据
const { params } = toRefs(data);


const handleCheckAllChange = (index: number) => {
  console.log(123)
  let ids = state.list[index].children.map((item: any) => item.id);
  console.log(ids)
  if (
    state.list[index].checkedCities &&
    state.list[index].checkedCities.length > 0
  ) {
    state.list[index].checkedCities = [];
  } else {
    state.list[index].checkedCities = ids;
  }
};
const handleCheckedCitiesChange = (index: number) => {
  console.log(state.list[index].children)
  let cheeckLen = state.list[index].checkedCities.length;
  let allLen = state.list[index].children.length;
  console.log(allLen)
  state.list[index].isIndeterminate = false;
  if (cheeckLen == allLen) {
    state.list[index].ced = true;
  } else if (cheeckLen > 0) {
    state.list[index].isIndeterminate = true;
  } else {
    state.list[index].ced = false;
  }

  
};
const state = reactive<any>({
  list: []
});
const getMenuList=async ()=>{
  let res:any = await menuList(null)
  if(res.errCode===10000){
    state.list = res.data.list
  }
}


const form = reactive({
  id:0,
  name: '',
  menus:''
});
const props = {
  expandTrigger: 'hover',
  checkStrictly: true,
  value: 'id',
  label: 'name',
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

//班级列表
const rouleList = async () => {
  const res: any = await rolelist({
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
//添加
const add = async () => {
  // console.log(data.params.depname)
  console.log()
  console.log(form)
  const res: any = await roleadd(form);
  console.log('班级添加', res);
  if (res.errCode === 10000) {
    ElMessage.success('添加成功');
    dialogFormVisible.value = false;
    rouleList();
  }
};
//查询
const onSubmit = () => {
  console.log('hello');
  rouleList();
};
//删除的点击
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
//删除接口
const dell = async (ids: number) => {
  const res: any = await roledel({ id: ids });
  // console.log('删除',res)
  if (res.errCode === 10000) {
    ElMessage.success('删除成功');
    rouleList();
  } else {
    ElMessage.error(res.errMsg);
  }
};
//分页
const handleSizeChange = (val: number) => {
  rouleList();
};
const handleCurrentChange = (val: number) => {
  rouleList();
};

//页面加载
onMounted(() => {
  //角色列表
  rouleList();
  //权限列表
  getMenuList()
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

.demo-pagination-block {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}
</style>
