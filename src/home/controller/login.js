'use strict';

import Base from './base.js';

export default class extends Base {
  // 客服登录页面
  async indexAction() {
    await this.session('user_id', '');
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
    let user = await this.model('user').where({name: username, password: password}).find();
    if (user.id !== undefined && user.id > 0) {
      let id = await this.session('user_id', user.id);
      await this.session('username', user.name);
      return this.success({user_id: user.id, username: user.name});
    } else {
      return this.fail('login fail');
    }
  }
}