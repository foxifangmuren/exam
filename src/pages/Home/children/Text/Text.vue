<template>
  <div>
    <p>考试管理</p>
    <el-form :model="form" label-width="60px">
        <el-form-item label="关键字">
          <el-col :span="11">
            <el-input v-model="form.name" placeholder="考试名称" />
            </el-col>
        </el-form-item>
        <el-form-item label="创建人">
          <el-col :span="11">

            <el-input v-model="form.name" placeholder="创建人" />
            </el-col>
        </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

// do not use same name with ref
const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
});

const onSubmit = () => {
  console.log('submit!');
};
</script>

<style lang="less" scoped>

.el-form{
  display: flex;
}
p {
  font-size: 25px;
}
</style>
