$('.login-btn').click(function(){
  var $username = $('#username').val(); // Input for username
  var $password = $('#password').val();
  if ($username && $password) {
    var data = {username: $username, password: $password};
    $.ajax({
      type: "POST",
      url: '/home/login/login',
      data,
      dataType: "json",
      success: function(res) {
        if (res.errno == 0) {
          window.localStorage.setItem("username", res.data.username);
          window.location.href = '/home/index/index'
        } else {
          alert('登录失败');
        }
      },
      error: function(res) {
        console.log(res);
      }
    })
  } else {
    alert('Login Fail')
  }
});