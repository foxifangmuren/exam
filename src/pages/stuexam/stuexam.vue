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
                <div :class="item.studentanswer==null?'box9':item.studentanswer.indexOf(item1.answerno)>-1?'active box9':'box9'">
                  <div :class="item.studentanswer==null?'box3':item.studentanswer.indexOf(item1.answerno)>-1?'box5 box3':'box3'">{{ item1.answerno }}</div>
                  <div class="box4">{{ item1.content}}</div>
                </div>
              </div>
              <div class="answersbox9" v-if="item.type=='问答题'">
                <el-input
                  v-model="item.studentanswer"
                  :rows="5"
                  type="textarea"
                  placeholder=""
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
          <div class="boardbox" style="background-color: #f0f8ff;"></div><div>已答</div>
          <div class="boardbox" style="background-color: #fff; border: 1px solid #ccc;"></div><div>未答</div>
        </div>
        <div class="conten">
        <div @click="tiao(index)" :class="item.studentanswer=='' || item.studentanswer==null?'':'box7'" v-for="(item,index) in list.questions" :key="item">{{ index+1 }}</div>
      </div>
      <div class="hand">
        <div class="hand_top">
          <p>
          共<span>{{ list.questions ? list.questions.length : 0 }}</span
          >题，剩余<span>{{ list.questions ?  answered: 0 }}</span
          >题未完成
        </p>
        </div>
        <el-popconfirm
          @confirm="hand"
          :title="
            (list.questions
              ? answered > 0
                ? '你还有' + (list.questions ? answered : 0) + '题未答'
                : '答题时间未结束'
              : 0) + '，确定要提交吗?'
          "
        >
          <template #reference>
            <!-- <el-button class="but" type="primary">交卷</el-button> -->
            <el-button type="primary" >交卷</el-button>
          </template>
        </el-popconfirm>
       
      </div>
    </div>
    <div class="timeBox" v-if="list.limittime > 0">
      <el-icon><AlarmClock /></el-icon>
      <p class="title">倒计时</p>
      <p class="time">{{ endTime }}</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {getteststart,studentansweradd} from '../../api/stutest'
import { useRoute,useRouter} from 'vue-router'
import{onMounted,reactive,toRefs,nextTick,watch,onUpdated,onBeforeMount,watchEffect,onUnmounted} from 'vue'
const route = useRoute()
const router = useRouter()
const obj:any = reactive({
  list:[],
  isActive:false,
  abc:'123',
  answered:0,
  endTime:0
})
// 试题打乱方法
const shuffle = (arr: any) => {
  for (let i = 0; i < arr.length; i++) {
    var randomIndex = Math.floor(Math.random() * (i + 1));
    var itemAtIndex = arr[randomIndex];
    arr[randomIndex] = arr[i];
    arr[i] = itemAtIndex;
  }
  return arr;
};
// 是否打乱试题
if (obj.list.qorder === 1) {
      obj.list.questions = shuffle(obj.list.questions);
    }
    // 是否打乱选项
    if (obj.list.aorder === 1) {
      obj.list.questions.forEach((item: any) => {
        if (item.type === "单选题" || item.type === "多选题") {
          item.answers = shuffle(item.answers);
        }
      });
    }
let ass = JSON.parse(sessionStorage.getItem('model') as any)
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
    router.push({path:'examresults',query:{id:obj.list.id}})
  }
}
//判断题判断对错
const judge = (e:string,index:number)=>{
  obj.list.questions[index].studentanswer=e
}
//点击单选框

const changRadio=(type:String,item: any,index:any)=>{
  if(type=='单选题'){
    obj.list.questions[index].studentanswer = item.answerno
  }else if(type=='多选题'){
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
    console.log(obj.list)
  }
  }
  const tiao=(index:any)=>{
    // console.log(index)
    document.getElementsByClassName('concent')[index].scrollIntoView({behavior:'smooth'})
  }
const getList =async ()=>{
  let res:any = await getteststart({testid:route.query.testid})
  console.log(res)
  if(res.errCode===10000){

    obj.list = res.data
    let daima = JSON.parse(
      localStorage.getItem("examInfo" + obj.list.id) as string
    );
    if (daima != null && daima != ""&&ass.id==daima.studentId) {
      if (obj.list.id === daima.id) {
        obj.list = daima;
        // 填空题回显数据
        nextTick(() => {
          document.querySelectorAll(".input").forEach((item: any) => {
            let _index = item.getAttribute("data-index");
            document
              .querySelectorAll(".input" + _index)
              .forEach((ite: any, index: number) => {
                ite.value =
                  daima.questions[_index].studentanswer.split("|")[index] ===
                  undefined
                    ? ""
                    : (daima.questions[_index].studentanswer || "").split("|")[index];
              });
          });
        });
      } else {
        obj.list = res.data;
      }
    }
    if (list.value.limittime > 0) {
      var timer = setInterval(() => {
        //获取当前时间
        var date = new Date();
        var now = Number(date);
        //设置截止时间
        var end =
          Number(new Date(obj.list.studentStartTime)) +
          list.value.limittime * 60 * 1000;
        //获取截止时间和当前时间的时间差
        var leftTime = end - now;
        //定义变量 d,h,m,s分别保存天数，小时，分钟，秒
        var d: any, h, m, s;
        //判断剩余天数，时，分，秒
        if (leftTime > 0) {
          d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
          h = Math.floor((leftTime / 1000 / 60 / 60) % 24);
          m = Math.floor((leftTime / 1000 / 60) % 60);
          s = Math.floor((leftTime / 1000) % 60);
          if (String(h).length === 1) {
            h = "0" + h;
          }
          if (String(m).length === 1) {
            m = "0" + m;
          }
          if (String(s).length === 1) {
            s = "0" + s;
          }
          obj.endTime = h + ":" + m + ":" + s;
        } else {
          obj.endTime = "00:00:00";
          clearInterval(timer);
          hand();
        }
      }, 1000);
    }
  }
  console.log(obj.list)
}
getList()
onBeforeMount(() => {
  getList()
})
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

console.log(obj.list)
const setItem=()=>{
  localStorage.setItem(
    "examInfo" + obj.list.id,
    JSON.stringify({...obj.list,studentId:ass.id})
  );
}

// 浏览器属性事件
// /添加监听事件，监听后退，前进
window.onbeforeunload= function () {
  setItem()
};

// 卸载钩子
onUnmounted(() => {
  setItem()
});

const {list,isActive,answered,endTime} = toRefs(obj)
</script>
<style lang="less" scoped>
.left{
  display: flex;
  align-items: center;
}
.answersbox9{
  width: 1000px;
}
.opt{
  width: 20px;
  height: 20px;
  border: 1px solid #3d80eb;
  border-radius: 50%;
  text-align: center;
  line-height: 20px;
  margin-right: 20px;
}
html{
  font-size: 13px;
}
.answersbox1{
  margin-left: 20px;
}

.timeBox{
  position: fixed;
  top: 50px;
  right: 300px;
  width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 120px;
  border-radius: 10px;
  color: #fff;
  .el-icon{

    font-size: 35px;
    margin: 10px auto;
  }
  background-color: rgb(247, 88, 74);
  p{
    padding: 5px;
  }
}
.active{
        border: 1px solid #3d80eb;
        background-color: #f1f5fb;
        width: 1000px;
  }
  .box7{
    background-color: #f0f8ff;
    color: #aab4fd;
  }
  .box9{
    font-size: 13px;
  width: 60%;
  height: 40px;
  display: flex;
  align-items: center;
  // background-color: #fff;
  align-items: center;
  padding-left: 10px;
  line-height: 40px;
  margin-bottom: 20px; 
  .box3{
    margin-right: 10px;
    width: 30px;
    height: 30px;
    background-color: #fff;
    // border-radius: 50%;
    text-align: center;
    line-height: 35px;
  }
  .box5{
    background-color: #3d80eb;
  }
  }
.box2{
  font-size: 13px;
  width: 60%;
  height: 40px;
  display: flex;
  align-items: center;
  // background-color: #fff;
  align-items: center;
  padding-left: 10px;
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
        line-height:23px;      
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
        line-height:23px;      
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
        margin:20px 0;
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