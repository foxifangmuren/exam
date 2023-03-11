<template>
  <el-dialog
    v-model="dialogVisible"
    title="批量上传学生信息"
    width="40%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div class="batch">
      <div class="import">
        <div class="batchLeft">
          <el-steps direction="vertical" :active="1">
            <el-step />
            <el-step />
          </el-steps>
        </div>
        <div class="batchRight">
          <p class="p1">
            下载<span style="color: #134ffd; cursor: pointer"> 学生信息模板</span
            >，批量导入试题
          </p>
          <p class="z">
            注:从其他Excel或Word复制试题时请使用选择性粘贴
            Word:右键一选择性粘贴-文本， Excel:右键一选择性粘贴一只勾选 “值”
          </p>
          <p class="p1">上传填写好的学生信息表</p>
        </div>
      </div>
      <el-upload
        name="file"
        ref="Aupload"
        class="upload-demo"
        action="http://estate.eshareedu.cn/exam/api/student/upload"
        :headers="Authorization"
        :limit="1"
        :auto-upload="true"
        :on-success="uploadSuccess"
      >
        <template #trigger>
          <el-button type="primary" style="font-size:12px;margin:15px 35px">点击上传文件</el-button>
        </template>
      </el-upload>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button style="font-size:12px" @click="(dialogVisible = false), emit('isImports', false)"
          >取消</el-button>
        <el-button style="font-size:12px" type="primary" @click="determine">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { inject, reactive, toRefs, watch } from "vue";
// 引入封装接口
import { ElMessage } from 'element-plus'
const data:any = reactive({
  dialogVisible: false,
  Authorization:{Authorization:sessionStorage.getItem('token')},
  list:[],
});
const datas:any = inject('data')
const {dialogVisible,Authorization,list }:any = toRefs(data);
const props = defineProps({
  isImport: {
    type: Boolean,
  },
});
watch([props], () => {
  dialogVisible.value = props.isImport;
});
const emit = defineEmits(["isImports",'imports']);
// 关闭触发事件
const handleClose = (done: () => void) => {
  done();
  emit("isImports", false);
};
// 确定
const determine = () => {
  if(data.list.length==0){
    ElMessage('文件未上传')
    return false;
  }
  dialogVisible.value = false;
  emit("isImports", false);
  datas.isImport = false
  datas.stuShow = true
};

const uploadSuccess=(file:any)=>{
  if(file.errCode==10000){
    data.list = file.data
  }else{
    ElMessage.error(file.errMsg)
  }
}


</script>
<style scoped lang="less">
.dialog-footer button:first-child {
  margin-right: 10px;
}
.batch{
    // background-color: aqua;
    .import{
        display: flex;
        .batchLeft{
            height: 125px;
            ::v-deep .el-step.is-vertical .el-step__line{
                color: #c0c4cc;
            }
            ::v-deep .el-step__icon.is-text{
                color: #c0c4cc;
            }
            ::v-deep .el-step__head.is-finish{
                border-color: #c0c4cc;
            }
            ::v-deep .el-step__head.is-process{
                border-color: #c0c4cc;
            }
        }
        .batchRight{
            // background-color: deeppink;
            display: flex;
            flex-direction: column;
            justify-content:space-between;
            .p1{
                font-size: 16px;
                color: #c0c4cc;
            }
            .z{
                color: #f9492d;
                font-size: 13px;
            }
        }
    }
    ::v-deep .el-upload-list__item-name{
        margin-left: 24px;
    }
}

</style>