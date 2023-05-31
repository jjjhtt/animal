import {config} from "../../config/index"
import Toast, { hideToast } from 'tdesign-miniprogram/toast/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    path: '',
    name: '',
    id: ''
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

  onClickTrack() {
    wx.navigateTo({ url: '/pages/write/map/index' });
  },

  async onClickPhoto() {
    const tempFilePath = new Promise((resolve, reject) => {
      wx.chooseMedia({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        mediaType: ['image'],
        success: (res) => {
          console.log(res);
          const path = res.tempFiles[0].tempFilePath;
          this.setData({
            path: path
          })
          console.log(this.data.path)
          Toast({
            context: this,
            selector: '#t-toast',
            duration: -1,
            theme: 'loading',
            message: '正在识别中',
            direction: 'column',
          });
          wx.uploadFile({
            url: config.domain + '/image/upload', 
            filePath: path,
            name: "image",
            formData: {
              "type": "animal"
            },
            header: {
              'content-type': 'multipart/form-data',
              'authorization': wx.getStorageSync('token')
            },
            success: (res) =>{
              //console.log(res.data);
              let p = JSON.parse(res.data);
              //console.log(p.body.imagePath);
              if (p.code == 7) {
                Toast({
                  message: p.message,
                  theme: 'error',
                });
                wx.clearStorageSync();
                setTimeout(() => {
                  wx.reLaunch({
                    url: '/pages/login/login',
                  })
                }, 1000)
                resolve(res)
                return
              }
              if (p.code == 1) {
                hideToast({
                  context: this,
                  selector: '#t-toast',
                });
                Toast({
                  message: "图片大小超过10MB",
                });
                resolve(res)
                return
              }
              wx.request({
                url: config.domain + '/animal/ai',
                data: {
                    "image": p.body.imagePath
                },
                method: 'POST',
                header: {
                  'content-type': 'application/json', // 默认值
                  'authorization': wx.getStorageSync('token')
                },
                success: (res) =>{
                  hideToast({
                    context: this,
                    selector: '#t-toast',
                  });
                  console.log(res);
                  if (res.data.code === 0) {
                    console.log(res);
                    this.setData({
                      name: res.data.body.animalName,
                      id: res.data.body.animalId
                    })
                    wx.navigateTo({
                      url: `./classify/index`,
                    })
                    resolve(res);
                  } else if (res.data.code === 3){
                    this.setData({
                      name: '无匹配',
                    })
                  } else {
                    console.log(res.data.message);
                    Toast({
                      context: this,
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
            },
            fail: (err) => {
              hideToast({
                context: this,
                selector: '#t-toast',
              });
              reject(err)},
          })
        },
        fail: (err) => reject(err),
      });
    });
  },
})