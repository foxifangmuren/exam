<template>
  <div>
    <div class="title">
      <div class="kao">考试管理</div>
      <div>
        <el-button type="primary" @click="testadd">创建考试</el-button>
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
                start-placeholder="开始日期"
                end-placeholder="结束日期"
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
    <div v-if="va != ''">
      <el-button type="danger" @click="unpublished(data, 3)"
        >批量删除</el-button
      >
      <el-button type="primary" @click="unpublished(data, 1)"
        >发布考试</el-button
      >
      <el-button type="success" @click="unpublished(data, 2)"
        >取消发布</el-button
      >
    </div>
    <el-table
      :data="datas"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      ref="multipleTableRef"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="考试名称" width="180">
        <template #default="scope">
          <el-link type="primary" prop="title" @click="tit(scope.row.id)">
            {{ scope.row.title }}</el-link
          >
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态" width="180">
        <template #default="scope">
          <el-link type="primary" :underline="false" v-if="scope.row.state == 1"
            >已发布</el-link
          >
          <el-link
            type="danger"
            v-if="scope.row.state == 2"
            @click="unpublishe(scope.row, 1)"
            >未发布</el-link
          >
        </template>
      </el-table-column>
      <el-table-column prop="scores" label="总分" />
      <el-table-column prop="pastscores" label="通过分数" />
      <el-table-column prop="studentcounts" label="考试人数" />
      <el-table-column prop="studentScores" label="通过人数" />
      <el-table-column prop="begintime" label="开放时间" />
      <el-table-column prop="admin" label="创建人" />
      <el-table-column prop="addtime" label="更新时间" />
      <el-table-column class="op" label="操作">
        <template #default="scope">
          <el-link type="primary" @click="studentTan = true">学生</el-link>
          <span>|</span>
          <el-link type="primary" @click="keJianTan = true">可见</el-link>
          <span>|</span>
          <el-link type="primary" @click="yueJuanTan = true">阅卷老师</el-link>
          <br />
          <el-link type="primary" @click="anse(scope.row)">分析</el-link>
          <span>|</span>
          <el-link type="primary" @click="updata(scope.row)">编辑</el-link>
          <span>|</span>
          <el-link type="danger" @click="unpublishe(scope.row, 2)"
            >删除</el-link
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="data.page"
      v-model:page-size="data.psize"
      background
      :page-sizes="[5, 10, 15, 20]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="form.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog v-model="show" title="测试" width="80%">
      <div class="ceshi">
        <div>
          <span>总分</span>
          <span>{{ form.tidata.scores }}</span>
        </div>
        <div>
          <span>通过分数</span>
          <span>{{ form.tidata.pastscores }}</span>
        </div>
        <div>
          <span>考试时长</span>
          <span>100</span>
        </div>
        <div>
          <span>开放时间</span>
          <span>{{ form.tidata.begintime }}</span>
        </div>
      </div>
      <div class="juan">
        <div v-for="(item, index) in Wrodata.questions" :key="item.id">
          <div class="titl">
            {{ index + 1 }}{{ item.type }} <span>分值</span>{{ item.scores }}
          </div>
          <div>
            {{ item.title }}
          </div>
          <div
            v-for="ite in item.answers"
            key="ite.id"
            :class="item.answer.includes(ite.answerno) ? 'liang' : 'hei'"
          >
            <span>{{ ite.answerno }}:{{ ite.content }}</span>
          </div>
          <div class="liang" v-if="item.answer">正确答案:{{ item.answer }}</div>
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
        <el-button @click="down">导出excel</el-button>
      </div>
    </el-dialog>
    <!-- 学生弹出框 -->
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
import { ElTable } from 'element-plus';
import { reactive } from 'vue';
import { TextList } from '../../../../api/admin';
import { departmentlist } from '../../../../api/admin';
import { ref, onMounted, toRefs } from 'vue';
import { updateState, deleteall, del, testget } from '../../../../api/stutest';
import { ElMessage, ElMessageBox } from 'element-plus';
import { exportExcel } from '@/api/Subjects';
import { downLoadBlob } from '@/utils/download';
import router from '@/router';
const updata = (row:any)=>{
  console.log(row);
  
  row.studentcounts > 0 ? ElMessage.error('本场考试已有学生参加，不可编辑') : router.push(`/testadd/${row.id}`);
}
//下载导出
const down = async () => {
  const src = await exportExcel({ id: vald.value.id }).then((src: any) => {
    downLoadBlob(src, vald.value.title);
  });
};

const studentTan = ref(false);
const keJianTan = ref(false);
//阅卷老师弹出框
const yueJuanTan = ref(false);
const value1 = ref<[Date, Date]>([
  new Date(2016, 9, 10, 8, 40),
  new Date(2016, 9, 10, 9, 40),
]);
const show: any = ref(false);
const anse = (row:any) => {
  console.log(row);
  
  if (row.studentcounts == 0) {
    ElMessage({
      message: "没有学生考试",
      type: "error",
    });
  }else if(row.incomplete!=0){
     ElMessage({
      message: "该试卷未判完",
      type: "error",
    });
  } 
  else {
    router.push({ path: "/analyse", query: { data: row.id } });
  }
};
const props = {
  expandTrigger: 'hover', //次级菜单展开方式
  checkStrictly: true, //是否严格的遵守父子节点不相互关联
  value: 'id',
  label: 'name',
};
const vald =ref()
const tit = async (val: any) => {
  console.log(val);
  vald.value=val
  show.value = true;
  const res = await testget({ id: val });
  console.log(res);
  form.Wrodata = res.data;
  form.tidata = res.data;
};
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  TexLis();
};
const testadd = () => {
  router.push('/testadd/1');
};
const handleCurrentChange = (val: number) => {
  TexLis();

  console.log(`current page: ${val}`);
};
const form: any = reactive({
  data: {
    page: 1,
    psize: 5,
    admin: '',
    key: '',
    ismy: 0,
    opentime: null,
    begindate: '',
    enddate: '',
    state: null,
    isread: null,
    result: '',
  },
  datas: [],
  total: '',
  tidata: [],
  Wrodata: {
    id: '',
    isshow: 0,
  },
});
//发布状态
const va: any = ref('');
let i: any = ref([]);
let e: any = ref('');
const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<any[]>([]);
const handleSelectionChange = (val: any[]) => {
  console.log(val);
  i.value = [];
  val.forEach((item: any) => {
    i.value.push(item.id);
  });
  console.log(i);
  va.value = val;
  multipleSelection.value = val;
};
const departmentList = async () => {
  const res: any = await departmentlist(null);
  console.log('部门级联', res);
  if (res.errCode === 10000) {
    dataq.options = res.data.list;
  }
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
const handleChange = (e: any) => {
  data.value = e;
};
const unpublished = (data: any, num: any) => {
  if (i.value == '') {
    console.log(1);

    var ids: any = [data.id];
  } else {
    console.log(i);

    var ids = i._rawValue;
  }
  ElMessageBox.confirm('此操作将修改选中的考试状态, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })

    .then(async () => {
      if (num === 1) {
        console.log(111);

        const params = {
          ids,
          state: 1,
        };
        const res = await updateState(params);
        console.log(111111111111111111, params, res);
      }
      if (num === 2) {
        const params = {
          ids,
          state: 2,
        };
        const res = await updateState(params);
        console.log(2222222222222222, params, res);
      }
      if (num === 3) {
        const params = {
          ids,
        };
        const res = await deleteall(params);
        console.log(333333333333333, params, res);
      }
      if (num === 3) {
        e.value = '删除';
      } else if (num == '1' || num == '2') {
        e.value = '修改';
      }
      ElMessage({
        type: 'success',
        message: e.value + `成功`,
      });
      TexLis();
    })

    .catch(() => {});
};
const unpublishe = (data: any, num: number) => {
  console.log(num);

  ElMessageBox.confirm('此操作将修改选中的考试状态, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })

    .then(async () => {
      if (num == 1) {
        const ids: any = [data.id];

        const params = {
          ids,
          state: 1,
        };
        console.log(params);
        e.value = '修改';
        const res = await updateState(params);
      } else if (num == 2) {
        const id: any = data.id;
        console.log(id);

        const res = await del({ id: id });
        console.log(res);

        e.value = '删除';
      }

      TexLis();
      ElMessage({
        type: 'success',
        message: e.value + '成功',
      });
    })
    .catch(() => {});
};

//考试列表
const TexLis = async () => {
  const res = await TextList(form.data);
  form.datas = res.data.list;
  res.data.list.forEach((item: any) => {
    item.addtime = item.addtime.slice(0, 16);
    // console.log(item.addtime);
    form.datas.addtime = item.addtime;
  });
  // console.log(form.datas);
  form.total = res.data.counts;
  // console.log(res);
  // TexLis();
};

const onSubmit = () => {
  console.log('submit!');
};
onMounted(() => {
  TexLis();
  departmentList();
});
const { datas, data, Wrodata } = toRefs(form);
</script>

<style lang="less" scoped>
/deep/ .el-transfer-panel {
  margin-right: 200px;
}
/deep/ .el-transfer__buttons {
  display: none;
}
.liang {
  background-color: #eefaf6;
  margin-top: 10px;
  height: 50px;
  display: flex;
  align-items: center;
}
/deep/.el-dialog {
  // width: 100%;
  // height: 100%;
  margin-top: 50px;
}
.daan {
  background-color: #f5faff;
  color: #9dadbc;
  height: 50px;
  display: flex;
  align-items: center;
}
.el-pagination{
  margin-left: 475px;
}
.juan {
  height: 650px;
  margin-bottom: 50px;
  overflow: auto;
  .el-button {
    position: absolute;
    top: 50px;
    right: 30px;
    width: 80px;
  }
}
.hei {
  margin-top: 10px;
  height: 50px;
  display: flex;
  align-items: center;
}
.ceshi {
  div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  display: flex;
}
span {
  margin: 0 2px;
}
.titl {
  margin-top: 20px;
}
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
