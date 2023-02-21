<template>
  <div>
    <input type="text" v-model="params.usename" />
    <input type="text" v-model="params.pass" />
    <button @click="log">登录1</button>
  </div>
</template>

<script setup lang="ts">
import { login } from '../../api/admin';
import { useRouter } from 'vue-router';
const router = useRouter();
const params = {
  usename: 'admin',
  pass: 'admin',
};
const log = async () => {
  const res: any = await login(params.usename, params.pass);
  console.log(res);
  sessionStorage.setItem('token', res.data.token);
  // const w = JSON.stringify(res.data.menu);
  // console.log(w);
  sessionStorage.setItem('data', JSON.stringify(res.data.menu) );

  router.push("Home")
};
</script>

<style lang="less" scoped>
div {
  input {
    width: 20em;
  }
}
</style>
