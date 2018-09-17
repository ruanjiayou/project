/*
Navicat MySQL Data Transfer

Source Server         : 百度云
Source Server Version : 50641
Source Host           : 180.76.183.201:3306
Source Database       : project-test

Target Server Type    : MYSQL
Target Server Version : 50641
File Encoding         : 65001

Date: 2018-09-17 20:00:21
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for config
-- ----------------------------
DROP TABLE IF EXISTS `config`;
CREATE TABLE `config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `type` enum('array','json','int','string') DEFAULT 'string',
  `value` text,
  `mark` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of config
-- ----------------------------
INSERT INTO `config` VALUES ('14', 'C_SYSTEM', 'json', '{}', '系统参数');
INSERT INTO `config` VALUES ('15', 'C_STOREAGE_TYPE', 'string', 'local', '默认对象存储类型');
INSERT INTO `config` VALUES ('17', 'C_EMAIL_TYPE', 'string', 'qq', '默认发送邮件类型');
INSERT INTO `config` VALUES ('18', 'C_SMS_TYPE', 'string', 'tx', '默认发送短信类型');
INSERT INTO `config` VALUES ('28', 'COS', 'json', '{\"tx\":{\"APPID\":\"\",\"SECRETID\":\"\",\"SECRETKEY\":\"\",\"REGION\":\"\",\"BUCKET\":\"\"},\"ali\":{\"APPID\":\"\",\"SECRET\":\"\",\"REGION\":\"\",\"BUCKET\":\"\"}}', null);
INSERT INTO `config` VALUES ('30', 'SMS', 'json', '{\"tx\":{\"APPID\":\"\",\"SECRET\":\"\"},\"ali\":{\"APPID\":\"\",\"SECRET\":\"\"}}', null);
INSERT INTO `config` VALUES ('32', 'EMAIL', 'json', '{\"qq\":{\"HOST\":\"smtp.qq.com\",\"PORT\":\"465\",\"USER\":\"1439120442@qq.com\",\"PASS\":\"\"}}', null);
INSERT INTO `config` VALUES ('33', 'REDIS_QUEUE', 'json', '{\"PREFIX\":\"\",\"HOST\":\"\",\"PORT\":\"\"}', null);
INSERT INTO `config` VALUES ('34', 'AUTH', 'json', '{\"KEY\":\"x-token\",\"SECRET\":\"\",\"SALT\":\"\",\"EXP\":604800}', null);
