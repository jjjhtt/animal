export function getCategoryList(category, match = '') {
  return new Promise((resolve) => {
    wx.request({
      url: 'https://www.fastmock.site/mock/0e2693d40ac080d7e0bcd1f4533b4046/animal/category/get',
      method: 'POST',
      data: {
        "userId": wx.getStorageSync('userId'),
        "category": category,
        "match": match
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': wx.getStorageSync('token')
      },
      success(res) {
        if (res.data.code === 0) {
          resolve(res.data.body.categories);
        } else {
          Toast({
            context: this,
            selector: '#t-toast',
            message: res.message,
            theme: 'error',
          });
        }
      }
    })
  });
}
