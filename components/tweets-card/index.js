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
      this.triggerEvent('click', { tweets: this.data.tweets });
    },

    init() {

    }
  },
});
