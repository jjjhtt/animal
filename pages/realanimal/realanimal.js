import Toast from 'tdesign-miniprogram/toast/index';
import {config} from '../../config/index'
Page({
  data: {
      imgUrls: '',
      animalid: 0,
      autoplay: true,//自动切换
      indicatorDots: false,//图片指示点
      interval: 5000,//切换间隔
      duration: 1000,//滑动时长
      current: 0,
      swiperHeight: 0,
      content_title: '',
      contenttext: '',
      adopted: false,
      showTextAndTitleWithInput: false,
      adoptReason: ''
  },
  handleAdopt() {
    this.setData({
      showTextAndTitleWithInput: true
    })
    
  },
  goTrack() {
    wx.navigateTo({
      url: `./track/track?id=${this.data.animalid}`,
    });
  },
  onLoad: function(options) {
    //wx.showNavigationBarLoading()
    this.setData({animalid: options.id})
    this.getdata(options.id)
  },
  computeImgHeight(e) {
    var winWid = wx.getSystemInfoSync().windowWidth;      //获取当前屏幕的宽度
    var imgh=e.detail.height;　　　　　　　　　　　　　　　 //图片高度
    var imgw=e.detail.width;
    var swiperH = winWid * imgh / imgw + "px"　           //等比设置swiper的高度。  
    //即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度  -->  swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
    this.setData({
      swiperHeight: swiperH		//设置swiper高度
    })
  },
  monitorCurrent: function(e) {
      let current = e.detail.current;
      this.setData({current: current})
  },
  onReasonInput(e) {
    this.setData({ adoptReason:e.detail.value })
  },
  closeDialog(res) {
    self = this
    if(res.type == 'confirm') {
      wx.request({
        url: config.domain + '/animal/adopt/apply',
        method: 'POST',
        data: {
          "userId":wx.getStorageSync('userId'),
          "animalId": this.data.animalid,
          "reason": this.data.adoptReason
        },
        header: {
          'content-type': 'application/json', // 默认值
          'authorization': wx.getStorageSync('token')
        },
        success(res) {
          self.setData({adoptReason: ''})
          if (res.data.code == 0) {
          } else {
            Toast({context: this,selector: '#t-toast',message: res.data.message,theme: 'error',});
          }
        }
      })
    }
    
    this.setData({ 
      showTextAndTitleWithInput: false,
      //adoptReason: ''
    });
  },
  getdata: function(aniID) {
    self = this
    wx.request({
      url: config.domain + '/animal/content',
      method: 'POST',
      data: {
        "animalId": aniID,
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': wx.getStorageSync('token')
      },
      success(res) {
        console.log(res)
        if (res.data.code == 0) {
          self.setData({
            content_title: res.data.body.name,
            contenttext: res.data.body.intro,
            adopted: res.data.body.adopted,
            imgUrls: res.data.body.avatar == null ? [] : res.data.body.avatar
          })
        } else {
          Toast({context: this,selector: '#t-toast',message: res.data.message,theme: 'error',});
        }
      }
    })
    setTimeout(() => {
      wx.hideNavigationBarLoading()
    }, 2000);
  }
})