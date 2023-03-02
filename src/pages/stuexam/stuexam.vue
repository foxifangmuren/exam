<template>
  <div class="stu">
    <div class="stubox">
      <div class="stuboxtop">
        {{ list.title}}
      </div>
      <div class="concent" v-for="(item,index) in list.questions" :key="index">
        <div class="concent_top">
          <div class="num">{{ index+1 }}</div>
          <div class="type"> {{ item.type }}</div>
          <div class="score">分值 ：{{item.scores}}</div>
        </div>
        <div class="concent_box">
          
          <span
          class="title"
          v-html="item.type === '填空题' ? rep(item.title, index) : item.title"
        ></span>
          <div class="answers">
            <div class="answersbox">
              <div class="answersbox1"  v-for="(item1,index1) in item.answers" :key="index1" @click="changRadio('单选题',item1,index)" v-if="item.type=='单选题'">
                <div :class="item.studentanswer==null?'box2':item.studentanswer.indexOf(item1.answerno)>-1?'active box2':'box2'">
                  <div :class="item.studentanswer==null?'box3':item.studentanswer.indexOf(item1.answerno)>-1?'box5 box3':'box3'">{{ item1.answerno }}</div>
                  <div class="box4">{{ item1.content}}</div>
                </div>
              </div>
              <div class="answersbox1" v-if="item.type=='判断题'">
                <!-- <div :class="item.studentanswer==null?'box2':item.studentanswer.indexOf(item1.answerno)>-1?'active box2':'box2'">
                  <div :class="item.studentanswer==null?'box3':item.studentanswer.indexOf(item1.answerno)>-1?'box5 box3':'box3'">{{ item1.answerno }}</div>
                  <div class="box4">{{ item1.content}}</div>
                </div> -->
                <div :class="item.studentanswer==='正确'?'active box2':'box2'" @click="judge('正确',index)">
                  <div class="left">
                  <div class="opt">
                    {{ item.studentanswer === "正确" ? "√" : "" }}
                  </div>
                  <span>正确</span>
                </div>
                </div>
                <div :class="item.studentanswer==='错误'?'active box2':'box2'" @click="judge('错误',index)">
                  <div class="left">
                  <div class="opt">
                    {{ item.studentanswer === "错误" ? "√" : "" }}
                  </div>
                  <span>错误</span>
                </div>
                </div>
              </div>
              <div class="answersbox1"  v-for="(item1,index1) in item.answers" :key="index1" @click="changRadio('多选题',item1,index)" v-if="item.type=='多选题'">
                <div :class="item.studentanswer==null?'box2':item.studentanswer.indexOf(item1.answerno)>-1?'active box2':'box2'">
                  <div :class="item.studentanswer==null?'box3':item.studentanswer.indexOf(item1.answerno)>-1?'box5 box3':'box3'">{{ item1.answerno }}</div>
                  <div class="box4">{{ item1.content}}</div>
                </div>
              </div>
              <div class="answersbox1" v-if="item.type=='问答题'">
                <el-input
                  v-model="item.studentanswer"
                  :rows="5"
                  type="textarea"
                  placeholder="Please input"
                />
              </div>
             
              <div></div>
            </div>
          </div>
        </div>
        <div class="line"></div>
        </div>
      </div>
      <div class="sheet">
        <h3>答题卡</h3>
        <div class="board">
          <div class="boardbox" style="background-color: #ccc;"></div><div>已答</div>
          <div class="boardbox" style="background-color: #fff; border: 1px solid #ccc;"></div><div>未答</div>
        </div>
        <div class="conten">
        <div @click="tiao(index)" :class="item.studentanswer==null?'':'box7'" v-for="(item,index) in list.questions" :key="item">{{ index+1 }}</div>
      </div>
      <div class="hand">
        <div class="hand_top">
          <p>
          共<span>{{ list.questions ? list.questions.length : 0 }}</span
          >题，剩余<span>{{ list.questions ?  answered: 0 }}</span
          >题未完成
        </p>
        </div>
        <el-button type="primary" @click="hand">交卷</el-button>
      </div>
    </div>
    
  </div>
</template>
<script lang="ts" setup>
import {getteststart,studentansweradd} from '../../api/stutest'
import { useRoute,useRouter} from 'vue-router'
import{onMounted,reactive,toRefs,nextTick,watch,onUpdated,onBeforeMount,watchEffect} from 'vue'
const route = useRoute()
const router = useRouter()
const obj:any = reactive({
  list:[],
  isActive:false,
  abc:'123',
  answered:0
})

// 替换方法
const rep = (str: string, index: number) => {
  return str.replace(
    /\[\]/g,
    `<input data-index="${index}" onpaste="return false;"  style="margin:0 2px" class="input input${index}" type="text" />`
  );
};
watchEffect(() => {
  // 未答题的数量
  var num: number = 0;
  if (obj.list.id) {
    obj.list.questions.map((item: any) => {
      if (!item.studentanswer) {
        num = num + 1;
      }
    });
  }
  obj.answered = num;
});
//点击交卷按钮
const hand= async()=>{

  let model =   JSON.parse(sessionStorage.getItem('model') as any)
  console.log(model)
  const studentAnswerModel = obj.list.questions.map((item: any) => {
    let correctNum: number = 0;
    if (item.studentanswer && item.type === "多选题") {
      // 正确答案数组
      const answerArr = item.answer.split("|");
      
      
      // 学生答案
      const studentanswerArr = item.studentanswer.split("|").filter((ite:any)=>(ite!=''));
      console.log(answerArr,studentanswerArr);
      answerArr.forEach((itemAnswer: any, index: number) => {
        studentanswerArr.forEach((itemStudentAnswer: any, index2: number) => {
          if (itemAnswer === itemStudentAnswer&&answerArr.length===studentanswerArr.length) {
            correctNum += 1;
          }
        });
      });
    }
    return {
      testid: obj.list.id,
      studentid: model.id,
      questionid: item.id,
      answer: item.studentanswer === null ? "" : item.studentanswer,
      scores:
        item.type === "问答题" || item.type === "填空题"
          ? null
          : item.type === "单选题" || item.type === "判断题"
          ? item.studentanswer === item.answer
            ? item.scores
            : 0
          : !item.studentanswer
          ? 0
          : correctNum === item.answer.split("|").length
          ? item.scores
          : 0,
    };
  });
  // console.log(studentAnswerModel
  let res:any = await studentansweradd(studentAnswerModel)
  console.log(res)
  if(res.errCode===10000){
    router.push('/stutest')
  }
}
//判断题判断对错
const judge = (e:string,index:number)=>{
  obj.list.questions[index].studentanswer=e
}
//点击单选框

const changRadio=(type:String,item: any,index:any)=>{
  // console.log(item)
  console.log(item.type)
  if(type=='单选题'){
    obj.list.questions[index].studentanswer = item.answerno
  }else if(type=='多选题'){
    console.log(1123)
    if (obj.list.questions[index].studentanswer == null) {
      obj.list.questions[index].studentanswer = "|" + item.answerno;
    } else {
      let arrIndex = obj.list.questions[index].studentanswer.indexOf(item.answerno);
      if (arrIndex > -1) {
        obj.list.questions[index].studentanswer = obj.list.questions[
          index
        ].studentanswer.replace("|" + item.answerno, "");
      } else {
        obj.list.questions[index].studentanswer =
        obj.list.questions[index].studentanswer + "|" + item.answerno;
      }
    }
  }
   
    
  }
  const tiao=(index:any)=>{
    // console.log(index)
    document.getElementsByClassName('concent')[index].scrollIntoView({behavior:'smooth'})
    console.log(document.getElementsByClassName('concent')[index])
    console.log(document.querySelectorAll('input'))
  }
const getList =async ()=>{
  let res:any = await getteststart({testid:route.query.testid})
  console.log(res)
  if(res.errCode===10000){

    obj.list = res.data
  }
  console.log(obj.list)
}
onUpdated(()=>{
  document.querySelectorAll(".input").forEach((item: any) => {
        item.oninput = function () {
          let _index = this.getAttribute("data-index");
          let vals: any = [];
          document.querySelectorAll(".input" + _index).forEach((itm: any) => {
            console.log(itm.value)
            if (itm.value) vals.push(itm.value);
          });
          obj.list.questions[_index].studentanswer =
            vals.length == 0 ? null : vals.join("|");
        };
      });
})

onBeforeMount(() => {
  getList()
})
nextTick(()=>{
  console.log(document.querySelectorAll('input'))
})

const {list,isActive,answered} = toRefs(obj)
</script>
<style lang="less" scoped>
html{
  font-size: 13px;
}
 .active{
        border: 1px solid #3d80eb;
        background-color: #f1f5fb;
  }
  .box7{
    background-color: #ccc;
  }
.box2{
  font-size: 13px;
  width: 75%;
  height: 40px;
  display: flex;
  align-items: center;
  // background-color: #fff;
  align-items: center;
  line-height: 40px;
  margin-bottom: 20px;
 
  .box3{
    margin-right: 10px;
    width: 30px;
    height: 30px;
    background-color: #fff;
    border-radius: 50%;
    text-align: center;
    line-height: 35px;
  }
  .box5{
    background-color: #3d80eb;
  }
}
.stu{
  width: 100%;
  height: 100%;
  background-color:#eee;
  .conten{
    display: flex;
    margin-top: 25px;
    margin-left: 20px;
    flex-wrap: wrap;
    div{
      width: 30px;
      margin-bottom: 15px;
      margin-right: 15px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      border: 1px solid #ccc;
      font-size: 12px;
    }
  }
  .sheet{
    position: fixed;
    top:0;
    right:0;
    width: 300px;
    height: 100%;
    background-color: #fff;
    .hand{
      position: fixed;
      right: 22px;
      bottom: 10px;
      width: 250px;
      height: 60px;
      margin: 0 auto;
      .hand_top{
        font-size: 12px;
        margin-bottom: 10px;
        color: #666;
      }
      /deep/button{
        width: 100%;
      }
    }
    h3{
      margin-left: 20px;
      margin-top: 20px;
    }
    .board{
      margin-left: 10px;
      margin-top: 25px;
      display: flex;
      font-size: 13px;
      .boardbox{
        margin-right: 10px;
        margin-left: 10px;
        width: 15px;
        height: 15px;
      }
    }
  }
  .stubox{
    background-color: #eee;
    padding-top:20px;
    .stuboxtop{
      font-size: 30px;
      width: 60%;
      height: 50px;
      margin-left: 50px;
      border-bottom:1px solid #ccc;
    }
  }
  .concent{
    background-color: #eee;
    margin:50px 30px 0;
    
    .concent_top{
      display:flex;
      .num{
        font-size: 15px;
        width: 25px;
        height: 23px;
        background-color:#3d80eb;
        color:#fff;
        text-align:center;
        border-radius:5px 0 0 5px;
        line-heigt:23px;      
      }
      .type{
        font-size: 15px;
        width:70px;
        height: 21px;
        background-color:'#fff';
        border:1px solid #3d80eb;
        border-radius:0 5px 5px 0;
        color:#3d80eb;
        text-align:center;
        line-heigt:23px;      
      }
      .score{
        color:#ccc;
        font-size:12px;
        margin:4px 10px;
      }
    }
    .concent_box{
      margin-top:30px;
      font-size: 15px;
      .answers{
        margin:20px;
      }
    }
    .line{
      width: 60%;
      height: 1px;
      background-color:#ccc;
      margin-top:60px;
    }
  }
  
}
</style>