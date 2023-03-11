<template>
    <div>
        <el-drawer :model-value="props.table" :title="forResultItem.name + '的试卷'" direction="rtl" size="50%"
            :before-close="handleClose">
            <div class="top">
                <p>得分：{{ forResultItem.scores }} </p>
                <p>总分：{{ forResultItem.scores }}</p>
                <p>通过分数：{{ forResultItem.pastscores }}</p>
                <p v-if="forResultItem.stuEndTime">考试用时:{{ moment(ForResultList.questions.stuEndTime).diff(ForResultList.questions.stuBeginTime) }}</p>
                <p>交卷时间:{{ forResultItem.stuEndTime }}</p>
            </div>
            <div class="questionBox" v-for="(item, index) in ForResultList.questions" :key="index">
                <div class="li">
                    <div class="questionstype">
                        <div class="type">
                            <div class="num">{{ index + 1 }}</div>
                            <div class="typetitle">{{ item.type }}</div>
                        </div>
                        <span class="score">分值：{{ item.scores }}</span>
                        <div class="getscore">
                            得分：{{ item.studentscores }}
                        </div>
                    </div>
                    <div class="tiile">
                        <span v-html="item.title"></span>
                    </div>
                    <!-- 选择 -->
                    <div class="optionlist" v-if="item.type == '单选题' || item.type == '多选题'">
                        <div :class="item.studentscores && item.answer.includes(items.answerno) ? 'optionli correct' : (item.studentanswer.includes(items.answerno) ? 'optionli error' : 'optionli correct')"
                            v-for="items in item.answers">
                            <div class="left">
                                <div class="rond">{{ items.answerno }}</div>
                                <span>{{ items.content }}</span>
                            </div>
                            <div class=" right" v-if="item.studentscores && item.answer.includes(items.answerno)">
                                回答正确
                            </div>
                            <div class=" right"
                                v-if="item.studentscores == 0 && item.studentanswer.includes(items.answerno)">
                                回答错误
                            </div>
                        </div>
                    </div>
                    <!-- 问答题 -->
                    <div class="wqtion" v-if="item.type == '问答题' || item.type == '填空题'">
                        <div class="ans">答：</div>
                        <div class="answer">
                            {{ item.studentanswer }}
                        </div>
                        <div class="answer correct">正确答案{{ item.answer }}</div>
                        <div class="parse">
                            答案解析：{{item.explains   }}
                        </div>
                    </div>
                    <div class="answer" v-if="item.type=='单选题'||item.type=='多选题'" >
                        <span v-if="item.type=='单选题'">正确答案：{{ item.answer }}</span>
                        <span>正确答案</span> <span v-if="item.type=='多选题'" v-for="items in item.answer.split('|')">{{items}} </span>
                    </div>
                </div>

            </div>

        </el-drawer>

    </div>
</template>

<script setup lang="ts">
import { reactive, ref, toRefs, onMounted } from 'vue'
import { ElDrawer, ElMessageBox } from 'element-plus'
import moment from 'moment';
const props = defineProps(['table', 'forResultItem', 'ForResultList'])
const emit = defineEmits(['close'])

// console.log(ForResultList.value.questions);
onMounted(() => {
    const data = reactive({
        forResultItem: '',
        ForResultList: ''
    })
    const { ForResultList, forResultItem } = toRefs(data)
    forResultItem.value = props.forResultItem
    ForResultList.value = props.ForResultList
})

const handleClose = () => {
    emit('close', false)
}
</script>

<style scoped lang="less">
.top {
    display: flex;

    p {
        margin: 10px;
    }
}

.questionBox {

    .li {
        border-top: 1px solid #ececec;
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        width: 98%;
        padding-bottom: 20px;
        border-bottom: 1px #f0f0f0 solid;
        padding-top: 15px;

        .questionstype {
            display: flex;
            align-items: center;

            .type {
                height: 20px;
                width: 80px;
                border: 1px #3377f9 solid;
                display: flex;
                border-radius: 5px;
                overflow: hidden;
                font-size: 13px;

                .num {
                    width: 30%;
                    height: 100%;
                    background-color: #3377f9;
                    color: #fff;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .typetitle {
                    flex: 1;
                    height: 100%;
                    background-color: #f1f5fb;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: #3377f9;
                }
            }

            .score {
                font-size: 12px;
                color: #aca4ab;
                margin: 0 10px
            }

            .getscore {

                height: 16px;
                font-size: 12px;
                border: #ee0000 solid 1px;
                border-radius: 3px;
                color: #e00;
                padding: 0 5px;

            }
        }

        .tiile {
            margin: 20px 0;
        }

        .optionlist {
            .optionli {
                height: 35px;
                width: 100%;
                padding: 0 10px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-radius: 3px;
                margin-bottom: 10px;

                .left {
                    display: flex;

                    .rond {
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        font-size: 12px;
                        border: #d3d4d8 1px solid;
                        color: #777f86;
                        background-color: #fff;
                        margin-right: 5px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                }

                .right {
                    font-size: 12px;

                }
            }

            .correct {
                background-color: #f0faf6;
                border: 1px solid #f0faf6;

                .right {
                    font-size: 12px;
                    color: #4cc0a4;
                    display: block;
                }
            }

            .error {
                background-color: #fcf3f3;
                border: 1px solid #0089ff;

                .right {
                    font-size: 12px;
                    color: #e25e61;
                    display: block;
                }
            }
        }

        .wqtion {
            .ans {
                font-size: 15px;
            }

            .answer {
                background-color: #f5f7fa;
                padding: 10px 20px;
                margin-top: 10px;
                width: 100%;
            }

            .correct {
                background-color: #f0faf6;
            }

            .parse {
                font-size: 15px;
                padding: 20px 15px;
                display: flex;

            }
        }

        .answer {
            height: 30px;
            display: flex;
            align-items: center;
            padding: 0 10px;
            width: 100%;
            background-color: #f7fbff;

            span {
                font-size: 15px;
                color: #90adca;
            }
        }

    }
}
</style>