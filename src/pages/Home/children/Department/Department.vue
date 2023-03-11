<template>
  <div>
    <div class="title">
      <div class="kao">部门管理</div>
      <div>
        <el-button type="primary" class="add" @click="add"
          >添加一级节点</el-button
        >
      </div>
    </div>
    <div class="zong">
      <div class="left" v-loading="loading">
        <el-tree
          
          :data="tabledata.arr"
          :props="defaultProps"
          @node-click="handleNodeClick"
          default-expand-all
        />
      </div>

      <div class="right" v-show="show">
        <el-form
          ref="ruleFormRef"
          :model="all.adddata"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
        >
          <el-form-item label="当前节点:" v-show="all.name"
            >{{ all.name }}
          </el-form-item>
          <el-form-item label="节点名称" prop="name">
            <el-input v-model="all.adddata.name" />
          </el-form-item>
          <el-button
            class="a"
            type="primary"
            @click="adds"
            v-show="all.name == ''"
            >添加一级节点</el-button
          >
          <el-button class="a" type="info" @click="Delete" v-show="all.name"
            >删除当前节点</el-button
          >
          <el-button type="success" @click="update" v-show="all.name"
            >修改当前节点</el-button
          >
          <el-button type="primary" @click="adds" v-show="all.name"
            >添加子节点</el-button
          >
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { add } from 'lodash';
import { onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  departmentlist,
  departmentadd,
  departmentdelete,
} from '../../../../api/admin';
//部门添加
const loading = ref(true)
const add = () => {
  all.id = ''
  all.name = ''
  all.adddata.pid =''
  ruleForm.pid = ''
  ruleForm.id = ''
  // console.log(show);
  show.value = true;
  all.name = '';
  all.adddata.name == '';
};

const adds = async () => {
  if (all.adddata.name == '') {
    return false;
  }
  const res: any = await departmentadd(all.adddata);
  all.adddata.name = '';
  if (res.errCode == '10000') {
    ElMessage({
      message: '添加成功',
      type: 'success',
    });
  } else {
    ElMessage.error('添加失败');
  }
  all.adddata.name == '';
  De();
};

//部门修改
const update = async () => {
  // all.adddata.id = all.id;
  // all.adddata.name = all.name;
  console.log(all.adddata);
  ruleForm.name = all.adddata.name;
  if (all.adddata.name == '') {
    return false;
  }
  const res: any = await departmentadd(ruleForm);
  if (res.errCode == '10000') {
    ElMessage({
      message: '修改成功',
      type: 'success',
    });
  } else {
    ElMessage.error('修改失败');
  }
  console.log(res);
  all.adddata.name = '';
  De();
};
const Delete = async () => {
  ElMessageBox.confirm(
    '确定要删除这个部门吗',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      const res: any = await departmentdelete({ id: all.id });
      ElMessage({
        type: 'success',
        message: '删除成功',
      });
      De();
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '删除 失败',
      });
    });
};

const formSize = ref('default');
const ruleFormRef = ref<any>();
const tabledata = reactive({ arr: [] });
const ruleForm = reactive({
  name: '',
  pid: '',
  id: '',
});
const rules = reactive<any>({
  name: [
    { required: true, message: '请输入节点名称', trigger: 'blur' },
    // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
});
const De = async () => {
  loading.value = true
  const res:any = await departmentlist(null);
  if(res.errCode===10000){
    tabledata.arr = res.data.list;
    loading.value = false
  }
  
  // console.log(tabledata.arr);
};
const show = ref(false);
const all: any = reactive({
  id: '',
  name: '',
  adddata: {
    id: 0,
    pid: '',
    name: '',
  },
});
const handleNodeClick = (val: any) => {
  console.log(val);
  // console.log(val);
  all.id = val.id;
  all.name = val.name;
  all.adddata.pid = val.id;
  show.value = true;
  ruleForm.pid = val.pid;
  ruleForm.id = val.id;
};
const defaultProps = {
  children: 'children',
  label: 'name',
};
onMounted(() => {
  De();
});
</script>

<style lang="less" scoped>
.right {
  .a {
    margin-left: 50px;
  }
}
.zong {
  display: flex;
}
.el-tree {
  margin-left: 20px;
}
.left {
  width: 30%;
  height: 780px;
  overflow: auto;
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
  margin-bottom: 10px;
}
</style>
