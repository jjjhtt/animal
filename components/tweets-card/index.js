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
        this.setData({ tweets: data});
        //console.log(this.data.tweets);
      },
    },
  },

  data: {
    tweets: {},
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
        url: `/pages/realpage/realpage?tweetId=${this.data.tweets.id}`,
      });
    },

    init() {

    }
  },
});
