const md5 = require('js-md5');

global.encryptPassword = function(password, salt){
  if (password) {
    return md5(md5(password).toUpperCase() + salt).toUpperCase();
  }
  return false;
}