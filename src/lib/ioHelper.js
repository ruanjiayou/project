const fs = require('fs');
const path = require('path');

function formater(date, format) {
  var res = format,
    m = '',
    stack = [],
    reg = /\{(\w{1,2})\}/g;
  while ((m = reg.exec(format)) !== null) {
    if (stack.indexOf(m[1]) === -1) {
      stack.push(m[1]);
    }
  }
  for (var i = 0; i < stack.length; i++) {
    var k = stack[i];
    var bLong = (k.length === 2 && k[0].toLowerCase() === k[1].toLowerCase()) ? true : false;
    var v = null;
    switch (k[0].toUpperCase()) {
      case 'Y':
        v = date.getFullYear();
        if (bLong === false) {
          v = v % 100;
        }
        break;
      case 'Q':
        v = Math.floor((date.getMonth() + 3) / 3);
        break;
      case 'M':
        v = date.getMonth() + 1;
        break;
      case 'W':
        v = date.getDay();
        break;
      case 'D':
        v = date.getDate();
        break;
      case 'H':
        v = date.getHours();
        break;
      case 'I':
        v = date.getMinutes();
        break;
      case 'S':
        v = date.getSeconds();
        break;
      default: break;
    }
    if (/^\d+$/.test(k)) {
      // 随机字符串
      k = parseInt(k);
      v = IO.random(k, 'imix');
    } else if (bLong && v < 10) {
      //如果指定最小两位长度则个位数前补零
      v = '0' + v;
    }
    res = res.replace(new RegExp('[{]' + k + '[}]', 'g'), v);
  }
  return res;
}

class IO {
  /**
   * 判断路径是否合法
   * @param {string} path - 路径
   * @return {boolean} - true 路径合法 false - 路径不合法
   */
  static isValidPath(path) {
    return /[<>"/?\\*|':]/.test(path);
  }
  /**
  * 去掉路径中不合法的字符
  * @param {string} path - 路径
  * @return {string} - 返回合法的字符
  */
  static toValidPath(path) {
    return path.replace(/[<>"/?\\*|':]/g, ' ');
  }

  /**
  * 生成16位长度的GUID
  */
  static GUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    }).toUpperCase();
  };

  /**
   * 生成随机字符串
   * @param {int} $len 长度,默认32,最小长度为6
   * @param {string} $type 类型,number,imix,mix,char,ichar
   */
  static random(len, type = 'number') {
    let chs = '';
    let res = '';
    if (type === 'mix') {
      chs = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLOMNOPQRSTUVWXYZ';
    } else if (type === 'imix') {
      chs = '1234567890ABCDEFGHIJKLOMNOPQRSTUVWXYZ';
    } else if (type === 'char') {
      chs = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLOMNOPQRSTUVWXYZ';
    } else if (type === 'ichar') {
      chs = 'ABCDEFGHIJKLOMNOPQRSTUVWXYZ';
    } else {
      chs = '1234567890';
    }
    if (len < 6) {
      len = 6;
    }
    for (let i = 0, l = chs.length; i < len; i++) {
      let ran = Math.round(Math.random() * l);
      res += chs[ran];
    }
    return res;
  }

  /**
  * 判断文件是否存在
  * @param {string} path - 文件路径
  * @return {boolean} - true 文件存在 false 文件不存在
  */
  static isFileExists(path) {
    return fs.existsSync(path) && !fs.lstatSync(path).isDirectory();
  }
  /**
  * 判断目录是否存在
  * @param {string} dir - 目录路径
  * @return {boolean} - true 目录存在 false 目录不存在
  */
  static isDirExists(dir) {
    return fs.existsSync(dir) && fs.lstatSync(dir).isDirectory();
  }

  static getPathInfo(filepath) {
    filepath = filepath.replace(new RegExp('[\]', 'g'), '/');
    const arr = filepath.split('/');
    let [key, ext] = arr.pop().split('.');
    const info = {
      dir: arr.join(''),
      key: key,
      ext: ext === undefined ? '' : ext,
      fullpath: filepath
    };
    return info;
  }
  /**
   * 生成随机时间字符串
   * @param {string} format 格式
   */
  static generatePath(format) {
    return formater(new Date(), format);
  }
  /**
  * 遍历目录文件方法
  * @param {string} dir 目录
  * @param {AsyncFunction} cb 回调函数
  * @param {AsyncFunction} [filter] 过滤函数
  */
  static async eachAsync(dir, cb, filter) {
    let files = fs.readdirSync(dir);
    for (let i = 0; i < files.length; i++) {
      let file = path.join(dir, files[i]);
      if (IO.isDirExists(file)) {
        await IO.eachAsync(file, cb, filter);
      } else if (void 0 === filter || true === await filter(file)) {
        await cb(file);
      }
    }
  }
  /**
  * 同步读取文件文本
  * @param {string} path - 文件绝对路径
  * @return {string} - 字符串
  */
  static readTxt(path) {
    var res = '';
    if (IO.isFileExists(path)) {
      try {
        res = fs.readFileSync(path, 'utf-8');
      }
      catch (e) {
        console.log('read error!');
      }
    }
    return res;
  }
  /**
  * 写入文件
  * @param {string} path - 文件路径
  * @param {*} txt - 字符串
  * @return {boolean} - true 写入完成 false 写入失败
  */
  static writeTxt(path, txt) {
    try {
      fs.writeFileSync(path, txt);
      return true;
    }
    catch (e) {
      return false;
    }
  }
  /**
  * 追加写入文本
  * @param {string} path - 文件路径
  * @param {*} txt - 字符串
  * @return {boolean} - true 写入完成 false 写入失败
  */
  static addTxt(path, txt) {
    try {
      fs.writeFileSync(path, txt, { flag: 'a+' });
      return true;
    }
    catch (e) {
      return false;
    }
  }
  static moveFile(oldPath, newPath) {
    let dir = path.dirname(newPath);
    try {
      if (!IO.isDirExists(dir)) {
        IO.mkdirs(dir);
      }
      fs.renameSync(oldPath, newPath);
      return true;
    } catch (err) {
      console.log(err.message);
      return false;
    }
  }
  /**
  * 删除文件
  * @param {string} path 
  */
  static delFile(path) {
    try {
      if (IO.isFileExists(path)) {
        fs.unlinkSync(path);
      }
      return true;
    } catch (err) {
      return false;
    }
  }
  /**
  * 删除文件夹及所有子文件文件
  * @param {string} path 
  */
  static delFolder(path) {
    if (!IO.isDirExists(path)) {
      return true;
    }
    let files = fs.readdirSync(path);//读取该文件夹
    try {
      files.forEach(function (file) {
        var stats = fs.statSync(path + '/' + file);
        if (stats.isDirectory()) {
          IO.delFolder(path + '/' + file);
        } else {
          fs.unlinkSync(path + '/' + file);
        }
      });
      fs.rmdirSync(path);
      return true;
    } catch (err) {
      console.log(err.message);
      return false;
    }
  }
  static clearEmptyFolder(dir) {
    let files = fs.readdirSync(dir);
    if (files.length === 0) {
      IO.delFolder(dir);
    }
    for (let i = 0; i < files.length; i++) {
      let file = path.join(dir, files[i]);
      if (IO.isDirExists(file)) {
        IO.clearEmptyFolder(file);
      }
    }
  }
  /**
  * 创建文件夹
  * @param {string|array} dir 文件夹
  * @returns {boolean} 是否创建成功
  */
  static mkdirs(dir) {
    if (dir instanceof Array) {
      dir = dir.join('/');
    }
    dir = dir.replace(/[/]+|[\\]+/g, '/');
    try {
      if (!fs.existsSync(dir)) {
        var pathtmp = '';
        dir = dir.split('/');
        dir.forEach(function (dirname) {
          pathtmp += pathtmp === '' ? dirname : '/' + dirname;
          if (false === fs.existsSync(pathtmp)) {
            fs.mkdirSync(pathtmp);
          }
        });
      }
    } catch (err) {
      console.log(err);
      return false;
    }
    return true;
  }
  /**
  * 字数统计:
  */
  static count(str) {
    let res = {
      bytes: 0,
      chinese: 0,
      english: 0,
      num: 0,
      punctuation: 0
    };
    for (let i = 0; i < str.length; i++) {
      let c = str.charAt(i);
      if (/[\u4e00-\u9fa5]/.test(c)) {
        // 中文
        res.chinese++;
      } else if (/[^\x00-\xff]/.test(c)) {
        // 标点?
        res.punctuation++;
      } else {
        // 英文
        res.english++;
      }
      if (/[0-9]/.test(c)) {
        // 数字
        res.num++;
        res.english--;
      }
    }
    res.bytes = (res.chinese + res.punctuation) * 2 + res.english + res.num;
    return res;
  }
}

module.exports = IO;