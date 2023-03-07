<template>
  <div class="roleBox">
    <div class="top">
      <span class="title">角色管理</span>
      <el-button type="primary" @click="edit(0)">添加角色</el-button>
    </div>
    <!-- 表格 -->
    <div class="buttom">
      <el-table
        :data="tableData"
        v-loading="loading"
        :header-cell-style="{ background: '#fafafa' }"
        style="width: 100%; margin-top: 20px; font-size: 13px"
      >
        <el-table-column prop="name" label="名称" />
        <el-table-column fixed="right" label="操作" width="120" >
          <template #default="scope">
            <el-button link type="primary" size="small" @click="edit(scope.row)"
              >编辑</el-button
            >
            <el-button
              link
              type="primary"
              size="small"
              @click="del(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="paging">
        <div class="demo-pagination-block">
          <el-pagination
            v-model:currentPage="paging.page"
            v-model:page-size="paging.psize"
            :page-sizes="[10, 20, 30, 40]"
            :small="small"
            :disabled="disabled"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="Data.counts"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <!-- 添加弹出框 -->
    <div>
      <el-dialog
        v-model="dialogVisible"
        top="5vh"
        :title="tips"
        width="70%"
        :close-on-click-modal="false"
        :before-close="handleClose"
        v-if="dialogVisible"
      >
        <div>
          <el-form
            :model="Data"
            status-icon
            ref="formRef"
            class="demo-ruleForm"
          >
            <el-form-item label="角色名称:" :rules="[{ required: true, message: '请输入角色名称' }]" prop="name">
              <el-input
                style="width: 280px"
                v-model="Data.name"
                type="text"
                autocomplete="off"
              />
            </el-form-item>
          </el-form>
        </div>
        <!-- 多选框 -->
        <div v-loading="loadinged" class="power">
          <div>权限</div>
          <!-- 考试 -->
          <div v-for="(item, index) in addData" :key="item.id">
            <div>
              <el-checkbox
                v-model="item.checked"
                style="margin-left: 35px; margin-top: 10px"
                :indeterminate="isIndeterminate"
                @change="handleCheckAllChange(index)"
              >
                {{ item.name }}
              </el-checkbox>
            </div>
            <div style="margin-left: 70px">
              <el-checkbox-group
                v-model="item.checkeds"
                @change="handleCheckedCitiesChange($event, index)"
              >
                <el-checkbox
                  v-for="items in item.children"
                  :label="items.id"
                  :key="items.id"
                >
                  {{ items.name }}</el-checkbox
                >
              </el-checkbox-group>
            </div>
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="resetForm">取消</el-button>
            <el-button type="primary" @click="submitForm(formRef)"
              >确定</el-button
            >
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script lang='ts' setup>
// 引入调接口数据
import { rolelist, roleadd,  roledel } from "../../../../api/admin";
import {menuList} from "../../../../api/role"
// 引入vue样式
import { ref, reactive, toRefs, onMounted } from "vue";
// 引入element ui样式
import { ElMessage, ElMessageBox,FormInstance } from "element-plus";
// 权限控制按钮是否隐藏方法导入
// import { isButton } from "../../utils/isButton";

// 定义的数据
const Data: any = reactive({
  name: <any>"",
  id: 0,
  // 多选框
  isIndeterminate: false,
  // 添加的数据
  addData: <any>[],
  // 数组里加对象
  objData: <any>[],
  // 表格数据
  paging: { page: 1, psize: 10 },
  tableData: [],
  // 分页总条数
  counts: 0,
  // 表格加载
  loading: true,
  // 复选框加载
  loadinged: true,
  // 提示
  tips: "添加",
});
// 解构数据
const {
  loadinged,
  isIndeterminate,
  addData,
  objData,
  paging,
  tableData,
  loading,
  tips,
} = toRefs(Data);

// 添加角色
const dialogVisible = ref(false);
// 点击空处不会消失对话框
const handleClose = () => {
  dialogVisible.value = false;
};
// 填写名称
const formRef = ref<any>();
// 多选框
const handleCheckAllChange = (index: number) => {
  // console.log(11,index);
  // console.log('123',Data.addData[index])
  if (Data.addData[index].checked) {
    console.log(Data.addData[index].checked);
    Data.addData[index].checkeds = [...Data.addData[index].children].map(
      (item) => item.id
    );
  } else {
    Data.addData[index].checkeds = [];
  }
  Data.objData = Data.addData[index].checkeds;
  // console.log(22,Data.addData[index].checkeds);
};
const handleCheckedCitiesChange = (value: string[], index: number) => {
  console.log(value)
  Data.addData[index].checked = value.length === Data.addData[index].children.length;
  objData.value = [...Data.addData[index].checkeds];
  // console.log([...objData.value]);
};
// 添加请求接口
const add = async () => {
  let menus: any = [];
  Data.addData.forEach((element: any) => {
    if (element.checkeds) {
      menus = [
        ...menus,
        ...[...element.checkeds].map((item: any) => ({ id: item })),
      ];
    }
  });
  if (menus.length < 1) {
    ElMessage("请至少选择一个权限");
    return;
  }
  const res: any = await roleadd({
    id: Data.id,
    name: Data.name,
    menus: menus,
  });
  if (res.errCode === 10000) {
    ElMessage.success(tips.value + "成功");
    dialogVisible.value = false;
    List();
  } else {
    ElMessage.error(res.errMsg);
    dialogVisible.value = true;
  }
};
// 添加提交
const submitForm = (formEl: any | undefined) => {
  if (!formEl) return
  formEl.validate((valid:any) => {
    if (valid) {
      add();
    } else {
      return false
    }
  })
}
// 取消
const resetForm = () => {
  Data.name = "";
  dialogVisible.value = false;
};
// 修改回显接口
const getRoleData = async (roleid: any) => {
  Data.loadinged = true;
  const res: any = await menuList({ roleid });
  if (res.errCode === 10000) {
    Data.addData = res.data.list;
  } else {
    ElMessage.error(res.errMsg);
  }
  Data.loadinged = false;
  Data.addData.forEach((element: any) => {
    element.checked = element.checked == 1;
    if (element.children) {
      element.checkeds = [...element.children]
        .filter((item: any) => item.checked == 1)
        .map((ite: any) => ite.id);
    }
    if (element.checkeds.length == element.children.length) {
      element.checked = true;
    }
  });
};
// 编辑
const edit = (e: any) => {
  Data.addData = [];
  tips.value = "添加";
  dialogVisible.value = true;
  getRoleData(e.id);
  if (e.id) {
    Data.name = e.name;
    Data.id = e.id;
    tips.value = "修改";
  } else {
    Data.name = "";
  }
};
// 删除
const del = (ids: number) => {
  ElMessageBox.confirm("此操作将永久删除该文件, 是否继续?", "提示", {
    cancelButtonText: "取消",
    confirmButtonText: "确认",
    type: "warning",
  })
    .then((res:any) => {
      delInfo(ids);
    })
    .catch((error:any) => {
      ElMessage.error("已取消删除");
    });
};
// 删除请求接口
const delInfo = async (ids: number) => {
  const res: any = await roledel({ id: ids });
  // console.log(res);
  if (res.errCode === 10000) {
    ElMessage.success("删除成功");
    List();
  } else {
    ElMessage.error(res.errMsg);
  }
};
// 列表
const List = async () => {
  const res: any = await rolelist({ ...Data.paging });
  // console.log(res);
  if (res.errCode === 10000) {
    Data.tableData = res.data.list;
    Data.counts = res.data.counts;
  }
  Data.loading = false;
};
// 页面加载
onMounted(() => {
  List();
});
// 分页
const small = ref<boolean>(false);
const disabled = ref<boolean>(false);
const handleSizeChange = (val: number) => {
  paging.value.psize = val;
  List();
};
const handleCurrentChange = (val: number) => {
  paging.value.page = val;
  List();
};
</script>
<style scoped lang='less'>
.roleBox{
    width: 100%;
    .top{
        display: flex;
        justify-content: space-between;
        padding-bottom: 10px;
        .title{
            font-size: 20px;
        }
        button{
            font-size: 12px;
        }
    }
    .buttom{
        height: 91vh;
        overflow-y: scroll;
    }
    // 分页
    .paging{
        width: 100%;
        margin-top: 15px;
        .el-pagination{
            justify-content: center;
        }
        .demo-pagination-block + .demo-pagination-block {
            margin-top: 10px;
          }
          .demo-pagination-block .demonstration {
            margin-bottom: 16px;
          }
    }
    .power{
        margin-left: 38px;
        height: 55vh !important;
        overflow-y: scroll !important;
    }
}

</style>