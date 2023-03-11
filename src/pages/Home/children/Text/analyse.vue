<template>
  <div class="box">
    <div class="top">
      <el-page-header @back="goBack">
        <template #content>
          <span class="text-large font-600 mr-3">
            数据分析 ：{{ analyse.title }}
          </span>
        </template>
      </el-page-header>
    </div>
    <div class="content">
      <p>总分：{{ analyse.scores }}</p>
      <span> | </span>
      <p>通过分数：{{ analyse.pastscores }}</p>
      <span> | </span>
      <p>考试时长:{{ analyse.limittime }}分钟</p>
      <span> | </span>
      <p>
        考试时间：{{
          analyse.begintime == null
            ? '时间不限'
            : analyse.begintime + '至' + analyse.endtime
        }}
      </p>
    </div>
    <div class="echart">
      <div class="cake" ref="cake"></div>
      <div class="postzi" ref="postzi"></div>
    </div>
    <div class="tabbox">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="学员统计" name="first">
          <div class="studentFormBox">
            <div class="studentForm">
              <el-form
                :inline="true"
                :model="formInline"
                class="demo-form-inline"
              >
                <el-form-item label="学员姓名">
                  <el-input v-model="formInline.key" placeholder="学员姓名" />
                </el-form-item>
                <el-form-item label="部门 ">
                  <el-cascader
                    v-model="formInline.depid"
                    :options="departList"
                    :props="{ value: 'id', label: 'name' }"
                    @change="handleChange"
                  />
                </el-form-item>
                <el-form-item label="班级 ">
                  <el-select v-model="formInline.classid" placeholder="请选择">
                    <el-option
                      :label="item.name"
                      :value="item.id"
                      v-for="item in classlist"
                      :key="item.id"
                    />
                    <!-- <el-option label="Zone two" value="beijing" /> -->
                  </el-select>
                </el-form-item>
                <el-form-item label="状态">
                  <el-select
                    v-model="formInline.stateVal"
                    clearable
                    placeholder="选择状态"
                    style="width: 100px"
                    @change="changeState"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit">查询</el-button>
                  <el-button @click="">导出</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="studentList">
              <el-table :data="stuList" style="width: 100%">
                <el-table-column prop="name" label="学员姓名" width="180" />
                <el-table-column prop="depname" label="部门" width="180" />
                <el-table-column prop="classname" label="班级" width="180" />
                <el-table-column prop="scores" label="分数" width="280" />
                <el-table-column prop="pass" label="通过情况" width="180">
                  <span :class="stuList.pass == 1 ? 'green' : 'red'">{{
                    stuList.pass == 1 ? '已通过' : '未通过'
                  }}</span>
                </el-table-column>
                <el-table-column prop="name" label="用时" width="180">
                  <template #default="scope">
                    <span>{{
                      moment(scope.row.stuEndTime).diff(scope.row.stuBeginTime)
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="stuBeginTime"
                  label="考试时间"
                  width="180"
                />
                <el-table-column
                  prop="stuEndTime"
                  label="交卷时间"
                  width="180"
                />

                <el-table-column fixed="right" label="操作" width="180">
                  <template #default="scope">
                    <el-button
                      link
                      type="primary"
                      size="small"
                      @click="handleClick(scope.row)"
                      >查看</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 试题详情 -->
    <Studetails
      :table="table"
      @close="handleClose"
      :forResultItem="forResultItem"
      :ForResultList="ForResultList"
    ></Studetails>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import * as echarts from 'echarts';
import type { TabsPaneContext } from 'element-plus';
import moment from 'moment';
import router from '@/router';
import {
  testAnalyse,
  studentTest,
  departmentList,
  classList,
  getForResult,
} from '../../../../api/test';
import Studetails from '../../../../components/examDetails.vue';
const Route = useRoute();

onMounted(() => {
  init();
  console.log(Route.query);
});

const formInline: any = reactive({
  testid: Route.query.data,
  user: '',
  depid: '',
  classid: '',
  stateVal: '', //状态选中的值
  // state:0,
});
const options: any = ref([
  //表单状态的数据
  {
    value: '0',
    label: '所有',
  },
  {
    value: '1',
    label: '通过',
  },
  {
    value: '2',
    label: '未通过',
  },
]);
// 分析
let analyse: any = ref([]);
let getAnalyse = async () => {
  let res: any = await testAnalyse({ testid: Route.query.data });
  console.log(res);

  if (res.errCode == 10000) {
    analyse.value = res.data.model;
    console.log(analyse.value);
  }
};
getAnalyse();
// 学员列表
const data = reactive({
  params: {
    testid: Route.query.data,
    name: '',
  },
});
const { params } = toRefs(data);
// 学员列表
let stuList: any = ref([]);
const getStulist = async () => {
  let res: any = await studentTest(formInline);
  console.log(res);
  if (res.errCode == 10000) {
    stuList.value = res.data.list;
  }
};
getStulist();
// 部门
let departList = ref([]);
const getdepartmentList = async () => {
  let res: any = await departmentList({});
  // console.log(res);
  if (res.errCode == 10000) {
    departList.value = res.data.list;
  }
};
getdepartmentList();
let classlist: any = ref([]);
const getClassList = async () => {
  let res: any = await classList({ depid: formInline.depid });
  // console.log(res,999999);
  if (res.errCode == 10000) {
    classlist.value = res.data.list;
  }
};
getClassList();

// const value = ref([])
const handleChange = (value: any) => {
  // console.log(value)
  if (value) {
    formInline.depid = value.at(-1);
    // console.log( formInline.depid);
    getClassList();
  }
};
// 改变状态
const changeState = (val: any) => {
  formInline.state = Number(val);
};
const onSubmit = () => {
  getStulist();
};
// echarts图表
const cake = ref(); // 使用ref创建虚拟DOM引用，使用时用main.value  饼状
const postzi = ref(); // 使用ref创建虚拟DOM引用，使用时用main.value   柱状
onMounted(() => {
  init();
  info1();
});
function init() {
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(cake.value);
  var option;

  option = {
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
            fontSize: '40',
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: '通过' },
          { value: 580, name: 'Email' },
          { value: 484, name: '未通过' },
          { value: 300, name: 'Video Ads' },
        ],
      },
    ],
  };

  option && myChart.setOption(option);
}
// 图表配置
const option = {
  xAxis: {
    data: [
      '30分以下',
      '30-40',
      '40-50',
      '50-60',
      '60-70',
      '70-80',
      '80-90',
      '90以上',
    ],
  },
  yAxis: {},
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130, 123],
      type: 'bar',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)',
      },
    },
  ],
};
// 柱状
function info1() {
  var myChart = echarts.init(postzi.value);
  myChart.setOption(option);
}

const activeName = ref('first');

// 试题详情
const table = ref(false);
let ForResultList = ref([]);
let forResultItem = ref('');
const handleClick = async (val: any) => {
  // console.log(val);
  table.value = true;
  let res: any = await getForResult({
    testid: Route.query.data,
    studentid: val.id,
  });
  // console.log(res);
  if (res.errCode == 10000) {
    ForResultList.value = res.data;
    forResultItem.value = val;
  }
};
const goBack = () => {
  router.push('/test');
};
const handleClose = () => {
  table.value = false;
};
// // 获取学生考试结果
// const getForResultList=()=>{
//     let res:any=await
// }
</script>

<style lang="less" scoped>
.box {
  background-color: white;
  .content {
    margin-top: 20px;
    width: 700px;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
  }

  .cake {
    width: 100%;
    height: 340px;
  }

  .postzi {
    width: 100%;
    height: 340px;
  }

  .echart {
    display: flex;
  }

  .demo-tabs > .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
  }

  .studentList {
    .red {
      color: red;
    }

    .green {
      color: aquamarine;
    }
  }
}
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
</style>
