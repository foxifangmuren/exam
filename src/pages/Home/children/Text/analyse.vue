<template>
  <div>
    <div>
      <div>
        <div class="one">
          <div>返回</div>
          <span>|</span>
          <div>数据分析:考试名</div>
        </div>
        <div class="one">
          <div>总分</div>
          <span>|</span>
          <div>通过分数</div>
          <span>|</span>
          <div>考试时长</div>
          <span>|</span>
          <div>考试时间</div>
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
            <el-form-item label="Activity name">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="Activity zone">
              <el-select
                v-model="form.name"
                placeholder="please select your zone"
              >
                <el-option label="Zone one" value="shanghai" />
                <el-option label="Zone two" value="beijing" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="form.name"
                placeholder="Please input"
                clearable
              />
            </el-form-item>
            <el-form-item label="Activity zone">
              <el-select
                v-model="form.name"
                placeholder="Activity zone"
              >
                <el-option label="Zone one" value="shanghai" />
                <el-option label="Zone two" value="beijing" />
              </el-select>
            </el-form-item>
            <el-button type="primary">查询</el-button>
            <el-button>导出</el-button>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue';
import * as echarts from 'echarts';

const form = reactive({
  name: '',
});
const activeName = ref('first');

const handleClick = (tab: any, event: any) => {
  console.log(tab, event);
};
onMounted(() => {
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
          { value: 1048, name: '未考' },
          { value: 735, name: '及格' },
          { value: 580, name: '粑粑' },
          { value: 484, name: '不及格' },
        ],
      },
    ],
  };

  optio && myChar.setOption(optio);
});
</script>

<style lang="less" scoped>
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
