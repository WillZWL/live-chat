'use strict';

import Base from './base.js';

export default class extends Base {
  // 客服登录页面
  async indexAction() {
    let id = await this.session('user_id');
    if (id) {
      this.http.redirect('/home/index/index');
    }
    return this.display();
  }

  // 登录
  async loginAction() {
    let username = this.post('username');
    let password = this.post('password');
    let salt = think.config('salt');
    let encryptPassword = global.encryptPassword(password, salt);
    let user = await this.model('user').where({name: username, password: encryptPassword}).find();
    if (user.id !== undefined && user.id > 0) {
      await this.session('user_id', user.id);
      await this.session('username', user.name);
      await this.cookie('user_id', user.id);
      return this.success({user_id: user.id, username: user.name});
    } else {
      return this.fail('登录失败');
    }
  }

  async logoutAction() {
    await this.session('user_id', '');
    await this.session('username', '');
    await this.cookie('user_id', '');
    this.http.redirect('/home/login/index');
  }
}