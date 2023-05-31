import Toast from 'tdesign-miniprogram/toast/index';
import { fetchComments } from '../../services/tweet/fetchComments';
import {config} from '../../config/index'
Page({
  data: {
      defaultData: {
        img: '', // 头像
        name: '' // 名字
      },
      imgUrls: '',
      tweetid: 0,
      uid: 0,
      tuid: 0,
      autoplay: true,//自动切换
      indicatorDots: false,//图片指示点
      interval: 4500,//切换间隔
      duration: 1000,//滑动时长
      current: 0,
      content_title: '',
      contenttext: '',
      tags: '',
      data: '',
      commentnum: 0,
      commentlist: [],
      commentwidth: 50,
      inputnow: false,
      inputBottom: 0,
      inputText: '',
      likecount: 0,
      collectcount: 0,
      commentlistLoadStatus: 0,
      hasLiked: false,
      hasStarred: false,
      swiperHeight: 0, //轮播图高度,
      domain: config.domain,
      autoWidth: 200, //底部对话框宽度
      tweetIndex: -1
  },
  commentListPagination: {
    index: 0,
    num: 8,
  },
  onLoad: function(options) {
    wx.showNavigationBarLoading()
    this.setData({
      tweetid: options.tweetId,
      tweetIndex: options.index,
      uid: wx.getStorageSync('userId')
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
  onReachBottom() {
    if (this.data.commentlistLoadStatus == 0) {
      this.loadcommentlist();
    }
  },
  onReTry() {
    this.loadcommentlist();
  },
  monitorCurrent: function(e) {
      let current = e.detail.current;
      this.setData({current: current})
  },
  onInputValueChange(e) {
      this.setData({inputText:e.detail.value})
  },
  enterInput() {
    console(this.data.inputText)
  },
  inputBindFocus(e) {
      this.setData({inputBottom:e.detail.height, inputnow:true, autoWidth:280})
  },
  deleteComment(e) {
    let i = e.currentTarget.dataset.id
    wx.request({
      url: config.domain + '/comment/delete',
      method: 'POST',
      data: {
        "userId":wx.getStorageSync('userId'),
        "commentId":this.data.commentlist[i].id,
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': wx.getStorageSync('token')
      },
      success(res) {
        if (res.data.code == 0) {
          self.data.commentlist.splice(i, 1)
          self.setData({
            commentlist: self.data.commentlist
          })
          Toast({
            context: this,
            selector: '#t-toast',
            message: '删除成功',
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
  },
  inputBindBlur() {
      this.setData({inputBottom:0, inputnow:false, autoWidth:200})
  },
  sendtext: function() {
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
  monitorlike: function(e) {
    var self = this
    let i = e.currentTarget.dataset.id
    const changelike = `commentlist[${i}].likeNum`
    const changeislike = "commentlist[" + i + "].isLike"
    wx.request({
      url: config.domain + '/comment/like',
      method: 'POST',
      data: {
        "userId": wx.getStorageSync('userId'),
	      "commentId": this.data.commentlist[i].id
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': wx.getStorageSync('token')
      },
      success(res) {
        if (res.data.code == 0) {
          if (res.data.body.isLike == true) {
            let like = self.data.commentlist[i].likeNum + 1
            self.setData({[changelike]:like, [changeislike]: res.data.body.isLike})
          } else {
            let like = self.data.commentlist[i].likeNum - 1
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
  likeTweet: function(e) {
    var self = this
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    var i = this.data.tweetIndex
    var t = prevPage.data.tweetsList[i]
    if (this.data.hasLiked) {
      prevPage.setData({
        [`tweetsList[${i}].isLike`]: false,
        [`tweetsList[${i}].likes`]: t.likes - 1
      })
    } else {
      prevPage.setData({
        [`tweetsList[${i}].isLike`]: true,
        [`tweetsList[${i}].likes`]: t.likes + 1
      })
    }
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
        if (res.data.code == 0) {
          let sp = res.data.body
          self.setData({
            tuid:sp.userId,
            imgUrls: sp.images == null ? [] : sp.images,
            content_title: sp.title,
            contenttext: sp.content,
            tags: sp.tags == null ? [] : sp.tags,
            data: sp.time==null ? '未知' : sp.time,
            commentnum: sp.comments,
            likecount: sp.likes,
            collectcount: sp.stars,
            hasLiked: sp.hasLiked,
            hasStarred: sp.hasStarred,
            defaultData: {img:sp.avatar, name:sp.username}
          })
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
    wx.request({
      url: config.domain + '/tweet/getComments',
      method: 'POST',
      data: {
        "userId": wx.getStorageSync('userId'),
        "tweetId": this.data.tweetid,
        "commentPage": self.commentListPagination.index
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': wx.getStorageSync('token')
      },
      success(res) {
        if (res.data.code == 0) {
          self.setData({
            commentlist: res.data.body.comments == null ? [] : res.data.body.comments
          })
        } else {
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
    setTimeout(() => {
      wx.hideNavigationBarLoading()
    }, 2000);
  },
  async loadcommentlist(fresh = false) {
    if (fresh) {
      wx.pageScrollTo({
        scrollTop:0,
      })
    }
    this.setData({ commentlistLoadStatus: 1 })
    let pageIndex = this.commentListPagination.index + 1;
    if (fresh) {
      this.commentListPagination.index = 0;
      pageIndex = 0
    }
    try {
      const nextList = await fetchComments(pageIndex, this.data.tweetid);
      if (nextList == null) {
        this.setData({ commentlistLoadStatus: 2 });
        return 0;
      }
      this.setData({
        commentlist: fresh ? nextList : this.data.commentlist.concat(nextList),
        commentlistLoadStatus: 0,
      });
      this.commentListPagination.index = pageIndex;
      if (JSON.stringify(nextList) == '{}') {
        this.setData({ commentlistLoadStatus: 2 });
      }
    } catch (err) {
      console.log(err);
      this.setData({ commentlistLoadStatus: 3 });
    }
  },
})