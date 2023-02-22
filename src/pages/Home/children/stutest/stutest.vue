<template>
  <div class="stutest"> 
    <div class="stutesttop">

      <div class="topleft">考试列表</div>
      <div class="topright">
        <el-form :model="data" :inline="true" class="demo-form-inline">
    <el-form-item label=" 关键字：">
      <el-input  placeholder="考试名称" v-model="data.key"  clearable/>
    </el-form-item> 
    <el-form-item label=" 状态：">
      <el-select v-model="data.result">
        <el-option label="所有" value="所有" />
        <el-option label="已通过" value="已通过" />
        <el-option label="未通过" value="未通过" />
        <el-option label="待阅卷" value="待阅卷" />
        <el-option label="未考试" value="未考试" />
      </el-select>
    </el-form-item> 
    <el-form-item>
      <el-button type="primary">查询</el-button>
    </el-form-item>
  </el-form>
      </div>
      
    </div>
    <div class="conten">
        <div class="contenbox" v-for="item in list" :key="item.id">
          <div class="contenbox_left">
            <div class="contenbox_left_top">
              <img src="../../../../img/wait.jpg" alt="">
              <span>{{ item.title }}</span>
            </div>
            <div class="contenbox_left_time">
              考试时间： {{ item.begintime==null?'不限':item.begintime +'-'+ item.begintime }}
            </div>
          </div>
          <div class="contenbox_right">
            0人通过
          </div>
        </div>
        
      </div>
  </div>
</template>
<script lang="ts" setup>
  import {reactive,toRefs,onMounted} from 'vue'
  import{getList} from '../../../../api/stutest'
  const obj = reactive({
    data:{
      key:'',
      result:'所有'
    },
    list:[]
  })
  const List= async()=>{
    let res = await getList()
    // console.log(res)
    if(res.errCode===10000){
      obj.list = res.data.list
    }
    console.log(obj.list)
  }
  onMounted(() => {
    List()
  })
  const {data,list} = toRefs(obj)
</script>
<style lang="less" scoped>
  .stutest{
    .conten{
      display:flex;
      // width: 98%;
      // justify-content:space-between;
      flex-wrap:wrap;
      // background-color:red;
      margin:0 auto;
      .contenbox{
        // flex:3;
        
        display:flex;
        justify-content:space-between;
        // box-shadow: 2px 2px 2px 2px #ccc;
        border:1px solid #ccc;
        border-radius:5px;
        padding:10px;
        margin:0 10px;
        width:30%;
        height:135px;
        // background-color:pink;
        margin-bottom: 20px;
        .contenbox_right{
            color:#c4c4c6;
            font-size:12px;
            margin-top:90px
          }
        .contenbox_left{
          .contenbox_left_top{
            display:flex;
            margin-bottom:10px;
            img{
              width: 140px;
              height: 80px;
            }
            span{
              margin-top:20px;
              margin-left:10px;
            }
          }
          .contenbox_left_time{
            color:#c4c4c6;
            font-size:12px;
          }
        }
      }
    }
    .stutesttop{
      width: 98%;
      margin:0 auto;
      display: flex;
      justify-content:space-between;
      .topleft{
        font-size:20px;
      }
    }
  }
</style>