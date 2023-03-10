<template>
  <div>
    <div>
      <div>
        <div class="one">
          <div>返回</div>
          <span>|</span>
          <div>数据分析:{{ datas.title }}</div>
        </div>
        <div class="one">
          <div>总分:{{ datas.scores }}</div>
          <span>|</span>
          <div>通过分数:{{ datas.pastscores }}</div>
          <span>|</span>
          <div>考试时长</div>
          <span>|</span>
          <div>考试时间:时间不限</div>
        </div>
      </div>
      <div class="two">
        <div id="yuan" style="width: 350px; height: 350px"></div>
        <div id="main" style="width: 900px; height: 350px"></div>
      </div>
    </div>
    <div>
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="学生统计" name="first">
          <el-form :model="form" label-width="120px">
            <el-row :gutter="20">
              <el-form-item label="考试名称">
                <el-input v-model="form.name" />
              </el-form-item>
              <el-form-item label=" 部门">
                <el-select v-model="form.name" placeholder="请选择">
                  <el-option label="Zone one" value="shanghai" />
                  <el-option label="Zone two" value="beijing" />
                </el-select>
              </el-form-item>
              <el-form-item label="班级">
                <el-select v-model="form.name" placeholder="请选择">
                  <el-option label="Zone one" value="shanghai" />
                  <el-option label="Zone two" value="beijing" />
                </el-select>
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="form.name" placeholder="请选择">
                  <el-option label="Zone one" value="shanghai" />
                  <el-option label="Zone two" value="beijing" />
                </el-select>
              </el-form-item>
              <el-button type="primary">查询</el-button>
              <el-button>导出</el-button>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="学员姓名" width="180" />
        <el-table-column prop="name" label="部门" width="180" />
        <el-table-column prop="name" label="班级" width="180" />
        <el-table-column prop="name" label="分数" width="180" />
        <el-table-column prop="name" label="通过情况" width="180" />
        <el-table-column prop="name" label="用时" width="180" />
        <el-table-column prop="name" label="考卷时间" width="180" />
        <el-table-column prop="name" label="交卷时间" width="180" />
        <el-table-column prop="address" label="操作" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { onMounted, toRefs, ref, reactive } from 'vue';
import { getTest } from '../../../../api/stutest';
import * as echarts from 'echarts';
const route = useRoute();
const router = useRouter();
const testid = ref(route.query.data);

const k = async () => {
  console.log(testid.value);
  const res = await getTest({ id: testid.value });
  console.log(res);

  form.datas = res.data;
  console.log(form.datas);
};

const tableData: any = [
  {
    date: '',
    name: '',
    address: '',
  },
];
const form:any = reactive({
  name: '',
  datas: [],
});
const activeName = ref('first');

const handleClick = (tab: any, event: any) => {
  console.log(tab, event);
};
onMounted(() => {
  k();
  var chartDom: any = document.getElementById('main');
  var myChart = echarts.init(chartDom);
  var option;

  option = {
    xAxis: {
      type: 'category',
      data: [
        '30分以下',
        '',
        '40-50 ',
        'Thu',
        '60-70',
        'Sat',
        '80-90',
        '',
        '100-110',
        '',
        '120-130',
        '',
        '140-150',
        '',
      ],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)',
        },
      },
    ],
  };

  option && myChart.setOption(option);
  var chart: any = document.getElementById('yuan');
  var myChar = echarts.init(chart);
  var optio;

  optio = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: '5%',
      left: 'center',
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 0, name: '未考' },
          { value: 0, name: '及格' },
          { value: 0, name: '粑粑' },
          { value: 1, name: '不及格' },
        ],
      },
    ],
  };

  optio && myChar.setOption(optio);
});
const { datas } = toRefs(form);
</script>

<style lang="less" scoped>
:deep(.el-select) {
  width: 200px;
}
// /deep/.el-input {
//   width: 100px;
// }
.one {
  margin-top: 20px;
  display: flex;
  span {
    margin-left: 20px;
    margin-right: 20px;
  }
}
.two {
  display: flex;
  padding-left: 260px;
  justify-content: space-between;
}
</style>
