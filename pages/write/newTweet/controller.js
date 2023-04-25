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
  wx.chooseMedia({
    count: left,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: function (res) {
      if (res.tempFiles[0].tempFilePath.length > 0) {
        addNewImage(res.tempFiles[0].tempFilePath)
      }
    },
  })
}

function addNewImage(images) {
  var array = view.data.images
  array = array.concat(images)
  view.setData({ images: array })
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