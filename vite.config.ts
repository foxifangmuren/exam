import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve,join } from 'path'

export default defineConfig({
    //设置别名
    resolve: {
        alias: {
            "@": join(__dirname, './src'),//路径别名
        },
        extensions: [".vue",'.js', '.json', '.ts']//使用别名省略的后缀名
    },
    plugins: [vue()]
})
