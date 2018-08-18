/**
 * 自定义错误类型
 */

class Hinter extends Error {
  constructor(module, type, detail) {
    super();
    this.module = module;
    this.type = type;
    this.time = new Date()
    if (detail) {
      this.message = detail;
    }
  }
}
module.exports = Hinter;