import { fetchTweetsList } from '../../services/tweet/fetchTweets';

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
  },

  tweetListPagination: {
    index: 0,
    num: 8,
  },

  onShow() {
    
  },

  onLoad() {
    this.init();
  },

  onReachBottom() {
    if (this.data.tweetsListLoadStatus === 0) {
      this.loadtweetsList();
    }
  },

  onPullDownRefresh() {
    this.init();
  },

  init() {
    wx.setStorageSync('userId', 3);
    wx.setStorageSync('token', 'Animal-eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwic3ViIjoidXNlciIsImlhdCI6MTY4MjI0OTU3MywiaXNzIjoiYW5pbWFsbWFuYWdlbWVudCIsImF1dGhvcml0aWVzIjoiW3tcImF1dGhvcml0eVwiOlwiUk9MRV9VU0VSXCJ9XSIsImV4cCI6MTY4MjMzNTk3M30.GR7Wodsm2IEKN4KOZIL91Fb0w4ZtiMBWkhUGg1dFDg5r_KDJFcXtMwDq8Cuuf4n-kDg-zyqUsA9XYZsngklmpw');
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
      nowkey: e.detail.value
    });
    this.loadtweetsList(true);
  },

  submitHandle(e) {
    this.setData({
      match: e.detail.value
    });
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
      this.tweetListPagination.index = 0;
      pageIndex = 1;
    }

    try {
      const nextList = await fetchTweetsList(pageIndex, this.data.nowkey, this.data.match);
      //console.log(nextList);
      this.setData({
        tweetsList: fresh ? nextList : this.data.tweetsList.concat(nextList),
        tweetsListLoadStatus: 0,
      });

      this.tweetListPagination.index = pageIndex;
      if (JSON.stringify(nextList) == '{}') {
        this.setData({ tweetsListLoadStatus: 2 });
      }
      //console.log(this.data.tweetsList);
    } catch (err) {
      //console.log(err);
      this.setData({ tweetsListLoadStatus: 3 });
    }
  },
});
