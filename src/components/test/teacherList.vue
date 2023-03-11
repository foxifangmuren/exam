<template>
    <div style="height: 410px;">
        <div class="top">
        <div class="topbranch">
            <span>部门</span>
            <el-select v-model="value" class="m-2" placeholder="请选择" size="default" @change="getteacherList">
                <el-option v-for="item in studentList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
        </div>
    </div>
    <div>
        <el-transfer v-model="depval" :data="teacherdata"  @left-check-change="leftchange" 
        @right-check-change="rightchange"  @change="" :titles="['未选', '已选']">
        </el-transfer>

    </div>
    <div>
        <span class="dialog-footer" style="float: right;">
            <el-button @click="teacherCancel">取消</el-button>
            <el-button type="primary" @click="teacherConfirm">
                确认
            </el-button>
        </span>
    </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { classList, departmentList, teacherList } from '../../api/test'
const emit = defineEmits(['teacherCancel', 'teacherConfirm','deplenght'])

// const value = ref([])//穿梭框列表数据
let teacherdata = ref([])

const teacherCancel = () => {
    emit('teacherCancel', false)
}
// 点击确定
const teacherConfirm = () => {
    const arr=depval.value.map((item:any)=>{
        return{id:item}
    })
    emit('teacherConfirm', false,arr)
}
let value =ref('')//当前选中的
const depval:any = ref([])//当前选中的
const deplenght:any=ref([])//当前选中的length
let studentList: any = ref([])//部门

// 穿梭框
const getteacherList = async (depid: any) => {
    // console.log(111111, dipid);
    let res:any=await teacherList({depid})
    console.log(res);
    if(res.errCode==10000){
        teacherdata.value=res.data.list.map((item:any)=>{
            return{
                key:item.id,
                label:item.name
            }
        })
    }
}

// 获取下拉框列表数据
const getstudentlist = async () => {
    let res: any = await departmentList({})
    //   console.log(res);
    studentList.value = res.data.list

}
getstudentlist()

// 左边的点击事件
const leftchange=(val:any)=>{
    // console.log(val);
    depval.value=[...depval.value,...val];
    deplenght.value=depval.value.length;
    emit('deplenght',deplenght.value)

}
// 右边的点击事件
const rightchange=(val:any)=>{
    // console.log(val);
    depval.value=depval.value.filter((item:any)=>!val.includes(item))
    deplenght.value=depval.value.length
    emit('deplenght',deplenght.value)
    
}
 
</script>

<style scoped lang="less">
.top {
    display: flex;
    width: 700px;
    justify-content: space-between;
}
:deep(.el-transfer__buttons) {
  display: none;
}
:deep( .el-transfer-panel){
  width: 270px;
  margin-left: 40px;
  margin-top: 25px;
}
</style>