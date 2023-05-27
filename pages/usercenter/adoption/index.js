import {config} from '../../../config/index'
import Toast from 'tdesign-miniprogram/toast/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    domain: config.domain
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.request({
      url: config.domain + '/animal/adopt/self',
      method: 'POST',
      data: {
        "userId": wx.getStorageSync('userId'),
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': wx.getStorageSync('token')
      },
      success: (res)=> {
        if (res.data.code === 0) {
          console.log(res);
          this.setData({
            list: res.data.body.adoptions
          })
          for (let k = 0; k < this.data.list.length; k++) {
            this.data.list[k].time = this.data.list[k].time.replace('T', ' ')
            this.setData({
              list: this.data.list
            });
          }
        } else {
          console.log(res);
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
      fail: (res)=> {
        console.log(res)
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
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

  }
})