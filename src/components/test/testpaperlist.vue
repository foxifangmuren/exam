<template>
    <div>
        <el-dialog :model-value="props.isshow" title="试题列表" width="80%" :before-close="paperhandleClose">
  
  
          <!-- form表单 -->
          <el-form label-width="70px" size="small">
   
              <el-space wrap>
  
                <!-- 题库名称 -->
                <el-form-item label="题库名称">
                  <el-input v-model="data.key" />
                </el-form-item>   
  
                <!-- 创建人 -->
                <el-form-item label="创建人">
                  <el-input v-model="data.admin" />
                </el-form-item> 
                
                <!-- 只看我创建的 -->
                <el-form-item label="" label-width="20px">
                  <el-checkbox v-model="data.ismy" label="只看我创建的" size="large" />
                </el-form-item>
  
                <!-- 查询按钮 -->
                <el-form-item label="" label-width="20px">
                  <el-button type="primary" @click="search">查询</el-button>
                </el-form-item>
  
              </el-space>
  
          </el-form>
  
          <!-- 表格 -->
          <el-table ref="multipleTableRef" :data="information" size="small" style="width: 100%">
            <el-table-column label="题库名称" show-overflow-tooltip>
              <template #default="scope">
                <el-radio-group v-model="radio" class="ml-4" @change="radchange(scope.row.id)">
                  <el-radio :label="scope.row.id">{{scope.row.title}}</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column property="counts" label="题目数量" width="120" />
            <el-table-column property="addtime" label="创建时间" />
            <el-table-column property="admin" label="创建人" />
            <el-table-column property="addtime" label="更新时间" />
          </el-table>
  
  
          <!-- 按钮 -->
          <template #footer>
            <div style="display: flex; justify-content: space-between; justify-content: flex-end;">
              <div>
                <span class="dialog-footer">
                  <el-button @click="paperCancel">取消</el-button>
                  <el-button type="primary" @click="paperConfirm">确定</el-button>
                </span>
              </div>
            </div>
          </template>
  
        </el-dialog>
    </div>
  </template>
  <script lang='ts' setup>
  import { ref, toRefs, onMounted, onUpdated, onUnmounted, reactive, watchEffect, inject } from 'vue'
  import { ElTable } from 'element-plus'
  import {subjects_list,subjects_get} from '../../api/test'  //接口
  
  const props: any = defineProps(['isshow'])
  const emit = defineEmits(['paperhandleClose', 'paperConfirm', 'paperCancel'])
  
  const paperhandleClose = () => {  //差号
      emit('paperhandleClose', false)
  }
  
  
  
  // 列表数据---------------------------------
  let information = ref([]) //赋值的
  
  let data = reactive({  //参数
    page: 1,
    psize: 10,
    key: '',
    admin:'', //创建人
    ismy:1
  })
  
  let getsubjects_list = async() => {
    let res = await subjects_list(data)
    console.log(res);
    information.value = res.data.list
  
  }
  getsubjects_list()
  
  
  // 点击查询
  let search = () => {
    getsubjects_list()
  }
  
  
  
  // 点击左侧单选按钮获取到id
  // 左侧的单选按钮
  let radio = ref(0)
  const radchange = (val:any) => {
    console.log(val);
    radio.value = val
  }
  
  //确定按钮
  const paperConfirm = async () => {
  
    let questions:any = ref({}) //赋值的
  
    let res = await subjects_get({id:radio.value}) // 根据id获取单条数据
    console.log(res);
    questions.value = res.data
  
    emit('paperConfirm', false,questions )
  }
  
  //取消按钮
  const paperCancel = () => {
    emit('paperCancel', false)
  }
  
  
  
  </script>
  <style lang="less" scoped>
  .scoll {
    overflow-y: scroll;
    scroll-behavior: smooth;
    overscroll-behavior: contain;
    max-height: 550px;
    width: 100%;
  }
  
  :deep(.el-dialog) {
    margin: 10px auto;
    overflow: hidden;
  }
  </style>