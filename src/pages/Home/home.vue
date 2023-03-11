<template>
  <div>
    <div class="common-layout">
      <el-container>
        <!-- 左侧菜单 -->
        <el-aside width="70px" style="background-color: aqua">
          <el-col>
            <el-menu
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
              :default-active="$route.path"
              text-color="#747e97"
              router
            >
              <el-menu-item index="">
                <template #default="scope">
                  <div
                    class="block"
                    ref="buttonRef"
                    @click="persona"
                  >
                    <img
                      src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
                      alt=""
                    />
                  </div>
                </template>
              </el-menu-item>
              <!-- 个人信息  退出登录 -->
            <div class="personalBox" v-show="isShowPersonal">
              <!-- 头部 -->
              <div class="box"></div>
              <!-- 头像 -->
              <div class="editerBox">
                <div class="editer">
                  <div
                    style=""
                    ref="buttonRef"
                    @click="personal"
                  >
                    <img style="width: 50px;"
                      src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
                      alt=""
                    />
                  </div>
                </div>
              </div>
              <!-- 姓名 -->
              <div class="name" >{{data.List.name}}</div>
              <div class="name" >部门:{{ data.List.depname }}</div>
              <div class="name" v-show="type!=='teacher'">班级:{{ data.List.classname }}</div>
              <div class="butBox">
                <el-button class="but" @click="goodbye">退出登录</el-button>
              </div>
              <!-- 账号 -->
              <div class="accountBox">
                <div class="account">
                  <el-avatar
                    :size="20"
                    @click="personal"
                    :src="circleUrl"
                  ></el-avatar>
                  <span class="title">账号</span>
                </div>
                <div class="accountName">{{ data.List.username }}</div>
              </div>
              <!-- 密码 -->
              <div class="accountBox">
                <div class="account">
                  <el-avatar
                    :size="20"
                    :src="circleUrl"
                  ></el-avatar>
                  <span class="title">密码</span>
                </div>
                <div class="accountName click">设置</div>
              </div>
              <!-- 微信 -->
              <div class="accountBox">
                <div class="account">
                  <el-avatar
                    :size="20"
                    @click="personal"
                    :src="circleUrl"
                  ></el-avatar>
                  <span class="title">微信</span>
                </div>
                <div class="accountName click">未绑定</div>
              </div>
            </div>
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
        <el-main @click="closureInfo">
          <router-view :style="isShowPersonal?'pointer-events: none;':''"></router-view>
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
import { onMounted, reactive, toRefs, ref , unref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const data = reactive({
  e: {},
  t: '',
  type:sessionStorage.getItem("type"),
  isShowPersonal:false,
  List:{
    name:'',
    depname:'',
    classname:"",
    username:""
  }
});
const { isShowPersonal }: any = toRefs(data);
const buttonRef = ref()
const popoverRef = ref()
const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
}
// 点击显示个人信息
const personal = () => {
  data.isShowPersonal = !isShowPersonal.value;
};
// 点击关闭个人信息
const closureInfo=()=>{
  data.isShowPersonal=false
}
const goodbye=()=>{
  sessionStorage.clear()
  router.push('/Login')
}
// 头像
const state = reactive({
  circleUrl:
    "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
  sizeList: [""] as const,
});
const { circleUrl, sizeList } = toRefs(state);
const persona=()=>{
  data.isShowPersonal = !isShowPersonal.value;
}
const handleOpen = (key: string, keyPath: any) => {
  // console.log(key, keyPath);
  // data.t=keyPath
};
const handleClose = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath);
};
const zhu = () => {
  alert(111);
};
onMounted(() => {
  data.List= JSON.parse(sessionStorage.getItem('model') as any)
  console.log(data.List)
  const q: any = sessionStorage.getItem('data');
  // console.log(JSON.parse(q));
  const e = JSON.parse(q);
  const w: any = e.filter((item: any) => {
    return item.pid == 0;
  });
  data.e = w;
  // console.log(w);
});
const { e,type }: any = toRefs(data);
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
.icon{
  font-size: 20px;
  // color: red;

}
.common-layout {
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
.tou{
  width: 100px;
  height: 100px;
  background-color: aqua;
}
.sidebar {
  width: 100%;
  min-height: 100vh;
  background-color: #ebebeb;
}
.block {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.personalBox {
  z-index: 999;
  width: 290px;
  position: fixed;
  left: 53px;
  top: 40px;
  border-radius: 5px;
  box-shadow: 0 0 12px 0px #666;
  background-color: #fff;
}
.box {
  height: 100%;
  height: 70px;
  background-color: #dfe1e6;
}
.editerBox {
  width: 100%;
  display: flex;
  justify-content: center;
}
.editer {
  border: 2px solid #fff;
  margin-top: -25px;
  border-radius: 50%;
}
.name {
  width: 100%;
  display: flex;
  justify-content: center;
  font-size: 14px;
  margin-bottom: 15px;
}
.butBox {
  padding: 0 10px 20px;
  border-bottom: 1px solid #dadce0;
  margin-bottom: 20px;
}
.but {
  font-size: 12px;
  width: 100%;
}
.accountBox {
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.account {
  display: flex;
  align-items: center;
}
 .title {
  font-size: 14px;
  margin-left: 5px;
}.accountName {
  font-size: 13px;
}
.click {
  color: #59a0ff;
  cursor: pointer;
}
.font {
  text-align: center;
  background-color: #d1d3d5;
  width: 67%;
  margin: 0 auto;
  padding: 8px 5px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 5px;
}
.fonts {
  color: #3889ff;
}
.p {
  font-size: 13px;
  margin-top: 0px;
  color: #3889ff;
}
.h {
  width: 50%;
  height: 1px;
  background-color: #c0c2c5;
  margin: 0 auto;
}
.fon {
  text-align: center;
  margin: 0 auto;
  width: 67%;
  padding: 8px 5px;
  margin-bottom: 5px;
  cursor: pointer;
}
.fonts {
  color: #727e96;
}
.p {
  font-size: 13px;
  margin-top: 0px;
  color: #000;
}
.home .fon:nth-last-child(6) {
  width: 45% !important;
  border-bottom: 1px solid #d1d3d5;
}

</style>
