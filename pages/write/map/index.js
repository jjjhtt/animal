Page({

	/**
   * 页面的初始数据
   */
	data: {
		markers: [{
      callout: {
        content: '绿园东',
        padding: 10,
        borderRadius: 2,
        display: 'ALWAYS'
      },
      id: 0,
      latitude: 39.9838,
      longitude: 116.3469,
      iconPath: './imgs/Marker3_Activated@3x.png',
      width: '34px',
      height: '34px',
    }, 
    {
      callout: {
        content: '绿园西',
        padding: 10,
        borderRadius: 2,
        display: 'ALWAYS'
      },
      id: 1,
      latitude: 39.98375,
      longitude: 116.3452,
      iconPath: './imgs/Marker3_Activated@3x.png',
      width: '34px',
      height: '34px',
    }, {
      callout: {
        content: '晨读园',
        padding: 10,
        borderRadius: 2,
        display: 'ALWAYS'
      },
      id: 2,
      latitude: 39.984,
      longitude: 116.3498,
      iconPath: './imgs/Marker3_Activated@3x.png',
      width: '34px',
      height: '34px',
    }, {
      callout: {
        content: '静园',
        padding: 10,
        borderRadius: 2,
        display: 'ALWAYS'
      },
      id: 3,
      latitude: 39.984,
      longitude: 116.3525,
      iconPath: './imgs/Marker3_Activated@3x.png',
      width: '34px',
      height: '34px',
    }],
		tabIndex: 0,
		scale: 16,
		location: {
			latitude: 39.981771,
			longitude: 116.347313
		},
    markerCallbackTxt: '点击标注点选择大致位置',
    mode: '',
    datetimeVisible: false,
    datetime: new Date().getTime(),
    datetimeText: '点击选择时间',
    animalName: '点击选择动物',
    animalID: 0,
    start: ''
	},
  
  onTapMarker (event) {
		const markers = this.data.markers;
		for (let i = 0; i < markers.length; i++) { // 本示例只有一个marker，可用于处理单marker和多marker情况
			if (event.markerId === markers[i].id) {
        this.setData({
          markerCallbackTxt: markers[i].callout.content
        })
			}
		}
  },
  
  showPicker(e) {
    var newday = new Date().getTime() - 1 * 24 * 60 * 60 * 1000;
    this.setData({
      datetime: new Date().getTime(),
      start: newday,
      end: this.data.datetime
    })
    const { mode } = e?.currentTarget?.dataset;
    this.setData({
      mode,
      [`${mode}Visible`]: true,
    });
  },
  hidePicker() {
    const { mode } = this.data;
    this.setData({
      [`${mode}Visible`]: false,
    });
  },
  onConfirm(e) {
    const { value } = e?.detail;
    const { mode } = this.data;

    //console.log('confim', value);

    this.setData({
      [mode]: value,
      [`${mode}Text`]: value,
    });

    this.hidePicker();
  },

  onColumnChange(e) {
    //console.log('pick', e?.detail?.value);
  },

  onChoose() {
    wx.navigateTo({
      url: './chooseAnimal/index',
    })
  },

  onClick(e) {
    console.log(this.data.datetimeText);
  }
});
