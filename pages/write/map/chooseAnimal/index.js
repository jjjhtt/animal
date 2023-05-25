import { getCategoryList } from '../../../../services/document/fetchCategoryList';
import {config} from '../../../../config/index'
import Toast, { hideToast } from 'tdesign-miniprogram/toast/index';
Page({
  data: {
    /*tabList: [{
      text: '猫',
      key: 0,
    },
    {
      text: '狗',
      key: 1,
    },
    {
      text: '鸟',
      key: 2,
    }],*/
    list: [],
    nowkey: 0,
    match: '',
    tweetsListLoadStatus: 0
  },

  tweetListPagination: {
    index: 0,
  },

  submitHandle(e) {
    this.setData({
      match: e.detail.value
    });
    this.init(true);
  },

  /*tabChangeHandle(e) {
    this.setData({
      nowkey: e.detail.value
    });
    this.init();
  },*/

  onShow() {
    
  },
  onChange() {
    
  },
  onLoad() {
    this.init(true);
  },

  onReTry() {
    this.init();
  },

  onReachBottom() {
    if (this.data.tweetsListLoadStatus === 0) {
      this.init();
    }
  },

  onPullDownRefresh() {
    this.init();
  },

  async onClick() {
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
          //console.log(this.data.path)
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
                  //console.log(res);
                  if (res.data.code === 0) {
                    console.log(res);
                    this.setData({
                      name: res.data.body.animalName,
                      id: res.data.body.animalId
                    })
                    wx.navigateTo({
                      url: `/pages/write/classify/index?t=1`,
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

  async init(fresh = false) {
    if (fresh) {
      wx.pageScrollTo({
        scrollTop: 0,
      });
    }
    this.setData({ tweetsListLoadStatus: 1 });
    let pageIndex = this.tweetListPagination.index + 1;
    if (fresh) {
      this.tweetListPagination.index = 0;
      pageIndex = 0;
    }
    try {
      const result = await getCategoryList(pageIndex, this.data.match);
      if (result === null) {
        if (fresh) {
          this.setData({
            list: []
          })
        }
        this.setData({ tweetsListLoadStatus: 2 });
        return;
      }
      this.setData({
        list: fresh ? result : this.data.list.concat(result),
        tweetsListLoadStatus: 0,
      });
      this.tweetListPagination.index = pageIndex;
    } catch (error) {
      this.setData({ tweetsListLoadStatus: 3 });
    }
  },
});
