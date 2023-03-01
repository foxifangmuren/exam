<template>
  <div>
    <el-dialog
      close-on-press-escape
      top="3vh"
      width="80%"
      v-model="dialogTableVisible"
      :title="title"
    >
      <!-- 头部 -->
      <div class="header">
        <div class="felx">
          <div>
            <p class="margin_bottom">总分</p>
            <p>{{ data.scores }}</p>
          </div>
          <div style="width: 200px">
            <p class="margin_bottom">添加时间</p>
            <p>{{ data.addtime }}</p>
          </div>
        </div>
        <div>
          <el-button type="primary" size="default" @click="down"
            >下载导出</el-button
          >
        </div>
      </div>
      <!-- 底部 -->
      <div class="bottom">
        <div class="bottom_up">
          <!-- 弹框内容 -->
          <div v-for="(item, index) in data.questions" :key="index">
            <!-- 单选题  -->
            <div class="padding" v-if="item.type == '单选题'">
              <!-- 题型  -->
              <div class="Project">
                <p>单选题</p>
                <span>分值：{{ item.scores }}</span>
              </div>
              <!-- 内容 -->
              <div class="typecontent"><span v-html="item.title"></span></div>
              <!-- 答案 -->
              <div v-for="(items, index) in item.answers" :key="index">
                <div
                  :class="item.answer != items.answerno ? 'correct' : 'sueers'"
                >
                  <p>{{ items.answerno }}</p>
                  <span>{{ items.content }}</span>
                </div>
              </div>
            </div>

            <!-- 多选题  -->
            <div class="padding" v-if="item.type == '多选题'">
              <!-- 题型  -->
              <div class="Project">
                <p>多选题</p>
                <span>分值：{{ item.scores }}</span>
              </div>
              <!-- 内容 -->
              <div class="typecontent">
                <span v-html="item.title"></span>
              </div>
              <!-- 答案 -->
              <div v-for="(ite, index) in item.answers" :key="index">
                <!-- {{ite}} -->
                <div
                  :class="
                    !item.answer.includes(ite.answerno) ? 'correct' : 'sueers'
                  "
                >
                  <p>{{ ite.answerno }}</p>
                  <span>{{ ite.content }}</span>
                </div>
              </div>
            </div>
            <!-- 问答题  -->
            <div class="padding" v-if="item.type == '问答题'">
              <!-- 题型  -->
              <div class="Project">
                <p>问答题</p>
                <span>分值：{{ item.scores }}</span>
              </div>
              <!-- 内容 -->
              <div class="typecontent"><span v-html="item.title"></span></div>
              <!-- 答案 -->
              <div>
                <div class="analysis">
                  <p>答案解析</p>
                  <span>{{ item.answer }}</span>
                </div>
              </div>
            </div>
            <!-- 判断题  -->
            <div class="padding" v-if="item.type == '判断题'">
              <!-- 题型  -->
              <div class="Project">
                <p>判断题</p>
                <span>分值：{{ item.scores }}</span>
              </div>
              <!-- 内容 -->
              <div class="typecontent"><span v-html="item.title"></span></div>
              <!-- 答案 -->
              <div>
                <div class="sueers">
                  <p>正确答案</p>
                  <span>{{ item.answer }}</span>
                </div>
              </div>
            </div>
            <!-- 填空题 -->
            <div class="padding" v-if="item.type == '填空题'">
              <!-- 题型  -->
              <div class="Project">
                <p>填空题</p>
                <span>分值：{{ item.scores }}</span>
              </div>
              <!-- 内容 -->
              <div class="typecontent"><span v-html="item.title"></span></div>
              <!-- 答案 -->
              <div>
                <div class="sueers">
                  <p>正确答案</p>
                  <span
                    ><span>{{ item.answer }}</span></span
                  >
                </div>
                <div class="analysis">
                  <p>答案解析</p>
                  <span>答案没有先后顺序</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script lang='ts' setup>
import { ref } from "vue";
import { exportExcel } from "@/api/Subjects";
import { downLoadBlob } from "@/utils/download";
//接受参数
const dialogTableVisible = ref(false);
defineExpose({
  dialogTableVisible,
});
//接受id
interface Props {
  data: any;
  title: string;
}
const props = defineProps<Props>();
//下载导出
const down = async () => {
  const src = await exportExcel({ id: props.data.id }).then((src: any) => {
    downLoadBlob(src, props.data.title);
  });
};
</script>
<style scoped lang="less">
.padding {
  padding: 15px 10px;
}
.felx {
  display: flex;
  div {
    width: 100px;
  }
}
.header {
  display: flex;
  justify-content: space-between;
  height: 80px;
}
.margin_bottom {
  margin-bottom: 20px;
}
.bottom {
  height: 70vh;
  overflow: auto;
  .bottom_up {
    padding-bottom: 300px;
  }
}
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
.body {
  font-size: 18px;
}
:deep(.el-drawer__title) {
  font-size: 25px;
}
</style>