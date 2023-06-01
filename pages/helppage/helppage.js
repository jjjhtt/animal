// pages/helppage/helppage.js
import Toast from 'tdesign-miniprogram/toast/index';
import {config} from '../../config/index';
import { getContent } from '../../services/help/getContent';
import { getComments } from '../../services/help/getComments';
Page({
  data: {
    imgUrls: [],
    imgUrl: '',
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
    bestdate: '',
    besttext: '',
    commentnum: 0,
    replylist: [],
    officialReplyList: [],
    inputnow: false,
    inputBottom: 0,
    inputText: '',
    replylistLoadStatus: 0,
    swiperHeight: 0, //轮播图高度
    hasLiked: false,
    hasStarred: false,
    likecount: 0,
    collectcount: 0,
    show: false, //页面展示控制
    showWarnConfirm: false,
    autoWidth: 200, //底部输入框宽度
    helpIndex: -1
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
      tweetid: options.id,
      helpIndex: options.index,
      show: false
    })
    this.getdata()
  },
  async computeImgHeight(e) {
    var winWid = wx.getSystemInfoSync().windowWidth;      //获取当前屏幕的宽度
    var imgh=e.detail.height;　　　　　　　　　　　　　　　 //图片高度
    var imgw=e.detail.width;
    var swiperh = winWid * imgh / imgw;
    var swiperH = winWid * imgh / imgw + "px"　           //等比设置swiper的高度。  
    //即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度  -->  swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
    /*
    console.log(swiperh)
    if(swiperh > this.data.swiperHeight) {
      this.setData({
        swiperHeight: swiperH		//设置swiper高度
      })
    }*/
  },
  changeState() {
    this.setData({solveState : !this.data.solveState})
  },
  handleChange(e) {
    const { key } = e.currentTarget.dataset;
    this.setData({ [key]: true });
  },
  closeDialog(e) {
    var self = this
    if (e.type == "confirm") {
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];
      var i = this.data.helpIndex
      if (this.data.solveState) {
        prevPage.setData({
          [`tweetsList[${i}].solved`]: false,
        })
      } else {
        prevPage.setData({
          [`tweetsList[${i}].solved`]: true,
        })
      }
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
          if (res.data.code == 0) {
            self.setData({solveState : !self.data.solveState})
          } else {
            Toast({
              context: this,
              selector: '#t-toast',
              message: res.data.message,
              theme: 'error',
            });
            if (res.data.code == 7) {
              wx.clearStorageSync();  //清除缓存
              setTimeout(() => {
                wx.reLaunch({
                  url: '/pages/login/login',
                })
              }, 1000)
            }
          }
        }
      })
    }
    this.setData({ showWarnConfirm : false})
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
      const nextList = await getComments(pageIndex, this.data.tweetid);
      if (nextList == null) {
        this.setData({ replylistLoadStatus: 2 });
        return 0;
      }
      this.setData({
        replylist: fresh ? nextList : this.data.replylist.concat(nextList),
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
      this.setData({inputBottom:e.detail.height, inputnow:true, autoWidth:280})
  },
  inputBindBlur() {
      this.setData({inputBottom:0, inputnow:false, autoWidth:200})
  },
  monitorlike: function(e) {
    var self = this
    let i = e.currentTarget.dataset.id
    const changelike = `replylist[${i}].likeNum`
    const changeislike = "replylist[" + i + "].isLike"
    wx.request({
      url: config.domain + '/comment/like',
      method: 'POST',
      data: {
        "userId": wx.getStorageSync('userId'),
	      "commentId": this.data.replylist[i].id
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': wx.getStorageSync('token')
      },
      success(res) {
        if (res.data.code == 0) {
          if (res.data.body.isLike == true) {
            let like = self.data.replylist[i].likeNum + 1
            self.setData({[changelike]:like, [changeislike]: res.data.body.isLike})
          } else {
            let like = self.data.replylist[i].likeNum - 1
            self.setData({[changelike]:like, [changeislike]: res.data.body.isLike})
          }
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
  },
  monitorlikef: function(e) {
    var self = this
    let i = e.currentTarget.dataset.id
    const changelike = `officialReplyList[${i}].likeNum`
    const changeislike = "officialReplyList[" + i + "].isLike"
    wx.request({
      url: config.domain + '/comment/like',
      method: 'POST',
      data: {
        "userId": wx.getStorageSync('userId'),
	      "commentId": this.data.officialReplyList[i].id
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': wx.getStorageSync('token')
      },
      success(res) {
        if (res.data.code == 0) {
          if (res.data.body.isLike == true) {
            let like = self.data.officialReplyList[i].likeNum + 1
            self.setData({[changelike]:like, [changeislike]: res.data.body.isLike})
          } else {
            let like = self.data.officialReplyList[i].likeNum - 1
            self.setData({[changelike]:like, [changeislike]: res.data.body.isLike})
          }
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
  },
  deleteComment(e) {
    let i = e.currentTarget.dataset.id
    wx.request({
      url: config.domain + '/comment/delete',
      method: 'POST',
      data: {
        "userId":wx.getStorageSync('userId'),
        "commentId":this.data.replylist[i].id,
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': wx.getStorageSync('token')
      },
      success(res) {
        if (res.data.code == 0) {
          self.data.replylist.splice(i, 1)
          self.setData({
            replylist: self.data.replylist
          })
          Toast({context:this,selector:'#t-toast',message:'删除成功',theme:'success',direction:'column',});
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
    this.setData({inputText: ''})
  },
  likeTweet: function(e) {
    var self = this
    wx.request({
      url: config.domain + '/tweet/like',
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
        if (res.data.code == 0) { 
          if (self.data.hasLiked == false) {
            self.setData({hasLiked: true, likecount: self.data.likecount + 1})
          } else {
            self.setData({hasLiked: false, likecount: self.data.likecount - 1})
          }
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
  },
  starTweet: function(e) {
    var self = this
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    var i = this.data.tweetIndex
    var t = prevPage.data.tweetsList
    if (prevPage.data.isStar) {
      t.splice(i, 1)
      prevPage.setData({
        tweetsList: t
      })
    }
    wx.request({
      url: config.domain + '/tweet/star',
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
        if (res.data.code == 0) { 
          if (self.data.hasStarred == false) {
            self.setData({hasStarred: true, collectcount: self.data.collectcount + 1})
          } else {
            self.setData({hasStarred: false, collectcount: self.data.collectcount - 1})
          }
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
  },
  async getdata() {
    self = this
    try {
      const sp = await getContent(this.data.tweetid);
      wx.getImageInfo({
        src:'https://anith2.2022martu1.cn' + sp.maxHeightImage,
        success:function(res) {
          var winWid = wx.getSystemInfoSync().windowWidth;
          var imgh=res.height;
          var imgw = res.width;
          var swiperH = winWid * imgh / imgw + "px";
          self.setData({
            swiperHeight: swiperH		//设置swiper高度
          })
        }
      })
      this.setData({
        imgUrls: sp.images == null ? [] : sp.images, 
        imgUrl: sp.avatar == null ? [] : 'https://anith2.2022martu1.cn' + sp.avatar,
        qtitle: sp.title,
        qcontent: sp.content,
        time: sp.time == null ? '发布时间未知' : sp.time,
        username: sp.username,
        commentnum: sp.comments,
        solveState: sp.solved,
        helpid: sp.userId,
        likecount: sp.likes,
        collectcount: sp.stars,
        hasLiked: sp.hasLiked,
        hasStarred: sp.hasStarred,
        show: true
      })
    } catch (err) {
    }
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
        if (res.data.code == 0 && res.data.body.comments != null) {
          for (let i = 0; i < res.data.body.comments.length; i++) {
            if (res.data.body.comments[i].isAdmin == false) {
              self.setData({ officialReplyList: res.data.body.comments.splice(0,i) })
              self.setData({replylist: res.data.body.comments})
              break;
            } else if (i == res.data.body.comments.length - 1) {
              self.setData({officialReplyList:res.data.body.comments})
            }
          }
        } else if(res.data.code != 0) {
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
      }
    })
  },
})