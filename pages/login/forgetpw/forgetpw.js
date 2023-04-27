// pages/login/forgetpw/forgetpw.js
import {config} from '../../../config/index'
import Toast from 'tdesign-miniprogram/toast/index'
Page({
  data: {
    email:'',
    ma: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  getemail: function(e) {
      this.setData({ email: e.detail.value })
  },
  getma: function(e) {
    this.setData({ ma: e.detail.value })
  },
  requestma: function() {
    var self = this
    console.log(this.data.email)
      wx.request({
        url: config.domain + '/user/resetPasswordRequest',
        data: { email: this.data.email },
        method: 'POST',
        success: function(res) {
          Toast({
            context: this,
            selector: '#t-toast',
            message: res.data.message,
          });
          if (res.data.code != 0) {
            self.setData({email:''})
          }
          console.log(res)
        }
      })
  },
  returnlogin: function() {
      wx.redirectTo({ url: '../login', })
  },
  postregister: function() {
    self = this
    wx.request({
      url: config.domain + '/user/resetPasswordVerify',
      data: { 
        email: this.data.email,
        verification: this.data.ma },
      method: 'POST',
      success: function(res) {
        console.log(res)
        if (res.data.code == 0) {
          Toast({
            context: this,
            selector: '#t-toast',
            message: '重置成功',
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
          email: '',
          ma: ''
        })
      }
    })
  }
})