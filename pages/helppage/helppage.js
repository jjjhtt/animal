// pages/helppage/helppage.js
import Toast from 'tdesign-miniprogram/toast/index';
import {config} from '../../config/index'
Page({
  data: {
    imgUrls: [],
    current: 0,
    tweetid: 1,
    userid: 0,
    helpid: 0,
    autoplay: true,//自动切换
    indicatorDots: false,//图片指示点
    interval: 4500,//切换间隔
    duration: 1000,//滑动时长
    username:'未知',
    time:'未知',
    solveState: true,
    qtitle: '',
    qcontent: '',
    bestAns: false,
    bestname: '',
    bestdata: '',
    besttext: '',
    commentnum: 0,
    replylist: [],
    inputnow: false,
    inputBottom: 0,
    inputText: '',
    replylistLoadStatus: 0,
    swiperHeight: 0 //轮播图高度
  },
  replyListPagination: {
    index: 0,
    num: 8,
  },
  monitorCurrent: function(e) {
      let current = e.detail.current;
      this.setData({current: current})
  },
  onLoad(options) {
    this.setData({
      bestAns: true,
      userid: wx.getStorageSync('userId'),
      tweetid: options.id
    })
    this.getdata()
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
  changeState() {
    this.setData({solveState : !this.data.solveState})
    console.log(this.data.userid)
    console.log(this.data.helpid)
    
  },
  handleChange(e) {
    var self = this
    wx.request({
      url: config.domain + '/help/changeStatus',
      method: 'POST',
      data: {
        "userId": wx.getStorageSync('userId'),
        "tweetId": this.data.tweetid
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': wx.getStorageSync('token')
      },
      success(res) {
        console.log(res)
        if (res.data.code == 0) {
          self.setData({solveState : !self.data.solveState})
        } else {
          Toast({
            context: this,
            selector: '#t-toast',
            message: res.data.message,
            theme: 'error',
          });
        }
      }
    })
  },
  onReachBottom() {
    if (this.data.replylistLoadStatus == 0) {
      this.loadreplylist();
    }
  },
  onReTry() {
    this.loadreplylist();
  },
  async loadreplylist(fresh = false) {
    if (fresh) {
      wx.pageScrollTo({
        scrollTop:0,
      })
    }
    this.setData({ replylistLoadStatus: 1 })
    let pageIndex = this.replyListPagination.index + 1;
    if (fresh) {
      pageIndex = 1
    }
    try {
      let nextList = [{name:'小飞棍', id:1, content: '爱信等', time:'今天20:00', likes:999, },]
      wx.request({
        url: 'url',
        method: 'POST',
        data: {
          "userId": wx.getStorageSync('userId'),
          "id": this.data.tweetid,
          "page": pageIndex
        },
        header: {
          'content-type': 'application/json', // 默认值
          'authorization': wx.getStorageSync('token')
        },
        success(res) {
          if (res.data.code == 0) {
            
          } else {
            Toast({
              context: this,
              selector: '#t-toast',
              message: res.data.message,
              theme: 'error',
            });
          }
        }
      })
      this.setData({
        //replylist: this.data.replylist.concat(nextList),
        replylistLoadStatus: 0,
      });
      this.replyListPagination.index = pageIndex;
      if (JSON.stringify(nextList) == '{}') {
        this.setData({ replylistLoadStatus: 2 });
      }
    } catch (err) {
      console.log(err);
      this.setData({ replylistLoadStatus: 3 });
    }
    
  },
  onInputValueChange(e) {
      this.setData({inputText:e.detail.value})
  },
  inputBindFocus(e) {
      this.setData({inputBottom:e.detail.height, inputnow:true})
  },
  inputBindBlur() {
      this.setData({inputBottom:0, inputnow:false})
  },
  sendtext() {
    wx.request({
      url: config.domain + '/tweet/addComment',
      method: 'POST',
      data: {
        "userId":wx.getStorageSync('userId'),
        "tweetId": this.data.tweetid,
        "comment":this.data.inputText,
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': wx.getStorageSync('token')
      },
      success(res) {
        console.log(res)
        if (res.data.code == 0) {
          Toast({
            context: this,
            selector: '#t-toast',
            message: '发送成功',
            theme: 'success',
            direction: 'column',
          });
        } else {
          Toast({context: this,selector: '#t-toast',message: res.data.message,theme: 'error',});
        }
      }
    })
    this.setData({inputText: ''})
  },
  getdata: function() {
    self = this
    wx.request({
      url: config.domain + '/tweet/content',
      method: 'POST',
      data: {
        "userId": wx.getStorageSync('userId'),
        "tweetId": this.data.tweetid,
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': wx.getStorageSync('token')
      },
      success(res) {
        console.log(res)
        if (res.data.code == 0) {
          let sp = res.data.body
          self.setData({
            imgUrls: sp.images == null ? [] : sp.images, 
            qtitle: sp.title,
            qcontent: sp.content,
            time: sp.time==null ? '未知' : sp.time,
            username: sp.username,
            commentnum: sp.comments,
            solveState: sp.solved,
            helpid: sp.userId
          })
        } else {
          Toast({context: this,selector: '#t-toast',message: res.data.message,theme: 'error',});
        }
      }
    })
    wx.request({
      url: config.domain + '/tweet/getComments',
      method: 'POST',
      data: {
        "userId": wx.getStorageSync('userId'),
        "tweetId": this.data.tweetid,
        "commentPage": this.replyListPagination.index
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': wx.getStorageSync('token')
      },
      success(res) {
        console.log(res)
        if (res.data.code == 0) {
          self.setData({replylist: res.data.body.comments})
        } else {
          Toast({
            context: this,
            selector: '#t-toast',
            message: res.data.message,
            theme: 'error',
          });
        }
      }
    })
  },
})