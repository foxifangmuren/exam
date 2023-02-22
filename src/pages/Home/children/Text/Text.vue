<template>
  <div>
    <p>考试管理</p>
    <div>
      <el-form :model="form" label-width="60px">
        <el-row>
          <el-col :span="3">
            <el-form-item label="关键字">
              <el-input v-model="form.name" placeholder="考试名称" />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="创建人">
              <el-input v-model="form.name" placeholder="创建人" />
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-checkbox-group v-model="form.type" class="p">
              <el-checkbox label="我创建的" name="type" />
            </el-checkbox-group>
          </el-col>
          <el-col :span="4">
            <el-form-item label="开放时间" label-width="70px" class="o">
              <el-radio-group v-model="form.resource">
                <el-radio label="永久开放" />
                <el-radio label="部分时段" />
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <div class="demo-range">
              <el-time-picker
                v-model="value1"
                is-range
                range-separator="To"
                start-placeholder="Start time"
                end-placeholder="End time"
              />
            </div>
          </el-col>
          <el-col :span="2">
            <el-form-item label="状态">
              <el-select v-model="form.region" placeholder="请选择">
                <el-option label="Zone one" value="shanghai" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="Date" width="180" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="address" label="Address" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { ref } from 'vue';
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
];
const value1 = ref<[Date, Date]>([
  new Date(2016, 9, 10, 8, 40),
  new Date(2016, 9, 10, 9, 40),
]);
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
.o {
  margin-left: 20px;
}
.p {
  margin: 0 10px;
}
.el-button {
  margin-left: 10px;
}
.el-select {
  width: 100px;
}
.el-row {
  width: 100%;
}
.el-form {
  display: flex;
}
p {
  font-size: 20px;
  margin-bottom: 15px;
}
</style>
