import Toast from 'tdesign-miniprogram/toast/index';
import {config} from '../../../../config/index'

Page({
  data: {
    passwordValue: '',
    passwordConfirm: '',
  },
  onLoad() {

  },

  isAlphaNumeric(str) {
    return /^[a-zA-Z0-9]+$/.test(str);
  },

  onSubmit() {
    if (!this.isAlphaNumeric(this.data.passwordValue) || !this.isAlphaNumeric(this.data.passwordConfirm)) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: "密码只能包含数字或字母",
        theme: 'fail',
      });
      return;
    }
    wx.request({
      url: config.domain + '/user/modify',
      data: {
          "userId": wx.getStorageSync('userId'),
          "username": "",
          "password": this.data.passwordValue,
          "passwordConfirm": this.data.passwordConfirm,
          "phone": "",
          "bio": ""
      },
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': wx.getStorageSync('token')
      },
      success(res) {
        console.log(res);
        if (res.data.code === 0) {
          Toast({
            context: this,
            selector: '#t-toast',
            message: "修改成功",
            theme: 'success',
          });
          setTimeout(()=>
          {
            wx.navigateBack();
          }, 1000)
        } else {
          Toast({
            context: this,
            selector: '#t-toast',
            message: res.data.message,
            theme: 'error',
          });
          if (res.data.code == 7) {
            wx.clearStorageSync();
            setTimeout(() => {
              wx.reLaunch({
                url: '/pages/login/login',
              })
            }, 1000)
          }
        }
      },
    });
    //wx.navigateBack();
  },
  clearContent() {
    this.setData({
      passwordValue: '',
    });
  },
});
