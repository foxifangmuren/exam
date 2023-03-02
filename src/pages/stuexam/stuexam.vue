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
          共1题，还剩1题未完成
        </div>
        <el-button type="primary">交卷</el-button>
      </div>
    </div>
    
  </div>
</template>
<script lang="ts" setup>
import {getteststart} from '../../api/stutest'
import { useRoute,useRouter} from 'vue-router'
import{onMounted,reactive,toRefs,nextTick} from 'vue'
const route = useRoute()
const obj:any = reactive({
  list:[],
  isActive:false
})

// 替换方法
const rep = (str: string, index: number) => {
  return str.replace(
    /\[\]/g,
    `<input data-index="${index}" onpaste="return false;" style="margin:0 2px" class="input input${index}" type="text" />`
  );
};
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

  }
const getList =async ()=>{
  let res:any = await getteststart({testid:route.query.testid})
  console.log(res)
  if(res.errCode===10000){

    obj.list = res.data
  }
  console.log(obj.list)
}

onMounted(() => {
  getList()
})
const {list,isActive} = toRefs(obj)
</script>
<style lang="less" scoped>
 .active{
        border: 1px solid #3d80eb;
        background-color: #fff;
  }
  .box7{
    background-color: #ccc;
  }
.box2{
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
        width: 25px;
        height: 23px;
        background-color:#3d80eb;
        color:#fff;
        text-align:center;
        border-radius:5px 0 0 5px;
        line-heigt:23px;      
      }
      .type{
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