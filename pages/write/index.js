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
    wx.navigateTo({
      url: './classify/index',
    })
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
              filePath: path,
              name: "image",
              formData: {
                "image": res.tempFiles[0],
                "type": "user"
              },
              success (res){
                console.log(res);
                wx.navigateTo({
                  url: './classify/index',
                })
                resolve(path);
              },
              fail: (err) => reject(err),
            })
          },
          fail: (err) => reject(err),
        });
      });
    } catch (error) {
      console.log(error);
    }
  },
})