<template>
  <div>
    <div class="title">
      <div class="kao">考试管理</div>
      <div>
        <el-button type="primary">创建考试</el-button>
      </div>
    </div>

    <div>
      <el-form :model="data" label-width="60px">
        <el-row>
          <el-col :span="3">
            <el-form-item label="关键字">
              <el-input v-model="data.key" placeholder="考试名称" />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="创建人">
              <el-input v-model="data.admin" placeholder="创建人" />
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-checkbox-group v-model="data.ismy" class="p">
              <el-checkbox label="我创建的" name="type" />
            </el-checkbox-group>
          </el-col>
          <el-col :span="4">
            <el-form-item label="开放时间" label-width="70px" class="o">
              <el-radio-group v-model="data.opentime">
                <el-radio label="永久开放" />
                <el-radio label="部分时段" />
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <div class="demo-range">
              <el-time-picker
                v-model="data.begindate"
                is-range
                range-separator="To"
                start-placeholder="Start time"
                end-placeholder="End time"
              />
            </div>
          </el-col>
          <el-col :span="2">
            <el-form-item label="状态">
              <el-select v-model="data.begindate" placeholder="请选择">
                <el-option label="Zone one" value="shanghai" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="TexLis">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="datas" style="width: 100%">
      <el-table-column prop="title" label="考试名称" width="180" />
      <el-table-column prop="state" label="状态" width="180" />
      <el-table-column prop="scores" label="总分" />
      <el-table-column prop="pastscores" label="通过分数" />
      <el-table-column prop="studentcounts" label="考试人数" />
      <el-table-column prop="studentScores" label="通过人数" />
      <el-table-column prop="begintime" label="开放时间" />
      <el-table-column prop="admin" label="创建人" />
      <el-table-column prop="addtime" label="更新时间" />
      <el-table-column label="操作"></el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="data.page"
      v-model:page-size="data.psize"
      :page-sizes="[5, 10, 15, 20]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="form.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { TextList } from '../../../../api/admin';
import { ref, onMounted, toRefs } from 'vue';
import { da } from 'element-plus/es/locale';
const value1 = ref<[Date, Date]>([
  new Date(2016, 9, 10, 8, 40),
  new Date(2016, 9, 10, 9, 40),
]);
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  TexLis();
};
const handleCurrentChange = (val: number) => {
  TexLis();

  console.log(`current page: ${val}`);
};
const form: any = reactive({
  data: {
    page: '1',
    psize: '5',
    admin: '',
    key: '',
    ismy: null,
    opentime: null,
    begindate: '',
    enddate: '',
    state: null,
    isread: null,
    result: '',
  },
  datas: [],
  total: '',
});

const TexLis = async () => {
  const res = await TextList(form.data);
  form.datas = res.data.list;
  form.total = res.data.counts;
  console.log(res);
  // TexLis();
};

const onSubmit = () => {
  console.log('submit!');
};
onMounted(() => {
  TexLis();
});
const { datas, data } = toRefs(form);
</script>

<style lang="less" scoped>
.title {
  justify-content: space-between;
  display: flex;
}
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
.kao {
  font-size: 20px;
  margin-bottom: 15px;
}
</style>
