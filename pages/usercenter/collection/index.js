import { fetchTweetsList } from '../../../services/usercenter/fetchStarTweets';

Page({
  data: {
    tabList: [{
      text: '普通帖',
      key: 0,
    },
    {
      text: '求助帖',
      key: 1,
    }],
    tweetsList: [],
    tweetsListLoadStatus: 0,
    pageLoading: false,
    nowkey: 0,
    match: '',
    clientHeight: '',
    triggered: false,
    top: 0,
    isStar: true
  },

  tweetListPagination: {
    index: 0,
    num: 8,
  },

  onShow() {
    
  },

  onLoad() {
    const app = getApp()
    let x = app.globalData.windowHeight
    let y = app.globalData.windowWidth;
    this.setData({
      clientHeight: x * 750 / y -150-16,
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
    this.loadHomePage();
  },

  loadHomePage() {
    wx.stopPullDownRefresh();

    this.setData({
      pageLoading: false,
    });
    this.loadtweetsList(true);

  },

  tabChangeHandle(e) {
    this.setData({
      tweetsList: [],
      nowkey: e.detail.value,
      top: 0? 0.01:0
    })
    this.loadtweetsList(true);
  },

  submitHandle(e) {
    var v = e.detail.value.trim()
    if (v == '') {
      Toast({
        context: this,
        selector: '#t-toast',
        message: "请输入关键词",
      });
      return
    } else if(v === '#') {
      Toast({
        context: this,
        selector: '#t-toast',
        message: "请输入有效标签",
      });
      return
    }
    this.setData({
      match: e.detail.value
    });
    this.loadtweetsList(true);
  },

  onReTry() {
    this.loadtweetsList();
  },

  click() {
    wx.navigateTo({
      url: './result/index',
    })
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
      const nextList = await fetchTweetsList(pageIndex, this.data.nowkey, this.data.match);
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
      console.log(nextList);
      this.setData({
        tweetsList: fresh ? nextList : this.data.tweetsList.concat(nextList),
        tweetsListLoadStatus: 0,
      });
      this.tweetListPagination.index = pageIndex;
    } catch (err) {
      //console.log(err);
      this.setData({ tweetsListLoadStatus: 3 });
    }
  },
});
