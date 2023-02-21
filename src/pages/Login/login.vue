<template>
  <div class="loginbox">
      <div class="box">
        <div class="log">
          <img src="../../img/log.png" alt="">
        </div>
        <h2>考试系统</h2>
        <div class="boxs">
          <el-form :model="form" ref="ruleFormRef" :rules="rules" v-show="isShow">
            <el-form-item prop="usename">
              <el-input v-model="form.usename" placeholder="用户名"/>
            </el-form-item>
            <el-form-item prop="pass">
              <el-input v-model="form.pass" type="password"  show-password placeholder="请输入密码"/>
            </el-form-item>
            <el-button type="primary" @click="log(ruleFormRef)">登录</el-button>
            <span class="forget">忘记密码</span>
          </el-form>
          <div class="code" v-show="!isShow">
            <div class="codebox">
              <img src="../../img/big_er.jpg" alt="" > 
            </div>
            <div class="title">
              使用<span>微信</span>扫一扫进行登录
            </div>
          </div>
        </div>
        <div class="qie" @click="soft">
            <img src="../../img/pc.png" alt="" v-show="!isShow">
            <img src="../../img/er.png" alt="" v-show="isShow">
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { login } from '../../api/admin';
import {reactive,toRefs,ref} from 'vue'
import { useRouter } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus'
const router = useRouter();
const obj = reactive({
  form:{
    usename: '',
    pass: '',
  },
  isShow:true
})
//切换事件
const soft=()=>{
  obj.isShow = !obj.isShow
}
const ruleFormRef = ref<FormInstance>()
// 验证
const rules = reactive<FormRules>({
  usename:[
    { required: true, message: '请输入账号', trigger: 'blur' },
  ],
  pass:[
    { required: true, message: '请输入密码', trigger: 'blur' }
]
})
const log = async (formEl:any) => {
  if (!formEl) return
  await formEl.validate( async(valid:any, fields:any) => {
    if (valid) {
      // console.log('submit!')
      const res: any = await login(obj.form.usename, obj.form.pass);
      console.log(res);
      sessionStorage.setItem('token', res.data);
      router.push('/Home');
    } else {
      console.log('error submit!', fields)
    }
  })
}
const {form,isShow} = toRefs(obj)
</script>
<style lang="less" scoped>
body{
  .qie{
    width: 60px;
    height: 60px;
    // background-color: #7abdff;
    position: absolute;
    top: 130px;
    right: 5px;
    img{
      width: 100%;
      height: 100%;
    }
  }
  margin: 0;
  padding: 0;
  .box{

    position: relative;
    margin: 275px auto 0;
    width: 535px;
    height: 630px;
    background-color: #ffffff;
    box-shadow: 4px 4px 4px 4px #ccc;
    border:1px solid #ffffff;
    .log{
      width: 80px;
      margin: 56px auto 0;
      height: 75px;
      img{
        width: 100%;
        height: 100%;
      }
    }
    h2{
      width: 105px;
      margin: 20px auto 0;
    }
    .boxs{
      .code{
        width: 100%;
        height: 100%;
       .codebox{
        width: 200px;
        height: 200px;
        margin: 0 auto;
        img{
          width: 100%;
          height: 100%;
        }
       }
       .title{
        font-size: 23px;
        margin: 20px auto;
        text-align: center;
        span{
          color: #7abdff;
        }
       }
      }
      
      width: 390px;
      height: 390px;
      // background-color: aqua;
      margin: 27px auto 0;
      /deep/input{
        height: 55px;
        border: 1px solid #ffffff;
      }
      /deep/button{
        width: 100%;
        height: 53px;
      }
      .forget{
        color: #7abdff;
        float:right;
        margin-top: 25px;
      }
    }
  }
}
</style>