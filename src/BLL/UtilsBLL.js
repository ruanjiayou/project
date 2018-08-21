const _ = require('lodash');
const thrower = require('../lib/thrower');
const netHelper = require('net-helper');
const Result = netHelper.Result;
const parser = require('html-parser2');
const ArticleParser = require('../plugin/articleparser');

class UtilsBLL {
  /**
   * 返回请求信息
   * @param {object} req 
   */
  static async request(req) {
    return {
      query: JSON.stringify(req.query),
      header: JSON.stringify(req.headers),
    };
  }
  /**
   * 返回远程响应
   * @param {string} url 
   */
  static async response(url) {
    if (url) {
      const r = await netHelper.getHTML(url);
      return {
        url: url,
        header: JSON.stringify(r.obj)
      }
    } else {
      thrower('common', 'unknown');
    }
  }

  /**
   * 返回远程响应的树结构
   * @param {string} url 
   */
  static async htmlTree(url) {
    if (url) {
      const result = await netHelper.getHTML(url);
      const tree = new parser(result.message);
      return tree.toJSON();
    } else {
      thrower('common', 'unknown');
    }
  }

  /**
   * 格式化html
   * @param {string} str 
   */
  static htmlBeauty(str) {
    const r = new parser(str);
    return r.toString();
  }

  /**
   * 解析网页正文
   * @param {string} url 
   * @param {string} type 
   */
  static async recognitionBody(url, type = 'multi') {
    const articleor = new ArticleParser();
    if (type === 'single') {
      const r = await netHelper.getHTML(url);
      articleor.setURL(url);
      if (r.status === Result.STATUS_SUCCESS) {
        articleor.parse(r.message);
        return articleor.getBody();
      } else {
        thrower('common', 'unknown');
      }
    } else {
      // multi
      return await articleor.getContents(url);
    }
  }

  /**
   * 获取网页图片数组
   * @param {string} url 
   * @param {object} type 
   */
  static async recognitionImages(url, type = 'regexp') {
    let html = (await netHelper.getHTML(url));
    if (html.status !== Result.STATUS_SUCCESS) {
      thrower('common', 'unknown');
    } else {
      html = html.message;
    }
    if (type === null) {
      // Node
      html = new parser(html);
      return html.$('img').map(function (n) {
        delete n.attributes.onload;
        delete n.attributes.onerror;
        return n.outerHTML;
      });
    } else {
      // regexp
      const result = [];
      const reg = new RegExp(type);
      let m = reg.exec(html);
      while (m) {
        result.push(`<img src="${m[1]}"/>`);
        m = reg.exec(html);
      }
      return result;
    }
  }
}

module.exports = UtilsBLL;