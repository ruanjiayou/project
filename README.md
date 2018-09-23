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
####静态化,效益可观
```js
// get /v2/public/book/:bookId([0-9]+)/chapters
let result = null;
const cachePath = `${CACHE_PATH}/books/${req.params.bookId}.json`;
if (ioHelper.isFileExists(cachePath)) {
  console.log('已有缓存');//17ms
  result = JSON.parse(ioHelper.readTxt(cachePath));
} else {
  console.log('生成缓存');//266ms
  result = await chapterBLL.getList({ limit: 0, where: { bookId: req.params.bookId }, attributes: 'id,bookId,title' });
  result = _.isArray(result) ? result : (result.rows ? result.rows.map(function (item) { return item.toJSON ? item.toJSON() : item; }) : []);
  ioHelper.writeTxt(cachePath, JSON.stringify(result));
}
return res.return(result);
```
TODO:

清理分支; 定时任务定时器;