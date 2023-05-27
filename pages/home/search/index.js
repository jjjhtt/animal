import Toast from 'tdesign-miniprogram/toast/index';
import { fetchPopular } from '../../../services/tweet/fetchPopular';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    match: '',
    popularList: [],
    historyList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.init();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    var l = wx.getStorageSync('tweet_history')
    if (l.length > 0) {
      this.setData({
        historyList: l
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  onClickTag(e) {
    const {tag} = e.currentTarget.dataset;
    this.setData({
      match: tag
    });
    wx.navigateTo({
      url: `/pages/home/result/index?match=${this.data.match}`,
    })
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
    var l = this.data.historyList
    console.log(l)
    if (l.indexOf(this.data.match) != -1) {
      l.splice(l.indexOf(this.data.match), 1)
    }
    l.unshift(this.data.match)
    if (l.length == 11) {
      l.splice(10, 1)
    }
    wx.setStorageSync('tweet_history', l)
    wx.navigateTo({
      url: `/pages/home/result/index?match=${this.data.match}`,
    })
  },

  handleClose(e) {
    var index = e.currentTarget.dataset.index
    var l = this.data.historyList
    l.splice(index, 1)
    this.setData({historyList: l})
    wx.setStorageSync('tweet_history', this.data.historyList)
  },

  async init() {
    try {
      const result = await fetchPopular();
      this.setData({
        popularList: result
      });
    } catch (error) {
      console.log("搜索记录出错")
    }
  },
})