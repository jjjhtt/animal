import Toast from 'tdesign-miniprogram/toast/index';
import {config} from '../../config/index'
Page({
  data: {
      imgUrls: '',
      autoplay: true,//自动切换
      indicatorDots: false,//图片指示点
      interval: 5000,//切换间隔
      duration: 1000,//滑动时长
      current: 0,
      content_title: '',
      contenttext: '',
  },
  handleAdopt() {

  },
  goTrack() {
    wx.redirectTo({ url: './realanimal', })
  },
  onLoad: function() {
    wx.showNavigationBarLoading()
    this.getdata()
  },
  monitorCurrent: function(e) {
      let current = e.detail.current;
      this.setData({current: current})
  },
  getdata: function() {
    wx.request({
      url: config.domain + '/comment/delete',
      method: 'POST',
      data: {
        "userId":wx.getStorageSync('userId'),
        "commentId":this.data.commentlist[i].id,
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': wx.getStorageSync('token')
      },
      success(res) {
        if (res.data.code == 0) {
          self.data.commentlist.splice(i, 1)
          self.setData({
            commentlist: this.data.commentlist
          })
          Toast({
            context: this,
            selector: '#t-toast',
            message: '删除成功',
            theme: 'success',
            direction: 'column',
          });
        } else {
          Toast({context: this,selector: '#t-toast',message: res.data.message,theme: 'error',});
        }
      }
    })
    this.setData({ imgUrls: ['../../images/ani1.jpg', '../../images/ani2.jpg', '../../images/ani3.jpg'], 
    content_title: '这是一个标题', 
    contenttext: '这里估计是正文\n试一试换行\n试一试行距。\n然而，我们的工作并不是简单地将所提供的算法移植到硬件上，而是更进一步，提出了一种新颖的近似自注意方案以及专门的硬件架构。基于计算近似相似度可以有效过滤不相关关系的直觉，ELSA极大地减少了自注意操作中的计算浪费。与gpu等传统硬件不同，我们的专用硬件直接将这种降低转化为进一步提高性能和能源效率。\n这种自我关注成本的降低使我们能够将自我关注应用于更大的数据，这可以揭示当今模型无法有效处理的数据中的遥远关系。',})
    setTimeout(() => {
      wx.hideNavigationBarLoading()
    }, 2000);
  }
})