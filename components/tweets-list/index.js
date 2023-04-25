Component({
  externalClasses: ['wr-class'],

  properties: {
    tweetsList: {
      type: Array,
      value: [],
    },
  },

  lifetimes: {
    ready() {
      this.init();
    },
  },

  methods: {
    onClicktweets(e) {
      const { index } = e.currentTarget.dataset;
      this.triggerEvent('click', { ...e.detail, index });
    },

    onClicktweetsThumb(e) {
      const { index } = e.currentTarget.dataset;
      this.triggerEvent('thumb', { ...e.detail, index });
    },

    init() {
      
    },


  },
});
