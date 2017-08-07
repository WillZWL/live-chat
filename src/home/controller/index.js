'use strict';

import Base from './base.js';

var usernames = [];
var usocket = {};
var numUsers = 0;

export default class extends Base {
  // 客服登录页面
  async userloginAction() {
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

  // 判断是否已登录
  async indexAction(){
    let id = await this.session('user_id');
    if (id) {
      return this.display();
    } else {
      this.http.redirect('/home/index/userlogin');
    }
  }

  // 开启会话
  openAction(self){
    var socket = self.http.socket;
    var data = self.http.data;
    this.broadcast('new message', {
      username: socket.username,
      message: self.http.data
    });
  }

  // 添加用户
  adduserAction(self){
    var socket = self.http.socket;
    var username = self.http.data;
    if (username) {
      if (!(username in usocket)) {
        socket.username = username;
        if (usernames.indexOf(username) === -1) {
          usernames.push(username);
          numUsers++;
        }
        usocket[username] = this.http.socket;
        this.broadcast('userjoin', username, username.length - 1);
      }
      this.emit('login', usernames);
    }
  }

  // 关闭
  closeAction(self){
    var socket = self.http.socket;
    if (socket.username) {
      delete usocket[socket.username];
      delete usernames[socket.username]
      this.broadcast('userleft', socket.username);
    }
  }
  // 会话
  chatAction(self){
    var socket = self.http.socket;
    var data = self.http.data;
    console.log(data.recipient);
    if (data.recipient in usocket) {
      usocket[data.recipient].emit('receive private message', data);
    }
  }
  // 正在输入
  typingAction(self){
    var socket = self.http.socket;
    this.broadcast('typing', {
      username: socket.username
    });
  }

  // 停止输入
  stoptypingAction(self){
    var socket = self.http.socket;
    this.broadcast('stoptyping', {
      username: socket.username
    });
  }
}