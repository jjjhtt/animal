export function fetchTweetsList(pageIndex = 1, key = 0, match = '') {
  /*if (true) {
    return mockFetchtweetsList(pageIndex, pageSize);
  }*/
  return new Promise((resolve) => {
    wx.request({
      url: 'https://www.fastmock.site/mock/0e2693d40ac080d7e0bcd1f4533b4046/animal/help/get',
      method: 'POST',
      data: {
        "userId": wx.getStorageSync('userId'),
        "page": pageIndex,
        "type": key,
        "match": match
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': wx.getStorageSync('token')
      },
      success(res) {
        if (res.data.code === 0) {
          resolve(res.data.body.tweets);
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
