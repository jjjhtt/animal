import { fetchTweetsList } from '../../../../services/usercenter/fetchMyTweets';
import Toast from 'tdesign-miniprogram/toast/index';

Page({
  data: {
    tweetsList: [],
    tweetsListLoadStatus: 0,
    pageLoading: false,
    match: '',
    value: '',
    notice: '',
    clientHeight: '',
    triggered: false,
    confirmBtn: { content: '确定', variant: 'base' },
    showConfirm: false
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
      clientHeight: x * 750 / y -16-64,
      notice: '请输入关键词搜索'
    })
  },

  delete() {
    const childComponent = this.selectComponent('#tweets');
    childComponent.delete();
  },

  closeDialog() {
    this.setData({showConfirm: false });
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
      nowkey: e.detail.value
    });
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
      const nextList = await fetchTweetsList(pageIndex, this.data.match);
      if (nextList === null) {
        if (fresh) {
          this.setData({
            tweetsList: []
          })
          this.setData({
            notice: '暂无相关帖子'
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
      //console.log(this.data.tweetsList);
    } catch (err) {
      //console.log(err);
      this.setData({ tweetsListLoadStatus: 3 });
    }
  },
});
