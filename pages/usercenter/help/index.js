import { fetchTweetsList } from '../../../services/usercenter/fetchMyHelp';

Page({
  data: {
    tweetsList: [],
    tweetsListLoadStatus: 0,
    pageLoading: false,
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
    this.loadHelpPage();
  },

  loadHelpPage() {
    wx.stopPullDownRefresh();

    this.setData({
      pageLoading: false,
    });
    this.loadtweetsList(true);
  },

  submitHandle(e) {
    this.setData({
      match: e.detail.value
    });
    this.loadtweetsList(true);
  },

  click() {
    wx.navigateTo({
      url: './result/index',
    })
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
      const nextList = await fetchTweetsList(pageIndex, this.data.match);
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
      if (nextList.length < 10) {
        this.setData({ 
          tweetsListLoadStatus: 2,
          tweetsList: fresh ? nextList : this.data.tweetsList.concat(nextList),
        });
        return;
      }
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
