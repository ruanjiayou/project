/*
Navicat MySQL Data Transfer

Source Server         : max
Source Server Version : 50720
Source Host           : localhost:3306
Source Database       : temp

Target Server Type    : MYSQL
Target Server Version : 50720
File Encoding         : 65001

Date: 2018-09-03 14:47:06
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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of config
-- ----------------------------
INSERT INTO `config` VALUES ('1', 'C_AUTH_KEY', 'string', '', '鉴权的key');
INSERT INTO `config` VALUES ('2', 'C_AUTH_EXPIRED', 'int', '604800', '过期时间');
INSERT INTO `config` VALUES ('3', 'C_ALI_APPID', 'string', '', '支付宝应用id');
INSERT INTO `config` VALUES ('4', 'C_ALI_PRIVATEKEY', 'string', '', '支付宝私匙');
INSERT INTO `config` VALUES ('5', 'C_ALI_PUBLICKEY', 'string', '', '支付宝公匙');
INSERT INTO `config` VALUES ('6', 'C_ALI_PAYCB', 'string', '', '支付宝支付回调地址');
INSERT INTO `config` VALUES ('7', 'C_TX_SMS_APPID', 'string', '', '腾讯云短信应用id');
INSERT INTO `config` VALUES ('8', 'C_TX_SMS_APPKEY', 'string', '', '腾讯云短信应用密匙');
INSERT INTO `config` VALUES ('9', 'C_TX_COS_APPID', 'string', '', '腾讯云对象存储应用id');
INSERT INTO `config` VALUES ('10', 'C_TX_COS_SECRETID', 'string', '', '腾讯云应用秘钥id');
INSERT INTO `config` VALUES ('11', 'C_TX_COS_SECRETKEY', 'string', '', '腾讯云对象存储应用密匙');
INSERT INTO `config` VALUES ('12', 'C_TX_COS_BUCKET', 'string', '', '腾讯云对象存储bucket');
INSERT INTO `config` VALUES ('13', 'C_TX_COS_REGION', 'string', '', '腾讯云对象存储应用区域');
