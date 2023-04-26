import Message from 'tdesign-miniprogram/message/index';
import Toast from 'tdesign-miniprogram/toast/index';
import {config} from '../../config/index'
var toptip
var timer
var DEFAULT_CONFIG = {
  duration: 3000,
  type: 'error' // warn、success、error
}
Page({
  data: {
      dispassword: false,
      email: '',
      pw: '',
      errormessage: '',
      type: '',
      show: '',
  },
  onReady: function () {
    this.setData({
      dispassword: false,
      email: '',
      pw: '',
    })
    toptip = this.selectComponent('#toptip')
  },
  changepw: function() {
    this.setData({ dispassword: !this.data.dispassword })
  },
  getemail: function(e) {
      this.setData({ email: e.detail.value })
  },
  getpw: function(e) {
      this.setData({ pw: e.detail.value })
  },
  gore: function() {
    wx.navigateTo({
      url: './register/register',
    })
  },
  gopw: function() {
    wx.navigateTo({ url: './forgetpw/forgetpw' })
  },
  loginjudge: function() {
    self = this
    wx.request({
      url: config.domain + '/login',
      data: {
        username:this.data.email,
        password: this.data.pw,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success:function(res) {
        console.log(res)
        if (res.data.code == 0) {
          Toast({
            context: this,
            selector: '#t-toast',
            message: '登陆成功',
            theme: 'success',
            direction: 'column',
          });
          wx.setStorageSync('userId', res.data.body.userId);
          wx.setStorageSync('token', res.data.body.token);
          setTimeout(() => {
            //wx.redirectTo({url:'../realpage/realpage'  })//删
            wx.reLaunch({ url: '/pages/home/home' })
          }, 1500)
        } else {
          if (timer) {
              clearTimeout(timer) 
              timer = undefined
          }
          self.setData({
            errormessage: res.data.message,
            type: 'error',
            show: true
          })
          timer = setTimeout(() => {
            self.setData({ show: false })
            }, 2000)
        }
      }
    })
    this.setData({
        email: '',
        pw: ''
    })
    },
    methods: {
    }
})
