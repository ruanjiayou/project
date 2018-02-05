# 工程模板(使用步骤说明)
- git clone https://github.com/ruanjiayou/project.git
- 安装数据库(如mysql)
- 安装npm包(全局模块:mocha nodemon apidoc cron pm2 vue-cli cnpm)
- 修改配置文件(主要是端口/数据库,数据库要手动建)
- *写表的model
- *封装model的基本方法(list/show/update/destroy)
- 刷新数据库
- 启动app
- 测试基本接口(mocha --recursive)
- *生成apidoc

# 目录说明
- bin 脚本目录
- src 源码目录
- -- .tmp 上传文件临时目录
- -- test 初始化项目时的基本接口测试
- -- API API子项目
- ---- BLLs models基本方法
- --------  auth 所有角色的登录验证
- ---- configs 所有配置数据(index.js)
- ---- langs 所有国际化语言(错误提示中没必要没必要)
- ---- libs 所有中间件/库(auth/cors/email/i18n/log/present/upload)
- ---- logs 所有日志文件
- ---- models 所有表的model(index是唯一对外的)
- ---- routes 所有路由
- ---- tasks 所有定时任务
- ---- templates 所有模板(email/errors/notifys/sms/views)
- ---- app.js 应用入口
- ---- router.js 路由分发中心
- -- web web子项目
- ---- public 所有静态文件目录
- ---- templates 所有模板(主要是views的)
- ---- app.js 应用服务器

## 重要说明
```
参考egg.js框架,app开始前就加载configs/libs/models/BLLs等作为global的变量.
包含route全都实现自动加载功能.(loader.js中实现)
2018-2-5 14:57:49
controller和service先不加
```