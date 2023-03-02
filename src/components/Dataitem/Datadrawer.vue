<template>
<div>
      <!-- 侧栏弹框  试题详情-->
    <el-drawer v-model="drawer"
      title="试题详情"
      :close-on-click-modal="true"
      size="50%"
    >
    <!-- 弹框内容 -->
      <div class="body">
        <!-- 单选题  -->
        <div v-if="list.type == '单选题'">
          <!-- 题型  -->
          <div class="Project">
            <p>单选题</p>
            <span>分值：{{ list.scores }}</span>
          </div>
          <!-- 内容 -->
          <div class="typecontent">{{ list.title }}</div>
          <!-- 答案 -->
          <div v-for="(item, index) in list.answers" :key="index">
            <div
              :class="
                list.answer != item.answerno ? 'correct' : 'sueers'
              "
            >
              <p>{{ item.answerno }}</p>
              <span>{{ item.content }}</span>
            </div>
          </div>
        </div>
        <!-- 多选题  -->
        <div v-if="list.type == '多选题'">
          <!-- 题型  -->
          <div class="Project">
            <p>多选题</p>
            <span>分值：{{ list.scores }}</span>
          </div>
          <!-- 内容 -->
          <div class="typecontent">
            <span v-html="list.title"></span>
          </div>
          <!-- 答案 -->
            <div v-for="(ite, index) in list.answers" :key="index">
            <!-- {{ite}} -->
              <div :class="! list.answer.includes(ite.answerno) ? 'correct' : 'sueers'">
                <p>{{ ite.answerno }}</p>
                <span>{{ ite.content }}</span>
              </div>
            </div>
        </div>
        <!-- 问答题  -->
        <div v-if="list.type == '问答题'">
          <!-- 题型  -->
          <div class="Project">
            <p>问答题</p>
            <span>分值：{{list.scores }}</span>
          </div>
          <!-- 内容 -->
          <div  class="typecontent"><span v-html="list.title"></span></div>
          <!-- 答案 -->
          <div>
            <div class="analysis">
              <p>答案解析</p>
              <span>{{list.answer}}</span>
            </div>
          </div>
        </div>
        <!-- 判断题  -->
        <div v-if="list.type == '判断题'">
          <!-- 题型  -->
          <div class="Project">
            <p>判断题</p>
            <span>分值：{{ list.scores}}</span>
          </div>
          <!-- 内容 -->
          <div class="typecontent"><span v-html="list.title"></span></div>
          <!-- 答案 -->
          <div>
            <div class="sueers">
              <p>正确答案</p>
              <span>{{list.answer}}</span>
            </div>
          </div>
        </div>
        <!-- 填空题 -->
        <div v-if="list.type == '填空题'">
          <!-- 题型  -->
          <div class="Project">
            <p>填空题</p>
            <span>分值：{{list.scores}}</span>
          </div>
          <!-- 内容 -->
          <div class="typecontent"><span v-html="list.title"></span></div>
          <!-- 答案 -->
          <div>
            <div class="sueers">
              <p>正确答案</p>
              <span><span>{{list.answer}}</span></span>
            </div>
            <div class="analysis">
              <p>答案解析</p>
              <span>答案没有先后顺序</span>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
</div>
</template>
<script lang='ts' setup>
import {ref,} from "vue";
/**
 * 详情侧边栏
 * 接受参数
 * 显示隐藏
 */
//接受参数---定义
const drawer=ref(false)
//接受参数--暴露
defineExpose({drawer})
interface Props{
  list:Object
}
defineProps<Props>()
</script>
<style scoped lang="less">
/* 试题详情布局 */
.Project {
  display: flex;
  align-items: flex-end;
  p {
    font-size: 20px;
    color: #666;
    margin-right: 20px;
  }
  span {
    font-size: 14px;
    color: #999;
  }
}
.correct {
  display: flex;
  height: 40px;
  line-height: 40px;
  margin-bottom: 10px;
  padding: 0 20px;
  p {
    margin-right: 20px;
  }
}
.typecontent {
  line-height: 40px;
}
.analysis {
  background-color: #f6faff;
  display: flex;
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
}
.sueers {
  color: #84d5b1;
  background-color: #f0faf6;
  display: flex;
  line-height: 40px;
  margin-bottom: 10px;
  padding: 0 20px;
  p {
    margin-right: 20px;
  }
}
.body{
  font-size: 18px;
}
:deep(.el-drawer__title){
  font-size: 25px;
}
</style>