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
    this.init();
  },

  onLoad() {
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
    /*wx.setStorageSync('userId', 3);
    wx.setStorageSync('token', 'Animal-eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwic3ViIjoidXNlciIsImlhdCI6MTY4MjQzMjc3MSwiaXNzIjoiYW5pbWFsbWFuYWdlbWVudCIsImF1dGhvcml0aWVzIjoiW3tcImF1dGhvcml0eVwiOlwiUk9MRV9VU0VSXCJ9XSIsImV4cCI6MTY4MjUxOTE3MX0.WrCRC6qh1xxFLRq9ISN9iB3U2Ud7h7GuSrOR2HnMqTyiW6ObpaURxzZNICzNkixI5lSXDUSLw-D3s4hXN95e4Q');*/
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
      pageIndex = 0;
    }

    try {
      const nextList = await fetchTweetsList(pageIndex, this.data.nowkey, this.data.match);
      console.log(nextList);
      if (nextList === null) {
        this.setData({ tweetsListLoadStatus: 2 });
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
  },
});
