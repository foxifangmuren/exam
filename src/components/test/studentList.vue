<template >
   <div style="height: 450px;">  
    <div class="top" >
        <div class="topbranch">
            <span>部门</span>
            <el-select v-model="depval" class="m-2" placeholder="请选择" size="default" @change="changeDep">
                <el-option v-for="item in studentList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
        </div>
        <div class="topbranch">
            <span>班级</span>
            <el-select v-model="classval" class="m-2" placeholder="请选择" size="default" @change="changeClass">
                <el-option v-for="item1 in classlists" :key="item1.id" :label="item1.name" :value="item1.id" />
            </el-select>
        </div>
    </div>
    <div>
        <div style="margin-top:30px; margin-left: 50px;">
            <el-transfer v-model="id" :left-default-checked="id" @left-check-change="leftcheckChange"
              @right-check-change="rightcheckChange" :titles="['未选', '已选']" :props="{key: 'id', label: 'name',}" :data="datas">
              <template #default="{ option }">
                <span>{{ option.name }}</span>
              </template>
            </el-transfer>
          </div>
    </div>
    <div>
        <span class="dialog-footer" >
            <el-button @click="studentCancel">取消</el-button>
            <el-button type="primary" @click="studentConfirm">
                确认
            </el-button>
        </span>
    </div>
   </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { classList, departmentList,studentlist } from '../../api/test'

const props = defineProps(['dialogstudent'])
console.log(props);

const emit = defineEmits(['studentCancel', 'studentConfirm'])


const studentCancel = () => {
    emit('studentCancel', false)
}
let markteachers=ref([])
const studentConfirm = () => {
    markteachers.value=id.value.map((item:any)=>({studentid:item}))
    console.log( markteachers.value);
    
    emit('studentConfirm', false,markteachers.value)
}

const depval = ref('')//当前选中的
let studentList: any = ref([])//部门

// 部门列表
const getstudentlist = async () => {
    let res: any = await departmentList({})
    //   console.log(res);
    studentList.value = res.data.list

}
getstudentlist()
// 点击获取部门id  因为班级要部门的id
let depid=ref(0)
const changeDep=(val:any)=>{
    // console.log(val);
    depid.value=val
    getclasses()//刷新数据
}
let classval = ref('')//当前选中的
let classlists: any = ref([])//班级
// 班级列表
const getclasses = async () => {
    let res: any = await classList({depid:depid.value})
    console.log(res);
    classlists.value = res.data.list

}
getclasses()
// 点击班级获取id 穿梭框需要班级的id
let classid=ref(0)
const changeClass=async(val:any)=>{
    // console.log(val);
    classid.value=val
}
// 穿梭框 
let datas:any=ref([])
const getstudent=async()=>{
    let res:any=await studentlist({depid:depid.value,classid:classid.value})
    // console.log(res);
    if(res.errCode==10000){
        datas.value=res.data.list
    }
}
getstudent()
// 左边穿梭框
let id:any=ref([])
const leftcheckChange=(val:any)=>{//未选
    // console.log(val);  
    id.value=[...id.value,...val]
}
// 右边穿梭框
const rightcheckChange=(val:any)=>{//已选
    // console.log(val);
    if(val.length>0){
        id.value.filter((item:any)=>item!=val[0])
    }
    
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
.dialog-footer{
    float: right;
    padding-bottom: 220px;
}
/deep/.el-dialog__body{
    height: 600px;
}
</style>