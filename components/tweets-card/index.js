Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    data: {
      type: Object,
      observer(data) {
        if (!data) {
          return;
        }
        this.setData({tweets: data});
        let image = this.data.tweets.images.split(';')[0]
        //console.log(image);
        this.setData({'tweets.image': image})
        //console.log(this.data.tweets);
      },
    },
    index: -1
  },

  data: {
    tweets: {},
    domain: "https://anith2.2022martu1.cn",
  },

  lifetimes: {
    ready() {
      this.init();
    },
  },

  pageLifeTimes: {},

  methods: {
    clickHandle() {
      wx.navigateTo({
        url: `/pages/realpage/realpage?tweetId=${this.data.tweets.id}&index=${this.properties.index}`,
      });
    },

    init() {

    }
  },
});
