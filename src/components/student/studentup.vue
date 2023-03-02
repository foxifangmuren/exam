<template>
  <div>
    <el-dialog v-model="dialogVisible" title="添加">
      <el-form :model="form">
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="form.list.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.list.photo" autocomplete="off" />
        </el-form-item>
        <el-form-item label="部门" :label-width="formLabelWidth">
          <el-cascader
            v-model="form.list.depid"
            :options="form.options"
            :props="porps"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="班级" :label-width="formLabelWidth">
          <el-cascader
            v-model="form.list.classid"
            :options="form.Class"
            :props="porps"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="form.list.remarks" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button>取消</el-button>
          <el-button type="primary">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, toRefs } from 'vue';
import {departmentlist,classeslist} from '../../api/admin'
const dialogVisible=ref(false)
const formLabelWidth = '140px'
const form = reactive({
  list:{
    id:0,
    photo:'',
    name:'',
    classid:1,
    depid:'',
    remarks:'', //备注
  },
  params: {
    classid: 0,
    name: '',
    depname: '',
    page: 1,
    psize: 10,
    
  },
  Class:[],
  options:[]
})
const porps = {
  value: 'id',
  label: 'name',
}

//部门级联调接口
const departmentList = async () => {
  const res: any = await departmentlist(form.params);
  console.log('部门级联', res);
  if (res.errCode === 10000) {
    form.options = res.data.list;
  }
};
// 班级级联列表
const getclasseslist = async () => {
  const res: any = await classeslist(form.params);
  console.log('班级列表', res);
  if (res.errCode === 10000) {
    form.Class = res.data.list;
  }
};
onMounted(()=>{
  departmentList();
  getclasseslist();
})
</script>

<style scoped>

</style>