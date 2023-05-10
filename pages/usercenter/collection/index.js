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
    this.setData({
      tweetsList: [],
    })
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
