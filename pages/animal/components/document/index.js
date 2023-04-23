Component({
  properties: {
    category: {
      type: Object,
      observer(category) {
        if (!category) {
          return;
        }
        this.setData({
          document: category
        });
        //console.log(this.data.tweets);
      },
    },
  },
  data: {
    document: {},    
  },
  methods: {

  },
});
