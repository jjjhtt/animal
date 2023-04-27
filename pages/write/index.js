import {config} from "../../config/index"
import Toast from 'tdesign-miniprogram/toast/index';

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

  async onClickPhoto() {
    const tempFilePath = new Promise((resolve, reject) => {
      wx.chooseMedia({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          console.log(res);
          const path = res.tempFiles[0].tempFilePath;
          this.setData({
            path: path
          })
          //console.log(this.data.path)
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
                  //console.log(res);
                  if (res.data.code === 0) {
                    //console.log(res);
                    this.setData({
                      name: res.data.body.animalName,
                      id: res.data.body.animalId
                    })
                    Toast({
                      context: this,
                      selector: '#t-toast',
                      message: "成功",
                      theme: 'success',
                    });
                    wx.navigateTo({
                      url: `./classify/index`,
                    })
                    resolve(res);
                  } if (res.data.code === 3){
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
                  }
                },
              });
            },
            fail: (err) => reject(err),
          })
        },
        fail: (err) => reject(err),
      });
    });
  },
})