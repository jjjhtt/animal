import { fetchTweetsList } from '../../../services/help/fetchTweets';
import Toast from 'tdesign-miniprogram/toast/index';

Page({
  data: {
    tabList: [{
      text: '热度排序',
      key: '热度',
    },
    {
      text: '时间排序',
      key: '时间',
    }],
    tweetsList: [],
    tweetsListLoadStatus: 0,
    pageLoading: false,
    nowkey: '热度',
    match: '',
    value: '',
    clientHeight: '',
    triggered: false,
    top: 0
  },

  tweetListPagination: {
    index: 0,
    num: 8,
  },

  onShow() {
    
  },

  onUnload() {
    wx.navigateBack({
      delta: 2,
    })
  },

  onLoad(options) {
    let x = wx.getSystemInfoSync().windowHeight;
    let y = wx.getSystemInfoSync().windowWidth;
    this.setData({
      clientHeight: x * 750 / y -150-16
    })
    this.setData({
      match: options.match,
      value: options.match
    })
    this.init();
  },

  onReachBottom() {
    if (this.data.tweetsListLoadStatus === 0) {
      this.loadtweetsList();
    }
  },

  onPullDownRefresh() {
    this.init();
    this.setData({
      triggered: false
    })
  },

  init() {
    this.loadHelpPage();
  },

  loadHelpPage() {
    wx.stopPullDownRefresh();

    this.setData({
      pageLoading: false,
    });
    this.loadtweetsList(true);
  },

  tabChangeHandle(e) {
    this.setData({
      nowkey: e.detail.value,
      top: 0? 0.01:0
    });
    this.loadtweetsList(true);
  },

  submitHandle(e) {
    if (e.detail.value.trim() == '') {
      Toast({
        context: this,
        selector: '#t-toast',
        message: "请输入关键词",
      });
      return
    }
    this.setData({
      match: e.detail.value
    });
    var l = wx.getStorageSync('help_history')
    if (l.indexOf(this.data.match) != -1) {
      l.splice(l.indexOf(this.data.match), 1)
    }
    l.unshift(this.data.match)
    if (l.length == 11) {
      l.splice(10, 1)
    }
    wx.setStorageSync('help_history', l)
    this.loadtweetsList(true);
  },

  onReTry() {
    this.loadtweetsList();
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
      pageIndex = 0;
    }

    try {
      //console.log(pageIndex);
      const nextList = await fetchTweetsList(pageIndex, this.data.match, this.data.nowkey);
      if (nextList === null) {
        if (fresh) {
          this.setData({
            tweetsList: []
          })
        }
        this.setData({ tweetsListLoadStatus: 2 });
        return;
      }
      if (nextList.length < 10) {
        this.setData({ 
          tweetsListLoadStatus: 2,
          tweetsList: fresh ? nextList : this.data.tweetsList.concat(nextList),
        });
        return;
      }
      //console.log(nextList);
      this.setData({
        tweetsList: fresh ? nextList : this.data.tweetsList.concat(nextList),
        tweetsListLoadStatus: 0,
      });

      this.tweetListPagination.index = pageIndex;
      //console.log(this.data.tweetsList);
    } catch (err) {
      console.log(err);
      this.setData({ tweetsListLoadStatus: 3 });
    }
  },
});
