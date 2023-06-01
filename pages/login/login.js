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
      SHOW: ''  //页面加载中
  },
  onLoad: function () {
    let ID = wx.getStorageSync('userId')
    let TOKEN = wx.getStorageSync('token')
    if (ID && TOKEN) {
      self = this
      this.setData({ SHOW:false })
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: config.domain + '/hello',
        data: {
        },
        header: {
          'content-type': 'application/json', // 默认值
          'authorization': wx.getStorageSync('token')
        },
        method: 'POST',
        success:function(res) {
          wx.hideLoading();
          self.setData({ SHOW: true })
          if (res.data.code == 0) {
            wx.reLaunch({ url: '/pages/home/home' })
          }
        }
      })
    } else {
      this.setData({ SHOW: true })
    }
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
    let pw = e.detail.value.replace(/[^\w_@.!]/g,'');
    this.setData({ pw })
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
        if (res.data.code == 0) {
          self.setData({
              email: '',
              pw: ''
          })
          Toast({
            context: this,
            selector: '#t-toast',
            message: '登录成功',
            theme: 'success',
            direction: 'column',
          });
          wx.setStorageSync('userId', res.data.body.userId);
          wx.setStorageSync('token', res.data.body.token);
          setTimeout(() => {
            //wx.redirectTo({url:'../realpage/realpage'  })//删
            wx.reLaunch({ url: '/pages/home/home' })
          }, 1000)
        } else {
          if (timer) {
              clearTimeout(timer) 
              timer = undefined
          }
          var temp = res.data.code
          if(temp == 4 || temp == 5 || temp == 6 || temp == 7) {
            self.setData({email:''})
          }
          self.setData({
            errormessage: res.data.message,
            type: 'error',
            pw: '',
            show: true
          })
          timer = setTimeout(() => {
            self.setData({ show: false })
            }, 2000)
        }
      }
    })
    },
    methods: {
    }
})
