<template>
  <div>
    <!-- 头部 -->
    <div>
      <p>创建考试</p>
    </div>
    <!-- 身体 -->
    <div class="item_top">
      <div class="item_body">
        <span>1</span>
        <p>基本信息</p>
      </div>
    </div>
    <div class="item_top">
      <div class="item_body">
        <span>2</span>
        <p>内容设置</p>
      </div>
    </div>
    <div class="item_top">
      <div class="item_body">
        <span>3</span>
        <p>教师范围</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style scoped >
.item_top {
  margin-top: 20px;
}
.item_body {
  display: flex;
  height: 60px;
  line-height: 60px;
  padding: 5px 30px;
  background-color: rgb(249, 250, 255);
}
.item_body > span {
  font-size: 35px;
  color: #c7e5ff;
  margin: 0 20px;
}
</style>

    