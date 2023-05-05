// pages/write/classify/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    name: '',
    id: '',
    type: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { t } = options;
    this.setData({
        type: t,
    });
    console.log(this.data.type);
    if (this.data.type === 1) {
      return;
    }
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一页
    var info = prevPage.data.path
    var n = prevPage.data.name
    var aniId = prevPage.data.id
    //console.log(info)
    this.setData({
      url: info,
      name: n,
      id: aniId
    })
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
    setTimeout(()=>{
    if (this.data.type == 1) {
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 3]; //上一页
      prevPage.setData({
        animalName: this.data.name,
        animalID: this.data.id,
      })
      wx.navigateBack({
        delta: 2,
      })
    }}, 1500);
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  onClick() {
    if (this.data.id === null) {
      return;
    }
    wx.navigateTo({
      url: `/pages/realanimal/realanimal?id=${this.data.id}`,
    });
  }
})