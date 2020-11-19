# 序言

专题脚手架

用于ES6转ES5，压缩js，scss打包成css，sprite图片生成

# 安装

npm i zt-scaffold -g

# 使用

zt init [dir]            创建专题的目录名称

zt start [pro]           监听文件修改 pro: pc、touch

build [pro] [task]       打包项目 pro: pc、touch task, 选填 scss、uglify、sprite

# 自定义配置
脚手架自动获取项目根目录下 `zt.config.json` 文件,覆盖默认的配置
```
{
    port: 5156, // 端口
    proxy: {
        '/api': {target: 'http://www.example.com', changeOrigin: true}
    }, // 代理 
    gulp: { // baseDir 项目根目录
        scss: {
          src: [baseDir + "/scss/*.scss", "!" + baseDir + "/scss/sprite.scss"],
          dest: baseDir + "/css"
        },
        sprite: {
          src: baseDir + "/images/icons/*.png",
          dest: baseDir + "/images",
          config: {}
        },
        uglify: {
          src: [baseDir + "/js/*.js", "!" + baseDir + "/js/*.min.js"],
          dest: baseDir + "/js"
        }
    }
}
```
代理配置参考 [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)
