import { getCategoryList } from '../../services/tweet/fetchCategoryList';
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
  },
  async init() {
    try {
      const result = await getCategoryList(this.data.nowkey, this.data.match);
      this.setData({
        list: result,
      });
    } catch (error) {
      console.error('err:', error);
    }
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
    
  },
  onChange() {
    wx.navigateTo({
      url: '/pages/goods/list/index',
    });
  },
  onLoad() {
    this.init();
  },
});
