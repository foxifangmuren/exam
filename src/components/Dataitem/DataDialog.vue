<template>
<div>
     <el-dialog v-model="dialogVisible" title="批量导入试题" width="40%" >
      <div >
        <el-steps direction="vertical" :active="1" style="height: 150px">
          <el-step status="wait" :title="'下载试题模板批量导入试题'" @click="dowtemplate">
              
          </el-step>
          <el-step title="上传填写好的试题表" status="wait" />
            <p style="position: relative; top: -80px; left: 40px; color: red; padding:0 20px;">
              注：从其他Excel或者Word复制试题时请使用选择性粘贴Word：右键一选择性粘贴-文本，Excel:右键一选则行粘贴一只勾选“值”
            </p>
        </el-steps>
        <div>
            <el-upload
            name="file"
            class="upload-demo"
            action="http://estate.eshareedu.cn/exam/api/test/upload"
            :headers="from.Authorization"
            :limit="1"
            :before-remove="beforeRemove"
            :on-success="addFile"
          >
            <el-button type="primary">点击上传文件</el-button>
          </el-upload>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="adddataitem"> 确定  </el-button>
        </span>
      </template>
    </el-dialog>
</div>
</template>
<script lang='ts' setup>
/**
 * 接受id
 * 接受显示
 * 关闭显示调用接口
 */
import { ref, reactive, watch } from "vue";
import { useRoute } from "vue-router";
import {Daddlist,} from "@/api/databaselist";
import { ElMessageBox,} from "element-plus";


//接受参数
//接受参数---父组件的方法
const emit =defineEmits(['getlist','can'])
//接受参数---定义
const dialogVisible = ref(false)
//接受参数---暴漏
defineExpose({ dialogVisible })

//地址栏数据
const route = useRoute();
const testid = ref(route.query.id);
//表格数据
const from = reactive({
  dialogVisible:false,
  Authorization:{Authorization:sessionStorage.getItem('token')},
  addFile:[],
});
//下载试题模板
const dowtemplate = () => {
  let link = document.createElement("a");
  link.style.display = "none";
  link.href = "http://estate.eshareedu.cn/exam/upload/question.xlsx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
//删除文件之前的提示
const beforeRemove: any['beforeRemove'] = (uploadFile: { name: any; }, uploadFiles: any) => {
  return ElMessageBox.confirm(  `确定要删除文件 ${uploadFile.name} ?`  ).then(
    () => true,
    () => false
  )
}
//上传成功对数据进行更改
const addFile=async(file:any)=>{
  if(file.errCode===10000){
    from.addFile=file.data.map( (item:any)=>({...item,title:item.title}))
    console.log( from.addFile);
    
  }
}
//确定时调用接口===试题批量添加
const adddataitem=async(file:any)=>{
  //调用批量添加接口  
  const src =await Daddlist({databaseid:testid.value,list:from.addFile})
  console.log(src);
  
  //调用父组件方法
  emit('getlist')
  emit('can',from.addFile)
  // 关闭弹框
  dialogVisible.value=false
}

</script>
<style scoped>

</style>
