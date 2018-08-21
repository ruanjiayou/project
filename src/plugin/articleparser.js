var htmlparser = require('html-parser2');
var Node = htmlparser.Node;
var netHelper = require('net-helper');
var Uri = require('uri-parser-helper');
//var IO = require('utils2/lib/io');
var Result = netHelper.Result;
var jsdiff = require('diff');

Uri.prototype.isPaging = function (url) {
  if (/\/\d+\./g.test(url)) {
    return false;
  }
  let u = this.href;
  let count = 0;
  let diff = u.length < url.length ? jsdiff.diffChars(u, url) : jsdiff.diffChars(url, u);
  for (let i = 0; i < diff.length && count < 2; i++) {
    if (diff[i].added) {
      count++;
      if (!/^[^a-z0-9A-Z]?\d+$/.test(diff[i].value)) {
        count++;
        break;
      }
    }
  }
  return count === 1 ? true : false;
};
/**
 * 判断节点是否是文本类型
 * @return {boolean} - true 是 false 不是
 */
Node.prototype.isText = function () {
  if (this.nodeType === Node.NODE_COMMENT || this.nodeType === Node.NODE_TEXT) {
    return false;
  }
  return /^(p)|(span)|(br)|(img)|(h[1-6])$/.test(this.nodeName);
};

/**
 * 根据子节点计算本节点的估值
 * @param {int} weight - 特殊字符的权重，如article text content
 * @return {int} - 估值
 */
Node.prototype.getWeight = function (weight) {
  var r = 0, w = weight || 1;
  var oc = this.firstChild;
  while (oc !== null) {
    if (oc.isText()) {
      r++;
    }
    if (oc.nodeName === 'p') {
      r++;
    }
    oc = oc.nextNode;
  }
  return r * w;
};
class parser extends htmlparser {
  constructor(html) {
    super(html);
    this.title = '';
    this.base = null;
    this.res = [];//{ content: , url: , scanned: }
    this.contentId = '';
    this.contentClass = '';
  }
  /**
   * 所有分页是否采集完毕
   * true 采集完毕 string 下一个要采集的url
   */
  isFinished() {
    for (let i = this.res.length - 1; i >= 0; i--) {
      if (this.res[i].scanned === false) {
        return this.res[i].url;
      }
    }
    return true;
  }
  /**
   * 是否是内容主体 多页的情况下提高效率
   */
  isContent(node) {
    if (this.contentId === '' && this.contentClass === '') {
      return false;
    }
    return node.attr('id') === this.contentId && node.attr('class') === this.contentClass;
  }
  /**
   * 采集新闻 包含多页的情况
   * @param {string} url - 入口url
   * @return {object} - title content urls
   */
  async getContents(url) {
    var res = { title: '', content: '', urls: [] };
    this.res.push({ url: url, content: '', scanned: false });
    var tempurl = this.isFinished();
    // 多页采集
    while (tempurl !== true) {
      //循环获取网页
      let html = await netHelper.getHTML(tempurl);
      let res = { title: '', content: '' };
      //解析获取正文
      if (html.status === Result.STATUS_SUCCESS) {
        this.setURL(tempurl);
        this.parse(html.message);
        res = this.getBody();
      }
      // 标记完成 设置对应url的对象
      for (let i = this.res.length - 1; i >= 0; i--) {
        if (tempurl === this.res[i].url) {
          this.res[i] = { url: tempurl, content: res.content, scanned: true };
          break;
        }
      }
      //获取下一个
      tempurl = this.isFinished();
    }
    // 返回标题和文章内容 urls
    res.title = this.title;
    res.content = this.res.map(function (item) { return item.content; }).join('<br/>');
    res.urls = this.res.map(function (item) { return item.url; });
    return res;
  }
  /**
   * 设置基础url 用于一个页面中作为基准url 解析下载
   * @param {string} url - url
   */
  setURL(url) {
    this.base = new Uri(url);
    return this;
  }
  /**
   * 获取正文
   * 返回title和content
   */
  getBody() {
    var res = {
      title: '',
      content: ''
    };
    var _this = this, t = 0, i = 0, b = this.base, weight = 1;
    var arr = [];
    this.bfsSync(function (node) {
      switch (node.nodeName) {
        case 'title':
          _this.title = node.innerText;
          break;
        case 'h1':
          _this.title = (node.firstChild && node.firstChild.nodeName === 'a') ? node.firstChild.innerText : node.innerText;
          break;
        case 'a':
          if (b) {
            var u = b.create(node.attr('href').toString()).toString();
            node.attr('href', u);
            var p = b.isPaging(u);
            if (p) {
              if (_this.res.length === 0) {
                _this.res.push({ content: '', scanned: false, url: u });
              }
              for (let i = _this.res.length - 1; i >= 0; i--) {
                if (u === _this.res[i].url) {
                  break;
                } else if (0 < u.compare(_this.res[i].url)) {
                  _this.res.splice(i + 1, 0, { content: '', scanned: false, url: u });
                  break;
                }
              }
            }
          }
          break;
        case 'img':
          if (b) {
            node.attr('src', b.create((node.attr('src') || node.attr('_src')).toString()));
            node.removeAttr('onload');
          }
          break;
        case 'div':
          if (node.hasClass('footer nav header')) {
            node.remove();
            return false;
          }
          break;
        default:
          if (['iframe', 'nav', 'header', 'footer', 'script'].indexOf(node.nodeName) !== -1) {
            node.remove();
            return false;
          }
          break;
      }
      t = node.getWeight(weight);
      //找位置
      for (i = arr.length - 1; i >= 0; i--) {
        if (t <= arr[i].weight) {
          break;
        }
      }
      //排序
      if (i === -1) {
        arr.unshift({ weight: t, pos: node });
      } else {
        arr.splice(i + 1, 0, { weight: t, pos: node });
      }
      //清除多余的
      if (arr.length === 4) {
        arr.pop();
      }
    });
    if (arr.length !== 0) {
      var ol = arr[0].pos.lastChild;
      //去掉script 注释 后面不是文本的节点
      while (ol) {
        let bText = ol.isText();
        if ((bText === false && ol.nextNode === null) || ol.nodeType === Node.NODE_COMMENT || ol.nodeName === 'script') {
          ol.remove();
        }
        ol = ol.prevNode;
      }
      arr[0].pos.$('div').forEach(function (item) {
        item.remove();
      });
      res.content = arr[0].pos.innerHTML;
    }
    res.title = this.title;
    return res;
  }
}
/*
var a1 = new parser();
a1.parse('<span>savc</span>');
console.log(a1.getInfo());
a1.$('span')[0].test();
*/
module.exports = parser;