// pages/usercenter/message/message.js
import {config} from '../../../config/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    labaSrc: "../../../images/laba2.png",
    msgList: [
      {
        id: 2,
        content: '您于2023-05-02发布的帖子“测试”未通过审核，点击查看详情',
        info: '您于2023-05-02发布的帖子“测试”未通过审核，点击查看详情',
        read: false,
        time: '2023-05-02',
        index: 0,
      },
      {
        id: 2,
        content: '您于2023-05-01发布的帖子“hhh”已通过审核，现在可以在主页上查看了',
        info: '您于2023-05-01发布的帖子“hhh”已通过审核，现在可以在主页上查看了',
        read: true,
        time: '2023-05-01',
        index: 1,
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.request({
      url: config.domain + '/user/message/get',
      method: 'POST',
      data: {
        "userId": wx.getStorageSync('userId'),
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': wx.getStorageSync('token')
      },
      success: (res)=> {
        if (res.data.code === 0) {
          console.log(res);
          if(res.data.body != null && res.data.body.length > 0) {
            for(var i = 0; i < res.data.body.messages.length; i++) {
              var item = res.data.body.messages[i]
              var info = item.content.length <= 12 ? 
                item.content :  item.content.substring(0,11)
              item['info'] = info
              this.data.msgList.push(item)
            }
          }
        } else {
          console.log(res);
          Toast({
            context: this,
            selector: '#t-toast',
            message: res.message,
            theme: 'error',
          });
        }
      },
      fail: (res)=> {
        console.log(res)
      }
    })
  },
  onClickMessage({currentTarget}) {
    var {index} = currentTarget.dataset
    console.log(currentTarget)
    var content = this.data.msgList[index].content
    var time = this.data.msgList[index].time
    wx.navigateTo({
      url: '/pages/usercenter/messages/message/message?content='
      + content + '&time=' + time,
    })
  }

})