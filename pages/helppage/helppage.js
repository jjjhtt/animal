// pages/helppage/helppage.js
import Toast from 'tdesign-miniprogram/toast/index';
Page({
  data: {
    username:'不知道',
    helpId: 0,
    data:'2023年5月1日',
    sloveState: true,
    qcontent: '呃呃\n\n\n\n呃呃',
    bestAns: false,
    bestname: '不知道',
    bestdata: '2023年5月7日',
    besttext: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaadeaaaaaaaaaadesssaaaaaaaaaaaaaaa\naaaaaassssss',
    replys: 999,
    replylist: [{name:'1号机', id:1, content: '爱信等', time:'今天20:00', likes:20, },
    {name:'2号机', id:2, content: '软硬件协同设计', time:'今天20:22', likes:0, },
    {name:'3号机', id:3, content: '@——————', time:'今天21:31', likes:2, },
    {name:'4号机', id:4, content: '雪国', time:'今天21:54', likes:14, },
    {name:'5号机', id:5, content: '伊豆的舞女', time:'今天23:00', likes:124, }],
    inputnow: false,
    inputBottom: 0,
    inputText: '',
    replylistLoadStatus: 0,
  },
  replyListPagination: {
    index: 0,
    num: 8,
  },
  onLoad(options) {
    this.setData({
      bestAns: true,
      //helpId: options.id
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
          "userId": wx.getStorageSync('userid'),
          "id": this.data.helpId,
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
        replylist: this.data.replylist.concat(nextList),
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
  }
})