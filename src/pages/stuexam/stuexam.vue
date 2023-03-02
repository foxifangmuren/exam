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
          <div v-html="item.title " style="width: 400px;"></div>
          <div class="answers">
            <div class="answersbox" v-for="(item1,index) in item.answers" :key="index1">
              <div class="answersbox1" @click="changRadio(item1,index)">
                <div :class = "isActive === index ? 'box2 active' : 'box2'">
                  <div :class = "isActive === index ? 'box3 box5' : 'box3'">{{ item1.answerno }}</div>
                  <div class="box4">{{ item1.content}}</div>
                </div>
                
              </div>
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
        <div v-for="(item,index) in index1" :key="item">{{ item }}</div>
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
import{onMounted,reactive,toRefs} from 'vue'
const route = useRoute()
const obj:any = reactive({
  list:[],
  index1:[],
  isActive:false
})
//点击单选框

const changRadio=(item: any,index:any)=>{
    console.log('item', item);
    obj.isActive = index
    
  }
const getList =async ()=>{
  let res:any = await getteststart({testid:route.query.testid})
  console.log(res)
  if(res.errCode===10000){

    obj.list = res.data
    obj.index1 = obj.list.questions.map((item:Number,index:any)=>{
      return index+1
      // console.log(123)
    })
  }
  console.log(obj.list)
}

onMounted(() => {
  getList()
})
const {list,index1,isActive} = toRefs(obj)
</script>
<style lang="less" scoped>
 .active{
        border: 1px solid #3d80eb;
        background-color: #fff;
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