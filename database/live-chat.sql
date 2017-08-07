/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50553
Source Host           : 127.0.0.1:3306
Source Database       : live-chat

Target Server Type    : MYSQL
Target Server Version : 50553
File Encoding         : 65001

Date: 2017-08-07 18:50:42
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `message`
-- ----------------------------
DROP TABLE IF EXISTS `message`;
CREATE TABLE `message` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `from_user` int(11) NOT NULL COMMENT '聊天记录ID',
  `to_user` int(11) NOT NULL,
  `message` text NOT NULL,
  `create_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8 NOT NULL DEFAULT '' COMMENT '用户名',
  `password` varchar(64) CHARACTER SET utf8 NOT NULL DEFAULT '' COMMENT '用户密码',
  `create_at` datetime NOT NULL COMMENT '创建时间',
  `modify_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', 'Lucy', '655EEB57C8E74912D8FE99530416E4D1', '2017-08-07 17:27:06', '2017-08-07 17:27:06');
INSERT INTO `user` VALUES ('2', 'Amy', '655EEB57C8E74912D8FE99530416E4D1', '2017-08-07 17:27:58', '2017-08-07 17:27:58');
INSERT INTO `user` VALUES ('3', 'Will', '655EEB57C8E74912D8FE99530416E4D1', '2017-08-07 17:32:11', '2017-08-07 18:00:48');
INSERT INTO `user` VALUES ('4', 'Test', 'F1874885114583546AD0766326344456', '2017-08-07 17:33:50', '2017-08-07 17:33:50');
