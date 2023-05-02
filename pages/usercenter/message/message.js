// pages/usercenter/message/message.js
import {config} from '../../../config/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    labaSrc: "../../../images/laba2.png",
    msgList: [
      {
        id: 2,
        content: '小于12小于12',
        info: '小于12小于12',
        read: true
      },
      {
        id: 2,
        content: '大于12大于12大于12大于12',
        info: '大于12大于12大于12...',
        read: false
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.request({
      url: config.domain + '/user/message/get',
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
          if(res.data.body != null && res.data.body.length > 0) {
            for(var i = 0; i < res.data.body.messages.length; i++) {
              var item = res.data.body.messages[i]
              var info = item.content.length <= 12 ? 
                item.content :  item.content.substring(0,11)
              item['info'] = info
              this.data.msgList.push(item)
            }
          }
        } else {
          console.log(res);
          Toast({
            context: this,
            selector: '#t-toast',
            message: res.message,
            theme: 'error',
          });
        }
      },
      fail: (res)=> {
        console.log(res)
      }
    })
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