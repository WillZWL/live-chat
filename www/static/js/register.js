$('.register-btn').click(function(){
  var $username = $('#username').val(); // Input for username
  var $password = $('#password').val();
  if ($username && $password) {
    var data = {username: $username, password: $password};
    $.ajax({
      type: "POST",
      url: '/home/register/register',
      data,
      dataType: "json",
      success: function(res) {
        if (res.errno == 0) {
          $('.error-info').addClass('bg-success').css('display','block').text('注册成功');
        } else {
          $('.error-info').addClass('bg-danger').css('display','block').text('注册失败, ' + res.errmsg);
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