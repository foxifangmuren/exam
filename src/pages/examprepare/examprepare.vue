<template>
  <div class="examprepare">
    <div class="box">
      <div class="box_top">
        <el-icon class="ico" @click="back"><Back /></el-icon>返回 <span>|</span> {{ data.title }}
      </div>
      <div class="box_time">
        <div>开放时间</div>
        <span>{{ data.begintime==null?'不限':data.begintime +'-'+ data.begintime }}</span>
      </div>
      <div class="line"></div>
      <div class="concent">
        <div class="box1">
          <div class="boxtop">
            题目数量
          </div>
          <div class="box-bottom">
            {{ data.subjectnum }}题
          </div>
        </div>
        <div class="shu"></div>
        <div class="box1">
          <div class="boxtop">
            考试时长
          </div>
          <div class="box-bottom">
            {{data.limittime==0?'不限':data.limittime}}<span v-if="data.limittime==0?false:true">min</span>
          </div>
        </div>
        <div class="shu"></div>
        <div class="box1">
          <div class="boxtop">
            考试总分
          </div>
          <div class="box-bottom">
            {{ data.scores }}分
          </div>
        </div>
        <div class="shu"></div>
        <div class="box1">
          <div class="boxtop">
            通过分数
          </div>
          <div class="box-bottom">
            {{ data.pastscores }}分
          </div>
        </div>
      </div>
      <div class="button">
        <el-button type="primary" disabled v-if="isShow">不在考试范围</el-button>
        <el-button type="primary" v-else @click="begin">开始考试</el-button>
        
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import {getTest} from '../../api/stutest'
  import { useRoute,useRouter } from 'vue-router'
  import { onMounted,reactive ,toRefs} from 'vue'
  import {Back} from '@element-plus/icons-vue'
import { da } from 'element-plus/es/locale';
  const route = useRoute()
  const router = useRouter()
  const obj:any = reactive({
    data:[],
    isShow:false
  })
  const GetTest1 =async ()=>{
    let res:any = await getTest({id:route.query.id})
    console.log(res)
    if(res.errCode ===10000){
   
      
      obj.data = res.data
      if(res.data.begintime){
        const begintime = new Date(res.data.begintime)
        const endtime = new Date(res.data.endtime)
        const time = new Date()
        console.log(begintime,endtime,time)
        if( begintime.getTime() < time.getTime() && endtime.getTime() > time.getTime()){
          obj.isShow = false
        }else{
          obj.isShow = true
        }
      }
    }
  }
  //返回考试详情页面
  const back = ()=>{
    router.push({path:'/stutest'})
  }
  //开始考试按钮
  const begin = ()=>{
    router.push({path:'/stuexam',query:{testid:route.query.id}})
  }
  onMounted(() => {
    GetTest1()
  })
  const {data,isShow} = toRefs(obj)
</script>
<style lang="less" scoped>
  .examprepare{
    width: 100%;
    height: 100%;
    background: url('../../img/bei.png') no-repeat;
    background-size:100% 100%;
    position: absolute;
    background-attachment:fixed;
    line-heigt:100%;
    .box{
      .button{
        // margin-top:30px;
        width:300px;
        height: 50px;
        margin:80px auto 0;
        /deep/button{
          width: 100%;
          height: 100%;
        }
      }
      position: relative;
      top: 200px;
      width: 700px;
      height: 320px;
      padding: 50px;
      margin: 0 auto;
      background-color:#ffffff;
      .box_top{
        .ico{
          margin-right:10px;
        }
        span{
          color:#ccc;
          margin:0 10px;
        }
      }
      .box_time{
        margin-left:30px;
        margin-top:20px;
        span{
          font-size:14px;
        }
      }
      .line{
        width: 100%;
        height: 1px;
        background-color:#ccc;
        margin-top:20px;
        margin-bottom:30px;
      }
      .concent{
        display:flex;
        width: 90%;
        margin:0 auto;
        .box1{
          width: 200px;
          .boxtop{
            text-align:center;
            color:#ccc;
            font-size:13px;
          }
          .box-bottom{
            text-align:center;
            margin-top:10px;
            font-size:25px;
          }
        }
        
        .shu{
          width: 1px;
          height: 65px;
          background-color:#ccc;
        }
      }
    }
  }
</style>