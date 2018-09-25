const fs = require('fs');
const AipSpeechClient = require('baidu-aip-sdk').speech;
const voiceClient = new AipSpeechClient(VOICE.APPID, VOICE.APIKEY, VOICE.SECRETKEY);

module.exports = {
  /**
   * @api {get} /v2/public/voice 生成语音文件
   * @apiParam {string} text 字符串,最高100字
   */
  'get /v2/public/voice': async(req, res, next) => {
    const result = await voiceClient.text2audio(req.query.text);
    // const filepath = '/voices/' + new Date().getTime() + '.mp3';
    // fs.writeFileSync(STATIC_PATH + filepath, result.data);
    // res.redirect(filepath);
    // return filepath;
    //console.log(result.data);
    return result.data;
  }
};