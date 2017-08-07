'use strict';
const moment = require('moment');

import Base from './base.js';

export default class extends Base {
  // 注册页面
  indexAction() {
    // console.log(moment().format('YYYY-MM-DD HH:mm:ss'));
    return this.display();
  }

  // 登录
  async registerAction() {
    let username = this.post('username');
    let password = this.post('password');
    let user = await this.model('user').where({name: username}).find();
    if (user.id !== undefined && user.id > 0) {
      return this.fail('用户已存在');
    } else {
      let salt = think.config('salt');
      let encryptPassword = global.encryptPassword(password, salt);
      if (username && encryptPassword) {
        let userObj = {
          name: username,
          password: encryptPassword,
          create_at: moment().format('YYYY-MM-DD HH:mm:ss'),
          modify_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        let insertId = await this.model('user').add(userObj);
        if (insertId > 0) {
          return this.success();
        }
      }
      return this.fail('注册失败');
    }
  }
}