import { fetchTweetsList } from '../../services/help/fetchTweets';

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

  onLoad() {
    const app = getApp()
    let x = app.globalData.windowHeight
    let y = app.globalData.windowWidth;
    this.setData({
      clientHeight: x * 750 / y - 96 -150-16
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

  onClick() {
    wx.navigateTo({
      url: './search/index',
    })
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
