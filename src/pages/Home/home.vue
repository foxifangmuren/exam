<template>
  <div>
    <div class="common-layout">
      <el-container>
        <!-- 左侧菜单 -->
        <el-aside width="70px" style="background-color: aqua">
          <div class="block">
            <img
              src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
              alt=""
            />
          </div>

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
                <p :class="'icon iconfont ' + item.ico"></p>
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
  // console.log(key, keyPath);
  // data.t=keyPath
};
const handleClose = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath);
};

onMounted(() => {
  const q: any = sessionStorage.getItem('data');
  // console.log(JSON.parse(q));
  const e = JSON.parse(q);
  const w: any = e.filter((item: any) => {
    return item.pid == 0;
  });
  data.e = w;
  // console.log(w);
});
const { e }: any = toRefs(data);
</script>
<style lang="less" scoped>
.block {
  width: 75px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 40px;
    height: 40px;
  }
}
.el-menu-item {
  display: flex;
  // display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 65px;
  span {
    margin-top: -30px;
  }
}
.common-layout{
  height: 100vh;
}
.el-menu {
  height: 100vh;
  background-color: #ebebeb !important;
}
.el-aside {
  width: 75px;
  height: 100%;
  background-color: #ebebeb !important;
}
.el-main {
  height: 100vh;
}
.el-menu {
  border-right: 0cap;
}
</style>
