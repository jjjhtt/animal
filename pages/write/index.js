import {config} from "../../config/index"
import Toast from 'tdesign-miniprogram/toast/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  onClickHelp() {
    wx.navigateTo({ url: '/pages/write/newHelp/index' });
  },

  onClickTweet() {
    wx.navigateTo({ url: '/pages/write/newTweet/index' });
  },

  async onClickPhoto() {
    try {
      const tempFilePath = await new Promise((resolve, reject) => {
        wx.chooseMedia({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
          success: (res) => {
            const path = res.tempFiles[0].tempFilePath;
            wx.uploadFile({
              url: config.domain + '/upload', 
              formData: {
                "image": res.tempFiles[0],
                "type": "user"
              },
              success (res){
                console.log(res);
                const data = res.data;
                resolve(path);
              },
              fail: (err) => reject(err),
            })
          },
          fail: (err) => reject(err),
        });
      });
      Toast({
        context: this,
        selector: '#t-toast',
        message: `已选择图片-${tempFilePath}`,
        theme: 'success',
      });
    } catch (error) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: error.errMsg || error.msg || '修改头像出错了',
        theme: 'error',
      });
    }
  },
})