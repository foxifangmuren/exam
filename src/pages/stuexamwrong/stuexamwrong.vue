<template>
  <div class="stu">
    <div class="stubox">
      <div class="stuboxtop">
        {{ List.title }}
      </div>
      <div class="concent" v-for="(item,index) in List.questions">
        <div class="concent_top">
          <div class="num">{{ index+1 }}</div>
          <div class="type">{{ item.type }}</div>
          <div class="score">分值 ：{{ item.scores }}</div>
        </div>
        <div class="concent_box">
          <div>
            <span
            class="title"
            v-if="item.type !== '填空题'"
            v-html="item.title"
          ></span>
          <span
            class="title"
            v-if="item.type === '填空题'"
            style="display: flex; flex-wrap: wrap"
            v-html="rep(item.title, index)"
          ></span>
          </div>
          <div class="answers">
            <div class="answersbox" v-if="item.type==='单选题'" v-for="(item1,index) in item.answers" :key="index1">
              <div class="answersbox1">
                 <div :class="item.studentanswer==item1.answerno?item.answer==item1.answerno?'box2 active':'box2 active1':'box2'">
                  <div  :class="item.studentanswer==item1.answerno?'box3 box5':'box3'">
                    {{ item1.answerno }}
                  </div>
                  <div class="box4">
                    {{ item1.content }}
                  </div>
                 </div>
              </div>
            </div>
            <div class="answersbox" v-if="item.type==='判断题'">
              <div class="answersbox1">
                 <div class="judge">
                  <span class="quan"></span><span>正确</span>
                 </div>
                 <div class="judge">
                  <span class="quan"></span><span>错误</span>
                 </div>
              </div>
            </div>
            <div class="answersbox3" v-if="item.type==='问答题'">
              <div>
                答：
                <div class="answer"></div>
              </div>
            </div>
            <div class="answersbox" v-if="item.type==='多选题'" v-for="(item1,index) in item.answers" :key="index1">
              <div class="answersbox1">
                 <div :class=" item.answer.includes(item1.answerno)?item.studentanswer.includes(item1.answerno)?'box2 active':'box2':item.studentanswer.includes(item1.answerno)?'box2 active1':'box2'">
                  <div  :class="item.answer.includes(item1.answerno)?item.studentanswer.includes(item1.answerno)?'box3 box5':'box3':item.studentanswer.includes(item1.answerno)?'box3 box5':'box3'">
                    {{ item1.answerno }}
                  </div>
                  <div class="box4">
                    {{ item1.content }}
                  </div>
                 </div>
              </div>
            </div>
            <div style="margin-top: 20px;"> <span v-if="item.type!=='问答题'">正确答案 </span><span v-if="item.type==='单选题'" class="correct">{{ item.answer }}</span> <span class="correct" v-if="item.type==='多选题'" v-for="(item1,index1) in item.answer" :key="index1">{{ item1 }}</span>
              <span v-if="item.type==='判断题'" class="correct1">{{ item.answer }}</span>
              <span v-if="item.type==='填空题'" class="correct1">{{ item.answer }}</span>
              <br>
              <span v-if="item.type=='问答题'">答案解析</span><span v-if="item.type=='问答题'||item.type=='填空题'">{{item.explains}}</span>
            </div>
          </div>
          
        </div>
        <div class="line"></div>
        </div>
      </div>
      <div class="sheet">
        <h3>答题卡</h3>
        <div class="board">
          <div class="boardbox" style="background-color: #97d3af;"></div><div>正确</div>
          <div class="boardbox" style="background-color: #fcf2f0; border: 1px solid #ccc;"></div><div>错误</div>
        </div>
        <div class="conten">
          <!-- <div :class="item==true?'dui':'red'" @click="tiao(index)" v-for="(item,index) in index1" :key="item">{{ index+1 }}</div> -->
          <div :class="item.studentscores > 0 ? 'dui' : 'red'" @click="tiao(index)" v-for="(item,index) in List.questions" :key="index">{{ index+1 }}</div>
       </div>
      </div>
      
  </div>
</template>
<script lang="ts" setup>
  import {reactive,onMounted,toRefs,nextTick} from 'vue'
  import {getForResult} from '../../api/stutest'
  import { useRoute,useRouter} from 'vue-router'
  const route = useRoute()
  const obj:any = reactive({
    List:[],
    index1:[],
    classs:String
  })
  // 替换方法
const rep = (str: string, index: number) => {
  return str.replace(
    /\[\]/g,
    `<div style="min-width:50px;height:18px;border-bottom: 1px solid #999;padding:0 10px;margin:0 1px" data-index=${index} class="boxs boxs${index}"></div>`
  );
};

  const getList = async ()=>{
    let res:any = await getForResult({testid:route.query.testid})
    console.log(res)
    if(res.errCode===10000){
      obj.List = res.data
      obj.List.questions = obj.List.questions.map((item: any) => {
      if (item.type === "多选题") {
        return {
          ...item,
          studentanswer:item.studentanswer.substr(1).split("|"),
          answer: item.answer.split("|"),
        };
      } else {
        return item;
      }
    });
      console.log(obj.List)
    }
    
    nextTick(() => {
      const boxDom: any = document.querySelectorAll(".boxs");
      boxDom.forEach((item: any) => {
        var _index = item.getAttribute("data-index");
        document
          .querySelectorAll(".boxs" + _index)
          .forEach((ite: any, index: number) => {
            ite.innerHTML =
              obj.List.questions[_index].studentanswer.split("|")[index];
          });
      });
    });
    console.log(obj.List)
  }
  const tiao=(index:any)=>{
    // console.log(index)
document.getElementsByClassName('concent')[index].scrollIntoView({behavior:'smooth'})

  }
  onMounted(() => {
    getList()
  })
  const {List,index1} = toRefs(obj)
</script>
<style lang="less" scoped>
.answersbox3{
  margin-left: -20px;
}
.judge{

  display: flex;
  align-items: center;
  .quan{
    display: inline-block;
    width: 15px;
    height: 15px;
    border: 1px solid #ccc;
    border-radius: 50%;
    margin-right: 10px;
  }
}
.answer{
  width: 800px;
  height: 50px;
  background-color: #f5f7fa;
  margin-top: 20px;
  margin-bottom: 20px;
}
.correct{
  display: inline-block;
  width: 25px;
  height: 25px;
  line-height: 25px;
  border-radius: 50%;
  text-align: center;
  color: #fff;
  background-color: #4cc0a4;
  margin-right: 10px;
}
 .active{
        // border: 1px solid #3d80eb;
        background-color: #f0faf6;
  }
  .red{
    background-color: #fcf2f0;
    color: #e9747f;
  }
  .dui{
    background-color: #eefaf5;
    color: #97d3af;
  }
  .active1{
    border: 1px solid #3d80eb;
        background-color: #d30e0e30;
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
        line-height:23px;      
      }
      .type{
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
</style>