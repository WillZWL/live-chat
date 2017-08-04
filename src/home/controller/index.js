'use strict';

import Base from './base.js';

var usernames = {};
var numUsers = 0;

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  // 客服登录页面
  userloginAction() {
    let id = this.cookie('user_id');
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
      let id = this.cookie('user_id', user.id);
      return this.success(id);
    } else {
      return this.fail('login fail');
    }
  }

  // 判断是否已登录
  indexAction(){
    let id = this.cookie('user_id');
    if (id) {
      return this.display();
    } else {
      this.http.redirect('/home/index/userlogin');
    }
  }

  // 开启会话
  openAction(self){
    var socket = self.http.socket;
    this.broadcast('new message', {
      username: socket.username,
      message: self.http.data
    });
  }

  // 添加用户
  adduserAction(self){
    var socket = self.http.socket;
    var username = self.http.data;
    // we store the username in the socket session for this client
    socket.username = username;
    // add the client's username to the global list
    usernames[username] = username;
    ++numUsers;
    this.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    this.broadcast('userjoin', {
      username: socket.username,
      numUsers: numUsers
    });
  }

  // 关闭
  closeAction(self){
    var socket = self.http.socket;
    // remove the username from global usernames list
    if (socket.username) {
      delete usernames[socket.username];
      --numUsers;
      // echo globally that this client has left
      this.broadcast('userleft', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  }
  // 会话
  chatAction(self){
    var socket = self.http.socket;
    // we tell the client to execute 'chat'
    this.broadcast('chat', {
      username: socket.username,
      message: self.http.data
    });
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