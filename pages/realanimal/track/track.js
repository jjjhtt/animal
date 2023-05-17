// pages/realanimal/track/track.js
import {config} from '../../../config/index'
Page({
	data: {
		allMarker: [{
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
    markers: [],
    markerCallbackTxt: '点击标注点选择大致位置',
    mode: '',
    datetimeVisible: false,
    datetime: new Date().getTime(),
    animalID: 0,
    start: '',
    timeValue: '',
    nowTime: '点击查看动物出现时间及位置',
    timeVisible: false,
    times: [],
    tracks: [],
    customCalloutMarkerIds: [],
    // timer: null,  //定时器
    now: 0, //自动轨迹指针
  },
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')
  },
  onShow: function () {
    // const _this = this
    //  //定时器  函数赋值给timer  方便clearInterval（）使用
    //  _this.data.timer = setInterval(
    //    function () {
    //   _this.toClock1();        
    //   }, 6000);
    // _this.setData({
    //   timer:_this.data.timer
    // });
  },
  // toClock1(){ //定时函数
  //   if (this.data.now == this.data.tracks.length) {
  //     this.setData({ now:0 })
  //   }
  //   if (this.data.customCalloutMarkerIds.length != 0) {
  //     const that = this
  //     let sp = JSON.parse(JSON.stringify(this.data.allMarker ));
  //     for (let i = 0; i < sp.length; i++) {
  //       if (sp[i].id == this.data.tracks[that.data.now].location) {
  //         let newnow = this.data.now + 1;
  //         this.setData({ now: newnow})
  //         this.translateMarker()
  //         break;
  //       }
  //     }
  //   }
  // },
  // translateMarker: function () {
  //    const markers = this.data.markers
  //    const marker = markers[0]
  //    marker.latitude = marker.latitude + 0.002
  //    marker.longitude = marker.longitude + 0.002
  //   const that = this
  //   this.mapCtx.translateMarker({
  //     markerId: 2,
  //     duration: 1000,
  //     destination: {
  //       latitude: marker.latitude,
  //       longitude: marker.longitude
  //     },
  //     animationEnd() {
  //       console.log("asdasdadasddasd")
  //       that.setData({markers})
  //       console.log('animation end')
  //     },
  //     complete(res) {
  //       console.log('translateMarker', res)
  //     }
  //   })
  // },
  onHide: function () { //关闭clearInterval定时函数
    // clearInterval(this.data.timer);
    // this.setData({ timer: null });
  },
  onLoad: function(options) {
    this.setData({animalID: options.id})
    this.getdata(options.id)
  },
  getdata(id) {
    self = this
    // this.setData({
    //   times:[{ label: '自动循踪', value: '自动循踪' },
    //         { label: '11:00', value: '11:00' },
    //         { label: '12:00', value: '12:00' },
    //         { label: '13:00', value: '13:00' },
    //         { label: '14:00', value: '14:00' },],
    //   tracks:[
    //     { "location": 1, "time": "11:00" },
    //     { "location": 2, "time": "12:00" },
    //     { "location": 3, "time": "13:00" },
    //     { "location": 4, "time": "14:00" },
    //   ]
    // })
    // this.autoTrack()
    // return 0
    console.log(id)
    wx.request({
      url: config.domain + '/animal/track/get',
      method: 'POST',
      data: {
        "animalId": id,
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': wx.getStorageSync('token')
      },
      success(res) {
        console.log(res)
        if(res.data.body.tracks!=null) {
          var tempList = []
          var tempTrack = []
          for (var i = 0; i < res.data.body.tracks.length; i++) {
            var timeItem = {
              label: res.data.body.tracks[i].time,
              value: res.data.body.tracks[i].time,
            }
            var trackItem = {
              location: res.data.body.tracks[i].location,
              time: res.data.body.tracks[i].time,
            }
            tempList.push(timeItem)
            tempTrack.push(trackItem)
          }
          self.setData({
            times: tempList,
            tracks: tempTrack
          })
        }
      }
    })
  },
  onTapMarker (event) {
		const markers = this.data.markers;
		for (let i = 0; i < markers.length; i++) {
			if (event.markerId === markers[i].id) {
        this.setData({
          markerCallbackTxt: markers[i].callout.content
        })
			}
		}
  },
  onPicker() {
    this.setData({ timeVisible: true });
  },
  onPickerChange(e) {
    const { key } = e.currentTarget.dataset;
    const { value } = e.detail;
    const tracks = this.data.tracks;
    this.setData({
      [`${key}Visible`]: false,
      [`${key}Value`]: value,
      nowTime: value.join(' '),
      customCalloutMarkerIds: []
    });
    if (value == '自动循踪') {
      this.autoTrack();
      return 0;
    }
    for (let i = 0; i < tracks.length; i++) {
      if (tracks[i].time == value) {
        let sp = JSON.parse(JSON.stringify(this.data.allMarker ));
        for (let j = 0; j < sp.length; j++) {
          if (sp[j].id == tracks[i].location) {
            this.setData({ 
              markers:sp.splice(j,1),
              location:{latitude: this.data.allMarker[j].latitude,
                        longitude: this.data.allMarker[j].longitude,}
            })
            break;
          }
        }
        break;
      }
    }
  },
  autoTrack() {
    let sp = JSON.parse(JSON.stringify(this.data.allMarker ));
    for (let i = 0; i < sp.length; i++) {
      if (sp[i].id == this.data.tracks[0].location) {
        this.setData({ 
          markers:sp.splice(i,1),
          now: 0,
          customCalloutMarkerIds:[1],
          location:{latitude: this.data.allMarker[i].latitude,
                    longitude: this.data.allMarker[i].longitude,}
        })
        break;
      }
    }
  },
  onPickerCancel(e) {
    const { key } = e.currentTarget.dataset;
    this.setData({
      [`${key}Visible`]: false,
    });
  },
  onColumnChange(e) {
  },
});