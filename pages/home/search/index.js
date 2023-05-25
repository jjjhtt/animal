import Toast from 'tdesign-miniprogram/toast/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    match: '',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
        list: l
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
    if (e.detail.value == '') {
      Toast({
        context: this,
        selector: '#t-toast',
        message: "请输入关键词",
      });
      return
    }
    this.setData({
      match: e.detail.value
    });
    var l = this.data.list
    console.log(l)
    if (l.indexOf(this.data.match) != -1) {
      l.splice(l.indexOf(this.data.match), 1)
    }
    l.unshift(this.data.match)
    if (l.length == 21) {
      l.splice(20, 1)
    }
    wx.setStorageSync('tweet_history', l)
    wx.navigateTo({
      url: `/pages/home/result/index?match=${this.data.match}`,
    })
  },

  handleClose(e) {
    var index = e.currentTarget.dataset.index
    var l = this.data.list
    l.splice(index, 1)
    this.setData({list: l})
    wx.setStorageSync('tweet_history', this.data.list)
  }
})