<template>
  <div>
    <div class="title">创建考试</div>
    <div class="basic">
      <div class="one">
        <span class="ones">1</span>
        <span>基本信息</span>
      </div>
      <el-form
        :label-position="labelPosition"
        label-width="100px"
        :model="AddFrom"
        style="max-width: 460px"
      >
        <el-form-item label="考试名称">
          <el-input v-model="AddFrom.title" />
        </el-form-item>
        <el-form-item label="考试说明">
          <el-input v-model="AddFrom.info" type="textarea" />
        </el-form-item>
      </el-form>
    </div>
    <div class="setup">
      <div class="one">
        <span class="ones">2</span>
        <span>内容设置</span>
      </div>
      <el-form
        :label-position="labelPosition"
        label-width="100px"
        :model="AddFrom"
        style="max-width: 1100px"
      >
        <el-form-item label="考试内容:">
          <div class="shiti">
            <div class="er">
              <div>
                <h3>试题列表</h3>
              </div>
              <div>
                <span>总分:0</span>
                <span>已添加零题</span>
                <el-button @click="Wrodata.isshow = 0">清空</el-button>
              </div>
            </div>
            <div class="ty" v-if="Wrodata.isshow == 1">
              <div
                class="yt"
                v-for="(item, index) in Wrodata.questions"
                :key="item.id"
              >
                <div class="abc">
                  <div>
                    {{ index + 1 }}.{{
                      item.type
                    }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span>分值</span>&nbsp;
                    <el-input v-model="item.scores"></el-input>
                  </div>

                  <div>
                    <el-icon :size="20"><EditPen /></el-icon>
                    <el-icon :size="20" @click="delti(index)"
                      ><DeleteFilled
                    /></el-icon>
                  </div>
                </div>
                <div>&nbsp;&nbsp;{{ item.title }}</div>
                <div
                  v-for="ite in item.answers"
                  :class="item.answer.includes(ite.answerno) ? 'liang' : 'hei'"
                  key="ite.id"
                >
                  <span
                    >&nbsp;&nbsp;{{ ite.answerno }}: &nbsp;{{
                      ite.content
                    }}</span
                  >
                </div>
                <div
                  class="lian"
                  v-if="
                    item.type == '填空题'
                      ? true
                      : item.type == '判断题'
                      ? true
                      : false
                  "
                >
                  &nbsp;&nbsp; 正确答案:{{ item.answer }}
                </div>
                <div
                  class="daan"
                  v-if="
                    item.type == '填空题'
                      ? true
                      : item.type == '问答题'
                      ? true
                      : false
                  "
                >
                  答案解析：{{ item.explains }}
                </div>
              </div>
            </div>
            <div class="san">
              <el-button @click="goadd">添加题目</el-button>
              <el-button>批量导入</el-button>
              <el-button @click="dialoe = true">从题库中导入</el-button>
              <el-button @click="dialogTableVisible = true"
                >选择已有试卷</el-button
              >
            </div>
          </div>
        </el-form-item>
        <el-form-item label="试题存入题库">
          <el-select v-model="AddFrom.num" placeholder="请选择题库">
            <el-option v-for="item in Wrod.datas.title" />
          </el-select>
          <el-button @click="dialogFormVisible = true">+创建试题库</el-button>
        </el-form-item>
      </el-form>
      <!-- 弹出框 -->
      <div>
        <el-dialog v-model="dialogFormVisible" title="题库添加">
          <el-form :model="form">
            <el-form-item label="题库名称">
              <el-input
                v-model="form.name"
                autocomplete="off"
                placeholder="请输入题库名称"
                style="width: 200px"
              />
            </el-form-item>
            <el-form-item label="被他人使用">
              <el-radio-group>
                <el-radio :label="3">允许所有老师使用</el-radio>
                <el-radio :label="6">不允许任何老师使用</el-radio>
                <el-radio :label="9" @click="chuanSuoKuang = true"
                  >允许部分老师使用</el-radio
                >
                <div>
                  <el-dialog v-model="chuanSuoKuang" title="可见老师">
                    <div style="margin-left: 20px; margin-bottom: 20px">
                      <el-form-item label="部门">
                        <el-cascader clearable />
                      </el-form-item>
                    </div>
                    <div style="margin-left: 20px">
                      <el-transfer />
                    </div>

                    <template #footer>
                      <span class="dialog-footer">
                        <el-button @click="chuanSuoKuang = false"
                          >取消</el-button
                        >
                        <el-button
                          type="primary"
                          @click="chuanSuoKuang = false"
                        >
                          确定
                        </el-button>
                      </span>
                    </template>
                  </el-dialog>
                </div>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取消</el-button>
              <el-button type="primary" @click="dialogFormVisible = false">
                确定
              </el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </div>
    <div class="set">
      <div class="one">
        <span class="ones">3</span>
        <span>考试设置</span>
      </div>
      <el-form
        :label-position="labelPosition"
        label-width="100px"
        :model="AddFrom"
        style="max-width: 800px"
      >
        <el-form-item label="通过分数:">
          <el-input-number
            v-model="AddFrom.scores"
            class="mx-4"
            :min="1"
            controls-position="right"
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item label="考试时长:">
          <el-radio-group v-model="AddFrom.limittime" class="num">
            <el-radio label="不限时时长" />
            <el-radio label="限时时长" />
          </el-radio-group>
          <el-input-number
            v-model="AddFrom.limittime"
            class="mx-4"
            :min="1"
            controls-position="right"
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item label="开放时间:">
          <div class="block">
            <el-date-picker
              v-model="AddFrom.begintime"
              type="datetimerange"
              :shortcuts="shortcuts"
              range-separator="To"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
            <span>不填表示永久</span>
          </div>
        </el-form-item>
        <el-form-item label="答案解析">
          <el-radio-group v-model="AddFrom.isshow">
            <el-radio :label="1" size="large">交卷后显示</el-radio>
            <el-radio :label="2" size="large">不允许查看</el-radio>
            <el-radio :label="3" size="large">仅可查看对错</el-radio>
            <el-radio :label="4" size="large">仅查看错题</el-radio>
            <el-radio :label="5" size="large">考试结束后查看</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="防作弊:">
          <el-checkbox-group v-model="AddFrom.markteachers">
            <el-checkbox label="试题顺序打乱" name="type" />
            <el-checkbox
              label="选项顺序打乱（单选题，多选题，判断题）"
              name="type"
            />
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </div>
    <div class="Teacher">
      <div class="one">
        <span class="ones">4</span>
        <span>教师范围</span>
      </div>
      <el-form
        :label-position="labelPosition"
        label-width="100px"
        :model="AddFrom"
        style="max-width: 1100px"
      >
        <el-form-item label="可见老师">
          <el-badge :value="0" class="item" type="primary">
            <el-button>+选择</el-button>
          </el-badge>
        </el-form-item>
      </el-form>
    </div>
    <div class="Teacher">
      <div class="one">
        <span class="ones">5</span>
        <span>考试学生</span>
      </div>
      <el-form
        :label-position="labelPosition"
        label-width="100px"
        :model="AddFrom"
        style="max-width: 1100px"
      >
        <el-form-item label="考试范围">
          <el-badge :value="0" class="item" type="primary">
            <el-button @click="dialogVisible1 = true">+选择</el-button>
          </el-badge>
        </el-form-item>
      </el-form>
    </div>
    <div class="Teacher">
      <div class="one">
        <span class="ones">6</span>
        <span>协同设置</span>
      </div>
      <el-form
        :label-position="labelPosition"
        label-width="100px"
        :model="AddFrom"
        style="max-width: 1100px"
      >
        <el-form-item label="阅卷老师">
          <el-badge :value="0" class="item" type="primary">
            <el-button @click="yueJuanTan = true">+选择</el-button>
          </el-badge>
        </el-form-item>
      </el-form>
    </div>
    <div class="add">
      <el-button type="primary" @click="TestAdd(1)">发布</el-button>
      <el-button @click="TestAdd(2)">保存(不发布)</el-button>
      <el-button> <router-link to="test">取消</router-link></el-button>
    </div>
    <el-dialog v-model="dialo" title="题库列表" width="80%">
      <el-form class="demo-form-inline" :inline="true" :model="from.query">
        <el-form-item label="题库名称">
          <el-input
            v-model="from.query.key"
            placeholder="请输入题库名称"
            @keyup.enter="onSubmit"
          />
        </el-form-item>
        <el-form-item label="创建人">
          <el-input
            v-model="from.query.admin"
            placeholder="请输入创建人"
            @keyup.enter="onSubmit"
          />
        </el-form-item>
        <el-form-item label="创建人">
          <el-checkbox v-model="checked" @change="check"
            >只看我创建的</el-checkbox
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" @keyup="onSubmit"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
      <MyTable
        @clickToFather="w"
        :isTypeSelection="true"
        :isshow="false"
        @goinfo="goinfo"
        @delarrinfo="delarrinfo"
        :tableHeader="tableHead"
        :tableData="fr.tableData"
      ></MyTable>
      <!-- 分页 -->
      <MyPages
        :total="fr.total"
        :page="fr.query.page"
        :psize="fr.query.psize"
        @changePageSize="changePageSi"
        @changePage="changePa"
      ></MyPages>
      <MyCDatadrawer :list="f.data" ref="mycdatadrawer"></MyCDatadrawer>
      <div class="shi">
        <el-button @click="dialo = false">取消</el-button>
        <el-button type="primary" @click="qi">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog v-model="dialoe" title="题库列表" width="80%">
      <el-form class="demo-form-inline" :inline="true" :model="from.query">
        <el-form-item label="题库名称">
          <el-input
            v-model="from.query.key"
            placeholder="请输入题库名称"
            @keyup.enter="onSubmit"
          />
        </el-form-item>
        <el-form-item label="创建人">
          <el-input
            v-model="from.query.admin"
            placeholder="请输入创建人"
            @keyup.enter="onSubmit"
          />
        </el-form-item>
        <el-form-item label="创建人">
          <el-checkbox v-model="checked" @change="check"
            >只看我创建的</el-checkbox
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" @keyup="onSubmit"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
      <MyTable
        @clickToFather="w"
        :isTypeSelection="false"
        :isshow="true"
        :tableHeader="tableHeade"
        :tableData="fro.tableData"
      ></MyTable>
      <!-- 分页 -->
      <MyPages
        :total="fro.total"
        :page="fro.query.page"
        :psize="fro.query.psize"
        @changePageSize="changePageSiz"
        @changePage="changePag"
      ></MyPages>
      <div class="shi">
        <el-button @click="dialoe = false">取消</el-button>
        <el-button type="primary" @click="zcc">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog v-model="dialogTableVisible" title="试题列表" width="80%">
      <el-form class="demo-form-inline" :inline="true" :model="from.query">
        <el-form-item label="题库名称">
          <el-input
            v-model="from.query.key"
            placeholder="请输入题库名称"
            @keyup.enter="onSubmit"
          />
        </el-form-item>
        <el-form-item label="创建人">
          <el-input
            v-model="from.query.admin"
            placeholder="请输入创建人"
            @keyup.enter="onSubmit"
          />
        </el-form-item>
        <el-form-item label="创建人">
          <el-checkbox v-model="checked" @change="check"
            >只看我创建的</el-checkbox
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" @keyup="onSubmit"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
      <MyTable
        @clickToFather="w"
        :isTypeSelection="false"
        :isshow="true"
        :tableHeader="tableHeader"
        :tableData="from.tableData"
      ></MyTable>
      <!-- 分页 -->
      <MyPages
        :total="from.total"
        :page="from.query.page"
        :psize="from.query.psize"
        @changePageSize="changePageSize"
        @changePage="changePage"
      ></MyPages>
      <div class="shi">
        <el-button @click="dialogTableVisible = false">取消</el-button>
        <el-button type="primary" @click="wwy">确定</el-button>
      </div>
    </el-dialog>
    <div>
      <el-dialog v-model="studentTan" title="学生考试列表">
        <div style="margin-left: 20px; margin-bottom: 20px; display: flex">
          <div>
            <el-form-item label="部门">
              <el-cascader
                v-model="dataq.value"
                :options="dataq.options"
                :props="props"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </div>
          <div style="margin-left: 20px">
            <el-form-item label="班级">
              <el-cascader clearable />
            </el-form-item>
          </div>
        </div>
        <div style="margin-left: 20px">
          <el-transfer />
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="studentTan = false">取消</el-button>
            <el-button type="primary" @click="studentTan = false">
              确定
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <!-- 可见弹出框 -->
    <div>
      <el-dialog v-model="keJianTan" title="可见老师">
        <div style="margin-left: 20px; margin-bottom: 20px">
          <el-form-item label="部门">
            <el-cascader
              v-model="dataq.value"
              :options="dataq.options"
              :props="props"
              @change="handleChange"
              clearable
            ></el-cascader>
          </el-form-item>
        </div>
        <div style="margin-left: 20px">
          <el-transfer />
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="keJianTan = false">取消</el-button>
            <el-button type="primary" @click="keJianTan = false">
              确定
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <!-- 阅卷老师弹出框 -->
    <div>
      <el-dialog v-model="yueJuanTan" title="阅卷老师">
        <div style="margin-left: 20px; margin-bottom: 20px">
          <el-form-item label="部门">
            <el-cascader
              v-model="dataq.value"
              :options="dataq.options"
              :props="props"
              @change="handleChange"
              clearable
            ></el-cascader>
          </el-form-item>
        </div>
        <div style="margin-left: 20px">
          <el-transfer />
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="yueJuanTan = false">取消</el-button>
            <el-button type="primary" @click="yueJuanTan = false">
              确定
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <!-- <el-dialog v-model="dialogVisible1" v-if="dialogVisible1">
      <Forth @isshow="isshoww" @valuesss="valuessss"></Forth>
    </el-dialog> -->
    <!-- <Drawer
      :isTitle="isTitle"
      v-if="isTitle"
      :index="index"
      @isF="isF"
      :obj="obj"
    ></Drawer> -->
  </div>
</template>

<script setup lang="ts">
// import Drawer from '../../../../components/Drawer.vue';
import { reactive, ref, onMounted, toRefs } from 'vue';
import { testadd } from '@/api/stutest';
import { useRouter, useRoute } from 'vue-router';
import { nextTick } from 'vue';
// import Forth from '../../../../components/ppp.vue';
import {
  questions,
  exportExcel,
  databasequestiondel,
  testdel,
} from '@/api/databaselist';
import { examList } from '@/api/exam';
import { departmentlist } from '../../../../api/admin';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getList, getTest } from '@/api/Subjects';
import { wy, databaseList } from '@/api/databaselist';
import Adddrawer from '@/components/Dataitem/adddrawer.vue';
const draweraddinfo = ref<any>();
const mycdatadrawer = ref<any>();
const goinfo = (vla: any) => {
  f.data = vla;
  mycdatadrawer.value.drawer = true;
};
const v = ref('');

const qi = () => {
  Wrod.Wrodata.questions = v.value;
  nextTick(() => {
    Wrod.Wrodata.isshow = 1;
  });
  dialo.value = false;
};
const numberValidateForm = reactive({
  limits: [],
});
const valuessss = (val: any) => {
  numberValidateForm.limits = val;
};
const dialogVisible1 = ref(false);
const isshoww = (val: any) => {
  dialogVisible1.value = false;
};
const delarrinfo = (val: any) => {
  v.value = val;
  console.log(v);
};
const f = reactive({
  data: {},
});
const router = useRouter();
// route接收参数
const route: any = useRoute();
let id = route.params['id'];

const goadd = () => {
  isTitle.value = true;
  // data.index = -1;
  // data.obj ={};
};
// const isF = (e: any) => {
//   isTitle.value = e;
// };
const studentTan = ref(false);
const keJianTan = ref(false);
//阅卷老师弹出框
const yueJuanTan = ref(false);
const dialogTableVisible = ref(false);
const dialoe = ref(false);
const dialo = ref(false);
const dialogFormVisible = ref(false);
const chuanSuoKuang = ref(false);

const tilist = async () => {
  const res = await examList(Wrod.data);
  Wrod.datas = res.data.list;
  console.log(res);
};
const props = {
  expandTrigger: 'hover', //次级菜单展开方式
  checkStrictly: true, //是否严格的遵守父子节点不相互关联
  value: 'id',
  label: 'name',
};
const dataq = reactive({
  //表格数据
  tableData: [],
  //列表参数
  params: {
    name: '',
    depname: '',
    page: 1,
    psize: 10,
  },
  key: '',
  //搜索
  value: [],
  //部门
  options: [],
  //角色
  options1: [],
  //分页 总页数
  total: 0,
});
const departmentList = async () => {
  const res: any = await departmentlist(null);
  console.log('部门级联', res);
  if (res.errCode === 10000) {
    dataq.options = res.data.list;
  }
};

//题库列表
const changePa = (val: number) => {
  fr.query.page = val;
  console.log(fro.query.page);

  getlist();
};
const changePageSi = (val: number) => {
  fr.query.psize = val;
  console.log(fro.query.psize);

  getlist();
};
const changePag = (val: number) => {
  fro.query.page = val;
  console.log(fro.query.page);

  getlist();
};
const changePageSiz = (val: number) => {
  fro.query.psize = val;
  console.log(fro.query.psize);

  getlist();
};
const getlist = async () => {
  const src = await databaseList(fro.query);
  console.log(src);

  fro.tableData = src.data.list;
  fro.total = src.data.counts;
};
const form = reactive({
  name: '',
});
const value2 = ref('');
const va = ref();

//单选获取到的id
const w = async (id: any) => {
  va.value = id;
};

const Wrod: any = reactive({
  Wrodata: {
    id: '',
    isshow: 0,
  },
  data: {
    page: 1,
    psize: 8,
  },
  datas: {},
});

const fm = reactive({
  //批量添加框
  dialogVisible: false,
  // 查询数据
  query: {
    databaseid: 0,
    page: 1,
    psize: 10,
    key: '',
    tags: '',
    type: '',
    admin: '',
  },
  //列表数据
  tableData: [],
  //详情数据框
  drawer: false,
  data: {},
  //详情数据列表
  particulars: [],
  //总条数
  total: 0,
  //试卷批量删除
  disabled: true,
  delarray: [],
});
const zcc = async () => {
  dialoe.value = false;
  dialo.value = true;
  const src = await questions({ databaseid: va.value });
  console.log(src);

  fr.tableData = src.data.list;
  fr.total = src.data.counts;
};

const wwy = async () => {
  dialogTableVisible.value = false;
  const res = await wy({ id: va.value });
  console.log(res);
  Wrod.Wrodata = res.data;
  AddFrom.questions = res.data.questions;
  Wrod.Wrodata.isshow = res.data.isshow;
  console.log(Wrod.Wrodata.questions);
};

//试题列表删除
const delti = (val: any) => {
  console.log(val);
  Wrod.Wrodata.questions.splice(val, 1);
};
const onSubmit = () => {
  console.log('submit!');
  getlt();
};
let checked: any = ref(false);

const check = (done: () => void) => {
  if (checked.value == true) {
    from.query.ismy = '3';
    getlt();

    ElMessageBox.confirm(`确定要切换本人创建的吗?`)
      .then(() => {
        checked.value = true;
      })
      .catch(() => {
        // catch error
        checked.value = false;
      });
  } else {
    ElMessageBox.confirm(`确定要切换全部试题吗?`)
      .then(() => {
        checked.value = false;
      })
      .catch(() => {
        // catch error
        checked.value = true;
      });
  }
};
const changePage = (val: number) => {
  from.query.page = val;
  getlt();
};
const changePageSize = (val: number) => {
  from.query.psize = val;
  getlt();
};
const tableHead = [
  {
    prop: 'title',
    label: '题目',
    type: 'buttons',
    buttons: [
      {
        text: '表头',
        type: 'primary',
        event: 'goinfo',
      },
    ],
  },
  {
    prop: 'type',
    label: '题量类型',
  },
  {
    prop: 'scores',
    label: '分数',
  },
];
const tableHeade = [
  {
    prop: 'title',
    label: '题库',
    type: 'buttons',
    buttons: [
      {
        type: 'primary',
        text: '表头',
        event: 'gopage',
      },
    ],
  },
  {
    prop: 'counts',
    label: '题量数目',
  },
  {
    prop: 'addtime',
    label: '创建时间',
  },
  {
    prop: 'admin',
    label: '创建人',
  },
];
const tableHeader = [
  {
    prop: 'title',
    label: '试卷名称',
  },
  {
    prop: 'counts',
    label: '题量',
  },
  {
    prop: 'admin',
    label: '创建人',
  },
  {
    prop: 'addtime',
    label: '创建时间',
  },
];
const fr = reactive({
  //修改所需
  val: {},
  //表单数据---查询功能
  query: {
    page: 1,
    psize: 10,
    key: '',
    ismy: 0,
    admin: '',
  },
  loading: true,
  //总条数
  total: 0,
  //表格数据
  tableData: [],
  //批量删除按钮
  disabled: true,
  delarray: [],
});
const fro = reactive({
  //修改所需
  val: {},
  //表单数据---查询功能
  query: {
    page: 1,
    psize: 10,
    key: '',
    ismy: 0,
    admin: '',
  },
  loading: true,
  //总条数
  total: 0,
  //表格数据
  tableData: [],
  //批量删除按钮
  disabled: true,
  delarray: [],
});

const from: any = reactive({
  query: {
    key: '',
    admin: '',
    ismy: 0,
    page: 1,
    psize: 10,
  },
  tableData: [],
  total: 0,
});
const getlt = async () => {
  const src = await getList(from.query);
  console.log(src);
  from.tableData = src.data.list;
  from.total = src.data.counts;
};
getlt();
// 考试添加数据
const AddFrom: any = reactive({
  id: 0,
  title: '',
  info: '',
  admin: 'ldq',
  begintime: '2021-12-07 15:33:59.0',
  endtime: '2021-12-02 15:34:03.0',
  limittime: '',
  scores: '',
  pastscores: 60,
  qorder: 1,
  aorder: 1,
  answershow: 2,
  isshow: 1,
  databaseid: 20,
  state: 1,
  limits: [{ id: 1 }, { id: 2 }],
  markteachers: [{ id: 3 }, { id: 4 }],
  students: [{ studentid: 5 }, { studentid: 6 }],
  questions: [],
  num: '',
});
const TestAdd = async (num: number) => {
  AddFrom.state = num;
  const res: any = await testadd(AddFrom);
  console.log(res);
  if (res.errCode == '10000') {
    ElMessage({
      message: '添加成功',
      type: 'success',
    });
    router.push('test');
  }
};
const data: any = reactive({
  params: {
    id: 0,
    title: '',
    info: '',
    admin: 'ldq',
    begintime: '',
    endtime: '',
    // 限制时长
    limittime: '',
    scores: 100,
    state: null,
    // 通过分数
    pastscores: 60,
    qorder: 0,
    aorder: 0,
    answershow: 1,
    isshow: 1,
    databaseid: 20,
    // 可见老师
    limits: [],
    // 阅卷老师
    markteachers: [],
    // 考生范围
    students: [],
    // 试题添加数据
    questions: [],
  },
  qor: [],
  aor: [],
  // 实体存入题库
  region: [],
  regions: [],
  // 分值
  score: '',
  // 防作弊
  checked1: '',
  checked2: true,
  // 弹可见老师
  is: false,
  // 带参数
  stus: '',
  // 弹出题库列表
  state: false,
  // 弹出框标题
  name: '',
  // 弹出添加对话框
  Addis: false,
  // 弹出添加试卷
  isTitle: false,
  Total: 0,
  // 根据id获取单条试卷
  DataList: [],
  // 题库ID
  dataID: 0,
  num1: '',
  num2: '',
  num3: '',
  num4: '',
  num5: '',
  dan: false,
  duo: false,
  pan: false,
  tian: false,
  wen: false,
  arrType: <any>[],
  isShow: false,
  isShow1: false,
  nums: 0,
  // 考试ID
  test: 0,
  num11: 0,
  num12: 0,
  num13: 0,
  num14: 0,
  num15: 0,
  arrTime: [],
  obj: {},
  Tips: '',
  index: -1,
  isImport: false,
});
const {
  isImport,
  obj,
  arrTime,
  num11,
  num12,
  num13,
  num14,
  num15,
  dan,
  duo,
  pan,
  tian,
  wen,
  num1,
  num2,
  num3,
  num4,
  num5,
  Total,
  params,
  region,
  is,
  stus,
  regions,
  state,
  name,
  Addis,
  isTitle,
  index,
}: any = toRefs(data);
const shortcuts = [
  {
    text: '上周',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  {
    text: '上个月',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
  {
    text: '上三个月',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    },
  },
];
// 数据回显
const Echo = async () => {
  console.log({ id: Number(id) });
  const res: any = await getTest(Number(id));
  console.log(res);
  if (res.errCode === 10000) {
    AddFrom.title = res.data.title;
    Wrod.Wrodata.questions = res.data.questions;
    console.log(AddFrom.questions);

    AddFrom.info = res.data.info;
    Wrod.Wrodata.isshow = 1;
    data.arrTime.push(res.data.begintime);
    data.arrTime.push(res.data.endtime);
  } else {
    ElMessage.error(res.errMsg);
  }
};
// nextTick(() => {
if (Number(id) != 1) {
  Echo();
}
// });

const num = ref(1);
const handleChange = (value: number) => {
  console.log(value);
};
const labelPosition = ref('right');
const { Wrodata } = toRefs(Wrod);
onMounted(() => {
  tilist();
  departmentList();
  getlist();
});
</script>

<style scoped lang="less">
/deep/ .el-transfer-panel {
  margin-right: 200px;
}
/deep/ .el-transfer__buttons {
  display: none;
}
.ty {
  div {
    div {
      margin-left: 10px;
    }
  }
}
.el-icon {
  color: #299aff;
  margin-right: 10px;
}
.shi {
  margin-left: 1300px;
}
.abc {
  display: flex;
  justify-content: space-between;
}
.add {
  margin-left: 250px;
  margin-top: 50px;
  margin-bottom: 100px;
}
.block {
  display: flex;
  color: #c3c3c3;
  span {
    margin-left: 10px;
  }
}
.num {
  margin-right: 15px;
}
.el-input-number {
  width: 100px;
}
.san {
  display: flex;
  align-items: center;
  // line-height: 50%;
  height: 50px;
  border-top: 2px solid #dcdfe6;
  .el-button {
    // line-height: 20%;
    margin-left: 20px;
  }
}
.er {
  height: 50%;
  // background-color: aqua;
  display: flex;
  align-items: center;
  h3 {
    margin-left: 20px;
  }
  border-bottom: 2px solid #dcdfe6;
  span {
    margin-right: 50px;
  }
  .el-button {
    margin-right: 20px;
  }
  height: 50%;
  display: flex;
  justify-content: space-between;
}
.shiti {
  width: 1000px;
  // display: block;
  // height: 100px;
  border: #dcdfe6 0.5px solid;
}
.el-form--label-right {
  margin-left: 150px;
}
.title {
  font-size: 20px;
  margin-left: 25px;
  margin-bottom: 10px;
}
.li {
  background-color: blue;
  width: 100%;
  height: 100%;
}
.daan {
  margin-left: 5px;
  margin-top: 10px;
  background-color: #f5faff;
  color: #9dadbc;
  height: 50px;
  display: flex;
  align-items: center;
}
.liang {
  background-color: #eefaf6;
  margin-top: 10px;
  height: 50px;
  display: flex;
  align-items: center;
}
.lian {
  background-color: #eefaf6;
  margin-top: 10px;
  height: 50px;
  display: flex;
  align-items: center;
  color: #5acda6;
}
.hei {
  margin-top: 10px;
  height: 50px;
  display: flex;
  align-items: center;
}
.one {
  height: 50px;
  display: flex;
  align-items: center;
  background-color: #f9faff;
  width: 100%;
  .ones {
    margin-right: 20px;
    font-size: 35px;
    margin-left: 25px;
    color: #c7e5ff;
  }
}
.setup {
  width: 100%;
  height: 100%;
  .ty {
    width: 100%;
    // height: 700px;
    max-height: 700px;
    overflow: auto;
    .yt {
      margin-top: 20px;
    }
    // background-color: aqua;
    // margin: 10px;
    // border: 1px solid red;
    .el-input {
      width: 70px;
    }
  }
}
</style>
