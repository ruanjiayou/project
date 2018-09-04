# 工程模板(使用步骤说明)
- git clone https://github.com/ruanjiayou/project.git
- 安装数据库(如mysql)
- 安装npm包(全局模块:mocha nodemon apidoc cron pm2 vue-cli cnpm)
- 用mysql数据库要装mysql2(默认已装),用postges要装pg
- 修改配置文件(主要是端口/数据库,数据库要手动建).配置项都放到数据库的config表了.
- *写表的model
- *封装model的基本方法(list/show/update/destroy)
- 刷新数据库: gulp migration -D -F
- 启动app: gulp
- 测试基本接口(mocha --recursive) 测试图片上传方法要用修改图片路径,用shttp的attach方法
- *生成apidoc: gulp doc
- 发布: gulp publish
#### 组合API测试
```
请求url
http://127.0.0.1:3000/v1/api-group
请求头
Content-Type: application/json
x-api: group
请求数据body:
[
  {"method": "put", "url": "/test/put", "query":{},"body": {"test":"test"}},
  {"method": "get", "url": "/test/test", "query":{},"body": {}},
  {"method": "get", "url": "/api-404", "query":{},"body": {}}
]
请求结果:
[
  {
    "test": "test"
  },
  {
    "state": "fail",
    "ecode": -1,
    "error": "API路径错误"
  },
  {
    "state": "fail",
    "ecode": -1,
    "error": "API路径错误"
  }
]
```
```
特点:
  1.超灵活的路由写法,支持组合API. { 'get /v1/admin/self': async(req,res,next)=>{} }
  2.强大的参数过滤. validater-max(人性化的功能,method/default/format/empty/required/nullable/nonzero/)
  3.总体设计一般般,毕竟出道才2年.
  4.大部分配置在项目启动时从数据库中取得
```
TODO:controller有用?res.error()有用?组合API能调用?lib文件夹补全!email;log;upload