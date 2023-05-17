import Toast from 'tdesign-miniprogram/toast/index';
import {config} from '../../../config/index'

Page({

	/**
   * 页面的初始数据
   */
	data: {
		markers: [{
      callout: {
        content: '绿园东',
        padding: 8,
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
        padding: 8,
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
        padding: 8,
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
        padding: 8,
        borderRadius: 2,
        display: 'ALWAYS'
      },
      id: 3,
      latitude: 39.984,
      longitude: 116.3525,
      iconPath: './imgs/Marker3_Activated@3x.png',
      width: '34px',
      height: '34px',
    }, {
      callout: {
        content: '图书馆',
        padding: 8,
        borderRadius: 2,
        display: 'ALWAYS'
      },
      id: 4,
      latitude: 39.9837,
      longitude: 116.3488,
      iconPath: './imgs/Marker3_Activated@3x.png',
      width: '34px',
      height: '34px',
    }, {
      callout: {
        content: '求是广场',
        padding: 8,
        borderRadius: 2,
        display: 'ALWAYS'
      },
      id: 5,
      latitude: 39.9825,
      longitude: 116.3488,
      iconPath: './imgs/Marker3_Activated@3x.png',
      width: '34px',
      height: '34px',
    }, {
      callout: {
        content: '南区公寓',
        padding: 8,
        borderRadius: 2,
        display: 'ALWAYS'
      },
      id: 6,
      latitude: 39.9823,
      longitude: 116.3461,
      iconPath: './imgs/Marker3_Activated@3x.png',
      width: '34px',
      height: '34px',
    }, {
      callout: {
        content: '操场',
        padding: 8,
        borderRadius: 2,
        display: 'ALWAYS'
      },
      id: 7,
      latitude: 39.9801,
      longitude: 116.346,
      iconPath: './imgs/Marker3_Activated@3x.png',
      width: '34px',
      height: '34px',
    }, {
      callout: {
        content: '球场',
        padding: 8,
        borderRadius: 2,
        display: 'ALWAYS'
      },
      id: 8,
      latitude: 39.9801,
      longitude: 116.3473,
      iconPath: './imgs/Marker3_Activated@3x.png',
      width: '34px',
      height: '34px',
    }, {
      callout: {
        content: '海棠园',
        padding: 8,
        borderRadius: 2,
        display: 'ALWAYS'
      },
      id: 9,
      latitude: 39.9823,
      longitude: 116.34988,
      iconPath: './imgs/Marker3_Activated@3x.png',
      width: '34px',
      height: '34px',
    }, {
      callout: {
        content: '唯实园',
        padding: 8,
        borderRadius: 2,
        display: 'ALWAYS'
      },
      id: 10,
      latitude: 39.9785,
      longitude: 116.3511,
      iconPath: './imgs/Marker3_Activated@3x.png',
      width: '34px',
      height: '34px',
    }, {
      callout: {
        content: '新主楼',
        padding: 8,
        borderRadius: 2,
        display: 'ALWAYS'
      },
      id: 11,
      latitude: 39.9802,
      longitude: 116.3518,
      iconPath: './imgs/Marker3_Activated@3x.png',
      width: '34px',
      height: '34px',
    }, {
      callout: {
        content: '北区公寓',
        padding: 8,
        borderRadius: 2,
        display: 'ALWAYS'
      },
      id: 12,
      latitude: 39.9853,
      longitude: 116.3460,
      iconPath: './imgs/Marker3_Activated@3x.png',
      width: '34px',
      height: '34px',
    }, {
      callout: {
        content: '主楼',
        padding: 8,
        borderRadius: 2,
        display: 'ALWAYS'
      },
      id: 13,
      latitude: 39.984,
      longitude: 116.3509,
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
    start: '',
    locationId: 0
	},
  
  onTapMarker (event) {
		const markers = this.data.markers;
		for (let i = 0; i < markers.length; i++) { // 本示例只有一个marker，可用于处理单marker和多marker情况
			if (event.markerId === markers[i].id) {
        this.setData({
          markerCallbackTxt: markers[i].callout.content,
<<<<<<< Updated upstream
          locationId: markers[i].id
=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    if(this.data.datetimeText[0]==='点') {
      Toast({
        context: this,
        context: this,
        selector: '#t-toast',
        message: '请先选择时间！',
        theme: 'error',
        direction: 'column'
      })
      return
    }
    if(this.data.markerCallbackTxt[0] === '点') {
      Toast({
        context: this,
        context: this,
        selector: '#t-toast',
        message: '请先选择地点！',
        theme: 'error',
        direction: 'column'
      })
      return
    }
    if(this.data.animalID == 0) {
      Toast({
        context: this,
        context: this,
        selector: '#t-toast',
        message: '请先选择动物！',
        theme: 'error',
        direction: 'column'
      })
      return
    }
    wx.request({
      url: config.domain + '/animal/track/update',
      method: 'POST',
      data: {
        "userId": wx.getStorageSync('userId'),
        "animalId": this.data.animalID,
        "location": this.data.locationId,
        "time": this.data.datetimeText,
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': wx.getStorageSync('token')
      },
      success(res) {
        Toast({
          context: this,
          context: this,
          selector: '#t-toast',
          message: '上传成功',
          theme: 'success',
          direction: 'column'
        })
        console.log(res)
      },
      fail(res) {
        console.log(res)
      }
    })
=======
>>>>>>> Stashed changes
  }
});
