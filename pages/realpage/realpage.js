import Toast from 'tdesign-miniprogram/toast/index';
import {config} from '../../config/index'
Page({
  data: {
      imgUrls: '',
      tweetid: 1,
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
  },
  commentListPagination: {
    index: 0,
    num: 8,
  },
  onLoad: function() {
    wx.showNavigationBarLoading()
    this.getdata()
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
      this.setData({inputBottom:e.detail.height, inputnow:true})
  },
  inputBindBlur() {
      this.setData({inputBottom:0, inputnow:false})
  },
  sendtext: function() {
    console.log(wx.getStorageSync('userId'))
    wx.request({
      url: config.domain + '/tweet/addComment',
      method: 'POST',
      data: {
        "userId":wx.getStorageSync('userId'),
        "tweetId": 1,
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
  monitorlike: function(e) {
    self = this
    let i = e.currentTarget.dataset.id
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
        console.log(res)
        if (res.data.code == 0) {
          let like = self.data.commentlist[i].likes
          let changelike = self.data.commentlist[i].likes
          self.setData({[changelike]:like})
        }
      }
    })
    
      /*console.log(e.currentTarget.dataset.id)
      let like = this.data.commentlist[e.currentTarget.dataset.id].likes + 1
      let changelike = this.data.commentlist[e.currentTarget.dataset.id].likes
      this.setData({[changelike]:like})
      console.log('点赞')*/
  },
  getdata: function() {
    self = this
    console.log('加载')
    wx.request({
      url: config.domain + '/tweet/content',
      method: 'POST',
      data: {
        "userId": wx.getStorageSync('userId'),
        "tweetId": 1,
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': wx.getStorageSync('token')
      },
      success(res) {
        //console.log(res)
        if (res.data.code == 0) {
          let sp = res.data.body
          self.setData({
            imgUrls: ['../../images/ani1.jpg', '../../images/ani2.jpg', '../../images/ani3.jpg'], 
            content_title: sp.title,
            contenttext: sp.content,
            tags: ['松鼠','大松鼠','高清松鼠'],
            data: sp.time==null ? '未知' : sp.time,
            commentnum: sp.comments,
            likecount: sp.likes,
            collectcount: sp.stars
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
        "tweetId": 1,//this.data.tweetid
        "commentPage": self.commentListPagination.index
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': wx.getStorageSync('token')
      },
      success(res) {
        console.log(res)
        if (res.data.code == 0) {
          self.setData({commentlist: res.data.body.comments})
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
      pageIndex = 1
    }
    try {
      let nextList = [{name:'小飞棍', id:1, content: '爱信等', time:'今天20:00', likes:999, },]
      wx.request({
        url: config.domain + '/tweet/getComments',
        method: 'POST',
        data: {
          "userId": wx.getStorageSync('userId'),
          "tweetId": 1,//this.data.tweetid
          "commentPage":0
        },
        header: {
          'content-type': 'application/json', // 默认值
          'authorization': wx.getStorageSync('token')
        },
        success(res) {
          //console.log(res)
          if (res.data.code == 0) {
  
          } else {
            Toast({ context: this, selector: '#t-toast', message: res.data.message, theme: 'error',
            });
          }
        }
      })
      this.setData({
        commentlist: this.data.commentlist.concat(nextList),
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