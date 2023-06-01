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
    inputCode(e) {
      let pw = e.detail.value.replace(/[^\w_@.!]/g,'');
      this.setData({
        pw,
      })
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
      let ma = e.detail.value.replace(/[^\w_@.!]/g,'');
      this.setData({ ma })
    },
    getphone: function(e) {
      this.setData({ phone: e.detail.value })
    },
    getpw: function(e) {
      let pw = e.detail.value.replace(/[^\w_@.!]/g,'');
      this.setData({
        pw,
      })
      //this.setData({ pw: e.detail.value })
    },
    getpw2: function(e) {
      let pw2 = e.detail.value.replace(/[^\w_@.!]/g,'');
      this.setData({
        pw2,
      })
      //this.setData({ pw2: e.detail.value })
    },
    requestma: util.throttle(function (e) {
      self = this
      wx.request({
        url: config.domain + '/user/registerRequest',
        data: { email: this.data.email },
        method: 'POST',
        success: function(res) {
          console.log(res)
          if (res.data.code == 0) {
            self.realrequest()
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
    }, 1000),
    realrequest: util.throttle(function (e) {
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
              self.setData({
                username: '',
                email: '',
                phone: '',
                pw: '',
                pw2: '',
                ma: ''
              })
              }, 2000)
          } else {
            console.log('code: ' + res.data.code)
            switch (res.data.code) {
              case 11:
              case 12:
              case 13:
                self.setData({ username:'' })
                break;
              case 14:
              case 15:
              case 16:
                self.setData({ pw:'',pw2:'' })
                break;
              case 8:
                self.setData({ email:'' })
                break;
              case 9:
              case 10:
                self.setData({ ma:'' })
                break;
            }
            Toast({
              context: this,
              selector: '#t-toast',
              message: res.data.message,
              theme: 'error',
              direction: 'column',
            });
          }
          
        }
      })
    }
  })
  