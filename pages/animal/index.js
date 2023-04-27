import { getCategoryList } from '../../services/document/fetchCategoryList';
Page({
  data: {
    /*tabList: [{
      text: '猫',
      key: 0,
    },
    {
      text: '狗',
      key: 1,
    },
    {
      text: '鸟',
      key: 2,
    }],*/
    list: [],
    nowkey: 0,
    match: '',
    tweetsListLoadStatus: 0
  },

  tweetListPagination: {
    index: 0,
  },

  submitHandle(e) {
    this.setData({
      match: e.detail.value
    });
    this.init();
  },

  /*tabChangeHandle(e) {
    this.setData({
      nowkey: e.detail.value
    });
    this.init();
  },*/

  onShow() {
    this.init(true);
  },
  onChange() {
    
  },
  onLoad() {
    //this.init();
  },

  onReTry() {
    this.init();
  },

  onReachBottom() {
    if (this.data.tweetsListLoadStatus === 0) {
      this.init();
    }
  },

  onPullDownRefresh() {
    this.init();
  },

  async init(fresh = false) {
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
      const result = await getCategoryList(pageIndex, this.data.match);
      if (result === null) {
        this.setData({ tweetsListLoadStatus: 2 });
        return;
      }
      this.setData({
        list: fresh ? result : this.data.list.concat(result),
        tweetsListLoadStatus: 0,
      });
      this.tweetListPagination.index = pageIndex;
    } catch (error) {
      this.setData({ tweetsListLoadStatus: 3 });
    }
  },
});
