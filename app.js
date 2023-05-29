// app.js
App({
  onLaunch: function(options) {
    const that = this;
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    // 胶囊按钮位置信息
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    // 导航栏高度 = 状态栏高度 + 44
    that.globalData.navBarHeight = systemInfo.statusBarHeight + 44 + 20;
    that.globalData.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
    that.globalData.menuTop= menuButtonInfo.top;
    that.globalData.menuHeight = menuButtonInfo.height;
    that.globalData.windowHeight = systemInfo.windowHeight
    that.globalData.windowWidth = systemInfo.windowWidth
},
globalData: {
    navBarHeight: 0, // 导航栏高度
    menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
    menuTop: 0, // 胶囊距顶部间距
    menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
    windowHeight:null,
    windowWidth: null
}
})
