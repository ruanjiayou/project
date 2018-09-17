# 工程模板(使用步骤说明)
- 先保证装了node/npm/mysql/git/
- 1.git clone https://github.com/ruanjiayou/project.git
- 2.npm i
- 3.npm i mocha nodemon apidoc cron pm2 cnpm -g
- 4.gulp
- 用mysql数据库要装mysql2(默认已装),用postges要装pg
- 修改配置文件(主要是端口/数据库,数据库要手动建).配置项都放到数据库的config表了.
- *写表的model
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
所有的请求测试都在routes/test.js文件中
```
特点:
  1.超灵活的路由写法,支持组合API(涉及文件的要注意name区分). { 'get /v1/admin/self': async(req,res,next)=>{} }
  2.强大的参数过滤. validater-max(人性化的功能,method/default/format/empty/required/nullable/nonzero/)
  3.总体设计一般般,毕竟出道才2年.
  4.大部分配置在项目启动时从数据库中取得
```
TODO:

清理分支; 定时任务定时器;