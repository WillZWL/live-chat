# 基于socket.io实现的一对一聊天服务器和客户端

application created by [ThinkJS](http://www.thinkjs.org)

## 如何使用

## install dependencies

```
npm install
```

## start server

```
npm start
```

## deploy with pm2

```
pm2 startOrReload pm2.json
```

## socket.io

socket.io最核心的两个api就是`emit` 和 `on`了 ，服务端和客户端都有这两个api。通过`emit` 和`on`可以实现服务器与客户端之间的双向通信。

`emit` ：发射一个事件，第一个参数为事件名，第二个参数为要发送的数据，第三个参数为回调函数（如需对方接受到信息后立即得到确认时，则需要用到回调函数）。

`on` ：监听一个 `emit` 发射的事件，第一个参数为要监听的事件名，第二个参数为回调函数，用来接收对方发来的数据，该函数的第一个参数为接收的数据。

服务端常用API：

`socket.emit()`：向建立该连接的客户端发送消息

`socket.on()`：监听客户端发送信息

`io.to(socketid).emit()`：向指定客户端发送消息

`io.sockets.socket(socketid).emit()`：向指定客户端发送消息，新版本用io.sockets.socket[socketid].emit() ，数组访问

`socket.broadcast.emit()`：向除去建立该连接的客户端的所有客户端广播

`io.sockets.emit()`：向所有客户端广播

客户端常用API：

`socket.emit()`：向服务端发送消息

`socket.on()`：监听服务端发来的信息


## Relate

* [ThinkJS](http://www.thinkjs.org)

* [Socket.io](https://socket.io/)