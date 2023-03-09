<template>
  <div class="examprepare">
    <div class="box">
      <div class="box_top">
        <el-icon class="ico" @click="back"><Back /></el-icon>返回 <span>|</span> {{ data.title }}
      </div>
      <div class="box_time">
        <div>用时：{{ time }} 分钟 | 交卷时间：{{ data.stuEndTime }} | 试卷总分：{{ data.scores }} | 通过分数：{{ data.pastscores }}</div>
      </div>
      <div class="line"> <div class="log">
        <div class="wai" v-if="isShow">
          <div class="waibox">未通过 </div>
        </div>
        <div class="wai1" v-else>
          <div class="waibox1">已通过 </div>
        </div>
      </div></div>
      <div class="grade">
        <div class="grade_top" v-if="Scores==='未通过'">
          {{ Scores==='未通过'?data.studentScores:'' }}
        </div>
        <div class="grade_top1" v-if="Scores==='待阅卷'">
          {{ Scores }}
        </div> <div v-if="Scores==='已通过'">
          <div class="grade_top2">{{ data.studentScores }}</div>
          <div class="grade_top8">恭喜，通过考试</div>
        </div>

        <div class="grade_bottom" v-if="Scores=='未通过'?true:false">
            很可惜，未通过
        </div>
      </div>
      <div class="conter">
        <table>
          <tr style="background-color: rgb(251, 252, 252);">
            <td></td>
            <td v-for="(item,index) in questionTypes" :key="index">{{ item.name }}{{ item. counts!==0?`(${item.counts})`:''}}</td>

          </tr>
          <tr v-if="data.result!='已通过'">
            <td>正确数</td>
            <td v-for="(item,index) in correct" :key="index">{{ item. counts!==0?item.counts+'题':'--'}}</td>
            <td v-if="questionTypes[3].counts==0">--</td>
            <td rowspan="2" v-else>待阅卷</td>
            <td v-if="questionTypes[4].counts==0">--</td>
            
            <td rowspan="2" v-else>待阅卷</td>
          </tr>
          <tr v-else>
            <td>正确数</td>
            <td v-for="(item,index) in correct" :key="index">{{ item. counts!==0?item.counts+'题':'--'}}</td>
            <td v-for="(item,index) in correct1" :key="index">{{ item. counts!==0?item.counts+'题':'--'}}</td>
          </tr>
          <tr v-if="data.result!='已通过'">
            <td>错误数</td>
            <td v-for="(item,index) in error" :key="index">{{ item. counts!==0?item.counts+'题':'--'}}</td>
            <td v-if="questionTypes[3].counts==0">--</td>
            <td v-if="questionTypes[4].counts==0">--</td>
          </tr>
          <tr v-else>
            <td>错误数</td>
            <td v-for="(item,index) in error" :key="index">{{ item. counts!==0?item.counts+'题':'--'}}</td>
            <td v-for="(item,index) in error1" :key="index">{{ item. counts!==0?item.counts+'题':'--'}}</td>
          </tr>
        </table>
      </div>
     
      <div class="button">
        <el-button type="danger"  @click="begin" v-if="Scores==='未通过'">查看答卷</el-button>
        <el-button type="warning" disabled v-if="Scores==='待阅卷'">等待阅卷</el-button>
        <el-button type="success"  @click="begin" v-if="Scores==='已通过'">查看答案</el-button>
        
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import {getForResult} from '../../api/stutest'
  import { useRoute,useRouter } from 'vue-router'
  import { onMounted,reactive ,toRefs,ref} from 'vue'
  import {Back} from '@element-plus/icons-vue'
import { da } from 'element-plus/es/locale';
import { error } from 'console';
import moment from 'moment';
  const route = useRoute()
  const router = useRouter()
  const obj:any = reactive({
    time:'',
    data:[],
    isShow:'',
    questionTypes:[{name:"单选题",counts:0},{name:"多选题",counts:0},{name:"判断题",counts:0},{name:"填空题",counts:0},{name:"问答题",counts:0}],
    correct:[{name:"单选题",counts:0},{name:"多选题",counts:0},{name:"判断题",counts:0}],
    error:[{name:"单选题",counts:0},{name:"多选题",counts:0},{name:"判断题",counts:0}],
    correct1:[{name:"填空题",counts:0},{name:"问答题",counts:0}],
    error1:[{name:"填空题",counts:0},{name:"问答题",counts:0}],
    Scores:String
  }) 
  const GetTest1 =async ()=>{
    let res:any = await getForResult({testid:route.query.id})
    console.log(res)
    // console.log()
    obj.time=moment(res.data.stuEndTime).diff(moment(res.data.studentStartTime), 'minutes')
    console.log(obj.time)
    if(res.errCode ===10000){
      obj.questionTypes.forEach((item:any)=>{
        item.counts = res.data.questions.filter((ite:any)=>ite.type===item.name).length
      })
      obj.correct.forEach((item:any)=>{
        item.counts = res.data.questions.filter((ite:any)=>ite.answer==ite.studentanswer.replace('|','')&&ite.type===item.name).length
      })
      obj.correct1.forEach((item:any)=>{
        item.counts = res.data.questions.filter((ite:any)=>ite.studentscores>0&&ite.type===item.name).length
      })
      // console.log(obj.correct1)
      obj.error.forEach((item:any)=>{
        item.counts = res.data.questions.filter((ite:any)=>ite.answer!=ite.studentanswer.replace('|','')&&ite.type===item.name).length
      })
      obj.error1.forEach((item:any)=>{
        item.counts = res.data.questions.filter((ite:any)=>ite.studentscores<=0&&ite.type===item.name).length
      })
      // console.log(obj.error1)
      if(res.data.result==='未通过'){
        obj.isShow=true
      }else{
        obj.isShow = false
      }
      obj.Scores = res.data.result
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
    router.push({path:'/stuexamwrong',query:{testid:route.query.id}})
  }
  onMounted(() => {
    GetTest1()
  })
  const {data,isShow,questionTypes,correct,error,Scores,time,correct1,error1} = toRefs(obj)
</script>
<style lang="less" scoped>
table,
td,
th {
  text-align: center;
  border: 1px solid #ccc;
  border-collapse: collapse;
}
table{
  margin: 18px auto;
}
table td {
  padding: 10px 20px;
}
.grade_top1{
  color: #e8d208;
  font-size: 60px;
  text-align: center;
  margin-bottom: 50px;
  margin-top: 50px;
}

.el-button--success{
  background-color: #14bd83;
  margin-top: 10px;
}
.grade_top2{
  color: #14bd83;
  margin-bottom: 50px;
  margin-top: 50px;
  font-size: 60px;
  text-align: center;
}
.grade_top8{
  margin-bottom: 50px;
  margin-top: 20px;
  font-size: 25px;
  text-align: center;
}
.wai{
  position: absolute;
  top:-70px;
  left: 600px;
  width: 86px;
  height: 86px;
  border:2px solid red;
  border-radius: 50%;
  .waibox{
    width: 78px;
    height: 78px;
    border: 2px solid rgba(241, 10, 10, 0.374);
    border-radius: 50%;
    margin: 2px auto;
    text-align: center;
    line-height: 78px;
    color: red;
    transform: rotate(330deg);
  }
}
.wai1{
  position: absolute;
  top:-70px;
  left: 600px;
  width: 86px;
  height: 86px;
  border:2px solid #14bd83;
  border-radius: 50%;
  .waibox1{
    width: 78px;
    height: 78px;
    border: 2px solid #14bd8229;
    border-radius: 50%;
    margin: 2px auto;
    text-align: center;
    line-height: 78px;
    color: #14bd83;
    transform: rotate(330deg);
  }
}
  .examprepare{
    width: 100%;
    height: 100%;
    background: url('../../img/bei.png') no-repeat;
    background-size:100% 100%;
    position: absolute;
    background-attachment:fixed;
    line-height:100%;
    .box{
      
      .grade{
        .grade_top{
          color: red;
          font-size: 60px;
          text-align: center;
        }
        .grade_bottom{
          text-align: center;
          font-size: 20px;
          margin-top: 50px;
        }
      }
      .button{
        // margin-top:30px;
        width:300px;
        height: 50px;
        margin:20px auto 0;
        /deep/button{
          width: 100%;
          height: 100%;
        }
      }
      position: relative;
      top: 200px;
      width: 700px;
      height: 450px;
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
        font-size: 15px;
        color: #ccc;
      }
      .line{
        position: relative;
        
        width: 100%;
        height: 1px;
        background-color:#ccc;
        margin-top:20px;
        margin-bottom:30px;
      }
      
    }
  }
</style>