import { ref } from 'vue'
export default function () { 
      let num = ref(0);
  const xiaoxi=()=> {
    if (res.errCode == '10000') {
      ElMessage({
        message: '成功',
        type: 'success',
      });
    } else {
      ElMessage.error('失败');
    }
  },
    // 暴露出去
    return {
      xiaoxi
    }
}