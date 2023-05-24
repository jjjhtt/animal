import {config} from '.././../../config/index'
import Toast from 'tdesign-miniprogram/toast/index';

var view = undefined
function setup(v) {
  view = v
}

function onUnload() {
  view = undefined
}

// images
function onChooseImage(e) {
  var left = 9 - view.data.images.length
  /*wx.chooseMedia({
    count: left,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: function (res) {
      if (res.tempFiles[0].tempFilePath.length > 0) {
        addNewImage(res.tempFiles[0].tempFilePath)
      }
    },
  })*/

  const tempFilePath = new Promise((resolve, reject) => {
    wx.chooseMedia({
      count: left,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log(res);
        const path = res.tempFiles[0].tempFilePath;
        wx.uploadFile({
          url: config.domain + '/image/upload', 
          filePath: path,
          name: "image",
          formData: {
            "type": "tweet"
          },
          header: {
            'content-type': 'multipart/form-data',
            'authorization': wx.getStorageSync('token')
          },
          success (res){
            //console.log(res.data);
            let p = JSON.parse(res.data);
            //console.log(p.body.imagePath);
            if (p.code == 1) {
              Toast({
                message: "图片大小超过1MB",
              });
            } else {
              if (path.length > 0) {
                addNewImage(path)
              }
              addNewImageUrl(p.body.imagePath);
            }
            resolve(res)
          },
          fail: (err) => reject(err),
        })
      },
      fail: (err) => reject(err),
    });
  });
}

function addNewImage(images) {
  var array = view.data.images
  array = array.concat(images)
  view.setData({ images: array })
}

function addNewImageUrl(imageUrl) {
  var array = view.data.imageUrls
  array = array.concat(imageUrl)
  view.setData({ imageUrls: array })
}

function onClickImage(e) {
  var index = e.currentTarget.dataset.idx
  var images = view.data.images
  wx.previewImage({
    urls: images,
    current: images[index],
  })
}

function onDeleteImage(e) {
  var index = e.currentTarget.dataset.idx
  var images = view.data.images
  images.splice(index, 1)
  view.setData({images: images})

  var urls = view.data.imageUrls
  urls.splice(index, 1)
  view.setData({imageUrls: urls})
}

function onDeleteLabel(e) {
  var index = e.currentTarget.dataset.idx
  var labels = view.data.obtnArry
  labels.splice(index, 1)
  view.setData({obtnArry: labels})
}

module.exports = {
  setup: setup,
  onUnload: onUnload,
  
  // image
  onChooseImage: onChooseImage,
  onClickImage: onClickImage,
  onDeleteImage: onDeleteImage,

  onDeleteLabel: onDeleteLabel,

}