var name = window.localStorage.getItem("username");
var socket;
$(function () {
    if (name) {
	    liveChat(name);
    } else {
        window.location.href = '/home/index/index';
    }
});

// 点击发送
$(document).on('click','.chat-active .send', () => sendMessage());

// Enter键 发送消息
document.onkeydown = (e) => {
    if(e && e.keyCode == 13) {
		sendMessage();
    }
}
//active li
$(document).on('click','#session li',() => {
	$('.active').removeClass('active');
	$(this).addClass('active');
	var index = $(this).index();
	$('.chat-active').removeClass('chat-active');
	$('.chat:eq('+index+')').addClass('chat-active');
});

$(document).on('click','.chat-active .emoji',() => {
	$('#emoji').css('display','block');
});

$('#emoji span').click(() => {
	var val = $('.chat-active input[type=text]').val();
	$('.chat-active input[type=text]').val(val+$(this).text());
	$('#emoji').css('display','none');
});

function liveChat(name) {
	socket = io.connect('ws://127.0.0.1:8360');

	$('h1').text(name);
	$('#app .main h2').text(name);

	// 正在连接
	socket.on('connecting', () => {
		console.log('connecting');
	});

	// 连接上
	socket.on('connect', () => {
		// 请求加入
		if(name){
			socket.emit('adduser', name);
		}
	});

	// 第一次登陆接收其它成员信息
	socket.on('login', (user) => {
		if(user.length >= 1){
			for(var i = 0; i < user.length; i++){
                if (user[i] !== name) {
				    incomeHtml(user[i], '/static/img/head.jpg');
                }
			}
		}
	});
    socket.on('chat', (data) => {

    })
	// 监听中途的成员加入
	socket.on('userjoin', (tname, index) => {
        incomeHtml(tname,'/static/img/head.jpg');
		showNotice('/static/img/head.jpg', tname, "上线了");
	});
	// 接收私聊信息
	socket.on('receive private message', (data) => {
		playRing();
		if(data.addresser == data.recipient) return;
		var head = '/static/img/head.jpg';
		$('#'+hex_md5(data.addresser)+' .chat-msg').append('<li><img src="'+head+'"><span class="speak">'+data.body+'</span></li>');
		if(document.hidden){
			showNotice(head, data.addresser, data.body);
		}
		scrollToBottom(hex_md5(data.addresser));
	});
	// 监听中途的成员离开
	socket.on('userleft', (data) => {
		$('#' + hex_md5(data)).remove();
		$('#li' + hex_md5(data)).remove();
	});

	// 连接失败
	socket.on('close', () => {
		$('.outline').css('display','block');
		$('#session').children().remove();
		$('#chat').children().remove();
	});

	// 重连
	socket.on('reconnect', () => {
		$('.outline').css('display','none');
		//继续用原来的name todo
	});

	// 监听重连错误 会多次尝试
	socket.on('reconnect_error', () => {
		console.log('attempt to reconnect has failed');
	});
}

function incomeHtml(tname,head){
	addUserToList(tname, head);
	// 会话窗口
	var html = '';
	html+='<div id="'+hex_md5(tname)+'" data-n="'+tname+'" class="chat"><div class="main">';
	html+='<div class="message"><div class="head"><p>'+tname+'</p></div>';
	html+='<div class="body"><ul class="chat-msg"></ul></div></div>';
	html+='<div class="footer"><div class="box"><div class="head">';
	html+='<svg class="icon emoji" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4692" xmlns:xlink="http://www.w3.org/1999/xlink"><defs></defs><path d="M520.76544 767.05792c-99.14368 0-180.30592-73.65632-193.78176-169.09312l-49.22368 0c13.78304 122.624 116.61312 218.29632 242.91328 218.29632S749.81376 720.5888 763.5968 597.9648l-49.0496 0C701.0816 693.4016 619.90912 767.05792 520.76544 767.05792zM512 0C229.23264 0 0 229.2224 0 512c0 282.75712 229.23264 512 512 512 282.76736 0 512-229.24288 512-512C1024 229.2224 794.76736 0 512 0zM511.95904 972.78976C257.46432 972.78976 51.1488 766.48448 51.1488 512c0-254.49472 206.30528-460.81024 460.81024-460.81024 254.48448 0 460.8 206.30528 460.8 460.81024C972.75904 766.48448 766.44352 972.78976 511.95904 972.78976zM655.57504 456.92928c31.06816 0 56.24832-25.1904 56.24832-56.24832 0-31.06816-25.18016-56.24832-56.24832-56.24832-31.06816 0-56.25856 25.18016-56.25856 56.24832C599.31648 431.73888 624.49664 456.92928 655.57504 456.92928zM362.73152 456.92928c31.06816 0 56.24832-25.1904 56.24832-56.24832 0-31.06816-25.1904-56.24832-56.24832-56.24832-31.0784 0-56.25856 25.18016-56.25856 56.24832C306.47296 431.73888 331.65312 456.92928 362.73152 456.92928z" p-id="4693"></path></svg>';
	html+='</div><div class="body"><input type="text" class="input" /></div>';
	html+='<div class="foot"><a class="send" href="javascript:void(0)">发送(Enter)</a></div></div></div></div></div>';
	$('#chat').append(html);
}

function addUserToList(tname, head) {
	$('#session').append('<li id="li'+hex_md5(tname)+'"><img src="'+head+'"><span class="nick-name">'+tname+'</span></li>');
}

// 发送消息
function sendMessage(head = '/static/img/head.jpg'){
	var recipient = $('.chat-active').attr('data-n');
	var val = $('.chat-active input').val();
	var name = window.localStorage.getItem("username");
	if(val == '') return;
	$('.chat-active .chat-msg').append('<li><img class="mehead" src="'+head+'"><span class="mespeak">'+val+'</span></li>');
	var data = {
			'addresser':name,
			'recipient':recipient,
			'type':'plain',
			'body':val
		}
	socket.emit('chat', data);
	$('.chat-active input').val('');
	scrollToBottom(hex_md5(recipient));
}

function scrollToBottom(root){
	$('#'+root+' .body').scrollTop($('#'+root+' .chat-msg').height());
}

function playRing() {
	$('#ding')[0].play();
}

// 弹出消息
function showNotice(head,title,msg){
    var Notification = window.Notification || window.mozNotification || window.webkitNotification;
    if(Notification){
        Notification.requestPermission(function(status){
            //status默认值'default'等同于拒绝 'denied' 意味着用户不想要通知 'granted' 意味着用户同意启用通知
            if("granted" != status){
                return;
            }else{
                var tag = "sds"+Math.random();
                var notify = new Notification(
                    title,
                    {
                        dir:'auto',
                        lang:'zh-CN',
                        tag:tag,//实例化的notification的id
                        icon: head,//通知的缩略图,//icon 支持ico、png、jpg、jpeg格式
                        body:msg //通知的具体内容
                    }
                );
                notify.onclick=function(){
                    //如果通知消息被点击,通知窗口将被激活
                    window.focus();
                },
                notify.onerror = function () {
                    console.log("HTML5桌面消息出错！！！");
                };
                notify.onshow = function () {
                    setTimeout(function(){
                        notify.close();
                    },2000)
                };
                notify.onclose = function () {
                    console.log("HTML5桌面消息关闭！！！");
                };
            }
        });
    }else{
        console.log("您的浏览器不支持桌面消息");
    }
}
