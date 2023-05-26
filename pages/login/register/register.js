import Toast from 'tdesign-miniprogram/toast/index';
import {config} from '../../../config/index'
var util = require('../../../utils/throttle');
Page({
    data: {
        username: '',
        email: '',
        phone: '',
        pw: '',
        pw2: '',
        errormessage: '',
        ma: '',
        sendTime: '获取验证码',
        sendColor: '#00BFFF',
        sendWaiting: false,
        waitTime: 60
    },
    returnlogin: function() {
        wx.redirectTo({ url: '../login', })
    },
    getusername: function(e) {
        this.setData({ username: e.detail.value })
    },
    getemail: function(e) {
        this.setData({ email: e.detail.value })
    },
    getma: function(e) {
      this.setData({ ma: e.detail.value })
    },
    getphone: function(e) {
      this.setData({ phone: e.detail.value })
    },
    getpw: function(e) {
        this.setData({ pw: e.detail.value })
    },
    getpw2: function(e) {
        this.setData({ pw2: e.detail.value })
    },
    requestma: util.throttle(function (e) {
      var inter = setInterval(function() {
        this.setData({
          sendWaiting: true,
          sendColor: '#cccccc',
          sendTime: this.data.waitTime + 's后重发',
          waitTime: this.data.waitTime - 1
        });
        if (this.data.waitTime < 0) {
          clearInterval(inter)
          this.setData({
            sendColor: '#00BFFF',
            sendTime: '获取验证码',
            waitTime: 60,
            sendWaiting: false
          });
        }
      }.bind(this), 1000);
      self = this
      console.log(this.data.email)
      wx.request({
        url: config.domain + '/user/registerRequest',
        data: { email: this.data.email },
        method: 'POST',
        success: function(res) {
          console.log(res)
          if (res.data.code == 0) {
            Toast({
              context: this,
              selector: '#t-toast',
              message: res.data.message,
            });
          } else {
            Toast({
              context: this,
              selector: '#t-toast',
              message: res.data.message,
            });
            self.setData({email:''})
          }
        }
      })
    }, 3000),
    postregister: function() {
      self = this
      wx.request({
        url: config.domain + '/user/registerVerify',
        data: { username: this.data.username,
          password:this.data.pw,
          passwordConfirm: this.data.pw2,
          email: this.data.email,
          /*phone: this.data.phone,*/
          verification: this.data.ma },
        method: 'POST',
        success: function(res) {
          console.log(res)
          if (res.data.code == 0) {
            Toast({
              context: this,
              selector: '#t-toast',
              message: '注册成功',
              theme: 'success',
              direction: 'column',
            });
            setTimeout(() => {
              wx.navigateBack()
              }, 2000)
          } else {
            Toast({
              context: this,
              selector: '#t-toast',
              message: res.data.message,
              theme: 'error',
              direction: 'column',
            });
          }
          self.setData({
            username: '',
            email: '',
            phone: '',
            pw: '',
            pw2: '',
            ma: ''
          })
        }
      })
    }
  })
  