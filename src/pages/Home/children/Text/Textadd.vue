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
              <div v-for="(item, index) in Wrodata.questions" :key="item.id">
                <div class="abc">
                  <div>
                    {{ index + 1 }}{{ item.type }} <span>分值</span>
                    <el-input v-model="item.scores"></el-input>
                  </div>

                  <div>
                    <el-icon :size="20"><EditPen /></el-icon>
                    <el-icon :size="20" @click="delti(index)"
                      ><DeleteFilled
                    /></el-icon>
                  </div>
                </div>
                <div>
                  {{ item.title }}
                </div>
                <div
                  v-for="ite in item.answers"
                  :class="item.answer.includes(ite.answerno) ? 'liang' : 'hei'"
                  key="ite.id"
                >
                  <span>{{ ite.answerno }}:{{ ite.content }}</span>
                </div>
                <div class="lian" v-if="item.answer">
                  正确答案:{{ item.answer }}
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
              <el-button>添加题目</el-button>
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
            <el-radio label="交卷后显示" />
            <el-radio label="不允许查看" />
            <el-radio label="仅可查看对错" />
            <el-radio label="仅查看错题" />
            <el-radio label="考试结束后查看" />
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
            <el-button @click="studentTan = true">+选择</el-button>
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
        <el-button @click="dialogTableVisible = false">取消</el-button>
        <el-button type="primary" @click="wwy">确定</el-button>
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
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, toRefs } from 'vue';
import { testadd } from '@/api/stutest';
import { examList } from '@/api/exam';
import { departmentlist } from '../../../../api/admin';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getList } from '@/api/Subjects';
import { wy, databaseList } from '@/api/databaselist';
import router from '@/router';
const studentTan = ref(false);
const keJianTan = ref(false);
//阅卷老师弹出框
const yueJuanTan = ref(false);
const dialogTableVisible = ref(false);
const dialoe = ref(false);
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
const changePag = (val: number) => {
  fro.query.page = val;
  getlist();
};
const changePageSiz = (val: number) => {
  fro.query.psize = val;
  getlist();
};
const form = reactive({
  name: '',
});
const value2 = ref('');
const va = ref();
//试卷数据
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
  AddFrom.questions.splice(val, 1);
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
const getlist = async () => {
  const src = await databaseList(from.query);
  fro.tableData = src.data.list;
  fro.total = src.data.counts;
};
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
  {
    label: '操作',
    type: 'buttons',
    buttons: [
      {
        type: 'primary',
        text: '试题',
        event: 'gopage',
      },
      {
        type: 'primary',
        text: '编辑',
        event: 'bialog',
      },
      {
        type: 'primary',
        event: 'del',
        text: '删除',
      },
    ],
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
  height: 50%;
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
    height: 700px;
    overflow: auto;

    // background-color: aqua;
    // margin: 10px;
    // border: 1px solid red;
    .el-input {
      width: 70px;
    }
  }
}
</style>
