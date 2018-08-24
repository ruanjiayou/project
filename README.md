# 工程模板(使用步骤说明)
- git clone https://github.com/ruanjiayou/project.git
- 安装数据库(如mysql)
- 安装npm包(全局模块:mocha nodemon apidoc cron pm2 vue-cli cnpm)
- 用mysql数据库要装mysql2(默认已装),用postges要装pg
- 修改配置文件(主要是端口/数据库,数据库要手动建)
- *写表的model
- *封装model的基本方法(list/show/update/destroy)
- 刷新数据库: gulp migration -D -F
- 启动app: gulp
- 测试基本接口(mocha --recursive) 测试图片上传方法要用修改图片路径,用shttp的attach方法
- *生成apidoc: gulp doc
- 发布: gulp publish

```
添加内容
UtilsBLL.js 
utils.js控制权 
plugin articleparser.js
utils.js API
utils页面
四个npm包: net-helper html-parser2 uri-parser-helper diff
```
