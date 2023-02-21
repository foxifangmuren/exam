<template>
  <div>
    <div class="common-layout">
      <el-container>
        <!-- 左侧菜单 -->
        <el-aside width="70px" style="background-color: aqua">
          <el-col>
            <el-menu
              default-active="2"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
              router
            >
              <el-menu-item
                :index="item.url"
                v-for="(item, index) in e"
                :key="index"
              >
               <div :class="'icon iconfont ' + item.ico"></div>
                <span>{{ item.name }}</span>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-aside>
        <!-- 右侧内容 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue';
import { onMounted, reactive, toRefs } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const data = reactive({
  e: {},
  t: '',
});
// const tiao=()=>{
//   console.log(data.t);

//   router.push(data.t)
//   console.log(1);

// }
const handleOpen = (key: string, keyPath: any) => {
  console.log(key, keyPath);
  // data.t=keyPath
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};

onMounted(() => {
  const q: any = sessionStorage.getItem('data');
  console.log(JSON.parse(q));
  const e = JSON.parse(q);
  const w: any = e.filter((item: any) => {
    return item.pid == 0;
  });
  data.e = w;
  console.log(w);
});
const { e }: any = toRefs(data);
</script>
<style>
.el-menu {
  border-right: 0cap;
}
</style>
