import {config} from "../../../config/index"
const ctr = require('./controller.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    theme: {
      color: '#1890FF',
      tabColor: '#333' || '#20ACAB',
    },
    navH: 0,
    title: "",
    content: "",
    images: [],
    showAdd: false,
    albumName: '',
    checked: false,
    state: "",
    show: false,
    showID: "",
    inputValue: "",
    label: [],
    obtnArry: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    ctr.setup(this);
    this.setData({
      navH: app.globalData.navHeight
    });
  },
  onUnload: function () {
    ctr.onUnload()
  },

  bindTitle: function(e) {
    this.setData({title: e.detail.value})
  },
  bindContent: function(e) {
    this.setData({content: e.detail.value})
  },
  writerPublish: function() {
    wx.request({
      url: config.domain + '',
      data: {
        "userId": wx.getStorageSync('userId'),
        "title": this.data.title,
        "content": this.data.content,
        "image": this.data.images,
        "label": this.data.obtnArry
      },
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': wx.getStorageSync('token')
      },
      success(res) {
        console.log(res);
        if (res.data.code === 0) {
          
        } else {
          Toast({
            context: this,
            message: res.data.message,
            theme: 'error',
          });
        }
      },
    });
  },
  chooseImage: ctr.onChooseImage,
  clickImage: ctr.onClickImage,
  clickDelete: ctr.onDeleteImage,
  clickDeleteLabel: ctr.onDeleteLabel,

//同步输入框内容
  bindKeyInput(e) {
      this.setData({
        albumName: e.detail.value
      })
  },

  addinput(e){
    this.setData({ 
      show: true,
    });
  },
 
//实时获取输入框的值
  bindValue(e){
    this.setData({
      inputValue: e.detail.value
    })
  },
//确定按钮，添加数组达到添加标签的作用
  onInputValue(){
    this.setData({ 
      show: false ,
      inputValue: this.data.inputValue
    });
    var obtnArry = this.data.obtnArry;
    var newData = { num: obtnArry.length, name: this.data.inputValue, selected: false };
    obtnArry.push(newData);//实质是添加lists数组内容，使for循环多一次
    this.setData({
      obtnArry,
    })
    console.log(this.data.inputValue)
  },
//取消按钮
  onCancel(){
    this.setData({ show: false });
  }
})