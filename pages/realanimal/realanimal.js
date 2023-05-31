import Toast from 'tdesign-miniprogram/toast/index';
import {config} from '../../config/index';
import { fetchTweetsList } from '../../services/tweet/fetchTweets';
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
      adoptReason: '',
      disabled: true,
      tweetsList: [],
      tweetsListLoadStatus: 0
  },

  tweetListPagination: {
    index: 0,
    num: 8,
  },

  handleAdopt() {
    this.setData({
      showTextAndTitleWithInput: true
    })
    
  },
  goTrack() {
    let id = this.data.animalId
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
    /*
    this.setData({
      swiperHeight: swiperH		//设置swiper高度
    })*/
  },
  monitorCurrent: function(e) {
      let current = e.detail.current;
      this.setData({current: current})
  },
  onReasonInput(e) {
    if (e.detail.value.trim() != '') {
      this.setData({
        disabled: false,
        adoptReason:e.detail.value
      })
    } else {
      this.setData({
        disabled: true,
        adoptReason:e.detail.value
      })
    }
  },
  onClear() {
    this.setData({
      disabled: true
    })
  },
  closeDialog(res) {
    this.setData({ 
      showTextAndTitleWithInput: false,
      //adoptReason: ''
    });
  },

  confirm() {
    self = this
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
          Toast({context: this,selector: '#t-toast',message: "申请成功",theme: 'success',});
        } else {
          Toast({context: this,selector: '#t-toast',message: res.data.message,theme: 'error',});
          if (res.data.code == 7) {
            wx.clearStorageSync();
            setTimeout(() => {
              wx.reLaunch({
                url: '/pages/login/login',
              })
            }, 1000)
          }
        }
      }
    })
    
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
          wx.getImageInfo({
            src:'https://anith2.2022martu1.cn' + res.data.body.maxHeightImage,
            success:function(RES) {
              var winWid = wx.getSystemInfoSync().windowWidth;
              var imgh=RES.height;
              var imgw = RES.width;
              var swiperH = winWid * imgh / imgw + "px";
              self.setData({
                swiperHeight: swiperH		//设置swiper高度
              })
            }
          })
          self.setData({
            content_title: res.data.body.name,
            contenttext: res.data.body.intro,
            adopted: res.data.body.adopted,
            imgUrls: res.data.body.avatar == null ? [] : res.data.body.avatar
          })
          wx.stopPullDownRefresh();
          self.loadtweetsList(true);
        } else {
          Toast({context: this,selector: '#t-toast',message: res.data.message,theme: 'error',});
          if (res.data.code == 7) {
            wx.clearStorageSync();
            setTimeout(() => {
              wx.reLaunch({
                url: '/pages/login/login',
              })
            }, 1000)
          }
        }
      }
    })
    setTimeout(() => {
      wx.hideNavigationBarLoading()
    }, 2000);
  },

  onPullDownRefresh() {
    wx.stopPullDownRefresh();
    this.loadtweetsList(true);
  },

  onReachBottom() {
    if (this.data.tweetsListLoadStatus === 0) {
      this.loadtweetsList();
    }
  },

  async loadtweetsList(fresh = false) {
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
      const nextList = await fetchTweetsList(pageIndex, '热度', '#'.concat(this.data.content_title));
      //console.log(nextList);
      if (nextList === null) {
        if (fresh) {
          this.setData({
            tweetsList: []
          })
        }
        this.setData({ tweetsListLoadStatus: 2 });
        return;
      }
      this.setData({
        tweetsList: fresh ? nextList : this.data.tweetsList.concat(nextList),
        tweetsListLoadStatus: 0,
      });
      this.tweetListPagination.index = pageIndex;
    } catch (err) {
      //console.log(err);
      this.setData({ tweetsListLoadStatus: 3 });
    }
  }
})