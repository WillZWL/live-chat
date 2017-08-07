'use strict';

import Base from './base.js';

var usernames = [];
var usocket = {};
var numUsers = 0;

export default class extends Base {
  async __before(){
    let id = await this.session('user_id');
    if (!id) {
      this.http.redirect('/home/login/index');
    }
  }
  // 判断是否已登录
  async indexAction(){
    return this.display();
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