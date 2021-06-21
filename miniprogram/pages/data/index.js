// pages/data/index.js
const app = getApp()
import * as echarts from '../../components/ec-canvas/echarts';
import Notify from '@vant/weapp/notify/notify';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    houseList: [],
    propList: [],
    tabDevice: 'smart_01',
    deviceId: 'smart_01',
    deviceName: '红旗智慧农业控制器',
    prop: 'CJ01_soiltemp01',
    propName: '',
    productId: '20201015170538',
    show: false,
    ec: {
      lazyLoad: true
    },
    canvasImage: '',
    canvasShow: true,
    maxDate: new Date().getTime(),
    minDate: new Date(2020, 0, 1).getTime(),
    defalutDate: '',
    date: 10,
    time: [],
    vlaueList: [],
    maxValue: '',
    minValue: '',
    avgValue: '',
    multi: '',
    loading: true,
    minTime:'',
    maxTime:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
 * 生命周期函数--监听页面初次渲染完成
 */
  onReady: function () {
    this.initWebscokect()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow:async function () {
    await this.initDevice()
    await this.initProps(this.data.deviceId)
    this.getMulti()
  },

  onClose: function () {
    this.setData({
      show: false,
      canvasShow: true
    })
    this.selectComponent('#item').toggle(false);
    setTimeout(() => {
      this.initHistory()
    }, 500)
  },
  formatDate(date) {
    date = new Date(date).getTime();
    return date;
  },
  confirm: function (value) {
    this.setData({
      loading: true
    })
    const [start, end] = value.detail;
    const days = (this.formatDate(end) - this.formatDate(start)) / (1000 * 24 * 3600) || 10
    this.setData({
      show: false,
      canvasShow: true,
      date: days,
    })
    this.selectComponent('#item').toggle(false)
    setTimeout(() => {
      this.initHistory()
    }, 500)
  },
  dateOpen: function () {
    const date = new Date().getTime()
    const prveDate = date - 10 * 1000 * 24 * 3600
    this.setData({
      show: true,
      canvasShow: false,
      defalutDate: [prveDate, date]
    })
  },
  tabChange(event) {
    this.setData({
      active: event.detail.index,
      loading: true
    })
    if (event.detail.index === 1) {
      setTimeout(() => {
        this.initHistory()
      }, 500)
    }
  },
  dropOpen() {
    this.setData({
      canvasShow: false
    })
  },
  dropClose() {
    this.setData({
      canvasShow: true,
      loading: true
    })
    setTimeout(() => {
      this.initHistory()
    }, 500)
  },
  tabdeviceChange(value) {
    this.initProps(value.detail)
    const productId = this.data.houseList.filter(item => item.value === value.detail)[0].productId
    this.setData({
      tabDevice: value.detail,
      productId
    })
    this.getMulti()
    this.onSocketOpen()
  },
  async getMulti() {
    this.setData({
      loading: true
    })
    const url = `${app.globalData.baseUrl}/dashboard/_multi`
    const param = {
      dashboard: "device",
      object: this.data.productId,
      measurement: "properties",
      dimension: "history",
      params: { deviceId: `${this.data.tabDevice}`, history: 1 },
    };
    const res = await app.queryClient('POST', url, param)
    const _multi = res.result
    const list = []
    _multi.forEach(item => {
      const multiValue = item.data.value
      const name = this.data.propList?.filter(prop => prop.value === multiValue.property)[0].text
      const unit = this.data.propList?.filter(prop => prop.value === multiValue.property)[0].unit
      const url = multiValue.value || multiValue.value === 0 ? `/images/data/${multiValue.property.slice(5, -2)}.png` : `/images/data/${multiValue.property.slice(5, -2)}01.png`
      list.push({ ...multiValue, name, unit, url })
    })
    this.setData({
      multi: list,
      loading: false
    })
  },

  save() {
    const ecComponent = this.selectComponent('#mychart-dom-line');
    // 先保存图片到临时的本地文件，然后存入系统相册
    ecComponent.canvasToTempFilePath({
      success: res => {
        this.setData({
          canvasImage: res.tempFilePath
        })
      },
      fail: res => console.log(res)
    });
  },


  async initDevice() {
    const res = await app.queryAllDevice()
    const list = []
    res.data.forEach(item => {
      const productId = item.productId
      list.push({ text: item.name, value: item.id, productId })
    })
    this.setData({
      houseList: list,
    })
  },
  async initProps(deviceId) {
    const resProps = await app.queryProps(this.data.deviceId)
    const propList = app.formatProps(resProps.metadata)
    const propName = propList[0].text
    this.setData({
      propList: propList,
      productId: resProps.productId,
      prop: propList[0].value,
      propName
    })
  },
  async initHistory() {
    const url = `${app.globalData.baseUrl}/api/v1/device/${this.data.deviceId}/agg/AVG/${this.data.prop}/_query`
    const data = await app.queryClient('POST', url,
      {
        interval: "1d",
        from: `now-${this.data.date}d`,
        to: "now",
        query: {
          pageSize: this.data.date,
        }
      })
    const time = []
    const vlaueList = []
    data.result.forEach(item => {
      time.push(item.time)
      vlaueList.push(item[this.data.prop])
    })
    let maxValue = Math.max(...vlaueList)
    let minValue = Math.min(...vlaueList) == 0 ? 0 : Math.min(...vlaueList.data)
    let avgValue = (maxValue + minValue) / 2
    let minTime = data.result.filter(
      (item) => item[this.data.prop] == minValue
    )[0].time;
    let maxTime = data.result.filter(
      (item) => item[this.data.prop] == maxValue
    )[0].time;
    this.setData({
      time,
      vlaueList,
      maxValue: maxValue.toFixed(2),
      minValue: minValue.toFixed(2),
      avgValue: avgValue.toFixed(2),
      minTime,
      maxTime
    })
    this.setData({
      loading: false
    })
    this.initChart()
  },

  deviceChange(value) {
    this.initProps(value.detail)
    const name = this.data.houseList?.filter(item => item.value === value.detail)[0].text
    this.setData({
      deviceId: value.detail,
      loading: true,
      deviceName:name
    })
    setTimeout(() => {
      this.initHistory()
    }, 500)
  },

  propChange(value) {
    const name = this.data.propList?.filter(item => item.value === value.detail)[0].text
    this.setData({
      prop: value.detail,
      propName: name,
      loading: true
    })
    setTimeout(() => {
      this.initHistory()
    }, 500)
  },

  initChart: function () {
    const ecComponent = this.selectComponent('#mychart-dom-line');
    ecComponent.init(
      (canvas, width, height, dpr) => {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr // 像素
        });
        canvas.setChart(chart);
        chart.setOption(this.getOption());
        return chart;
      }
    )
  },
  getOption() {
    return {
      title: {
        text: '测试下面legend的红色区域不应被裁剪',
        left: 'center'
      },
      legend: {
        left: 'center',
        backgroundColor: 'red',
        z: 100
      },
      color: '#57b5ff',
      grid: {
        containLabel: true
      },
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          show: false,
          interval: 5
        },
        boundaryGap: false,
        data: this.data.time
      },
      yAxis: {
        x: 'center',
        type: 'value',
        // name: options.ytip,
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      series: [
        {
          type: "line",
          showSymbol: false,
          data: this.data.vlaueList,
          smooth: true,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(0, 221, 255)'
            }, {
              offset: 1,
              color: 'rgba(77, 119, 255)'
            }])
          }
        },
      ],
    };
  },

  //获取时实数据
  initWebscokect() {
    wx.getStorage({
      key: 'X-Access-Token',
      success: (res) => {
        wx.connectSocket({
          url: `wss://aiot.chinaredflag.cn/messaging/${res.data}`,
          header: {
            'content-type': 'application/json'
          },
          success: (res) => {
            console.log(res)
          }
        })
        this.onSocketOpen()
      }
    })
  },
  onSocketOpen() {
    let socketMsgQueue = [{
      type: "sub", //固定为sub
      topic: `/device/${this.data.productId}/${this.data.deviceId}/message/property/report`,
      id: `request-data`
    }, {
      type: "sub", //固定为sub
      topic: `/rule-engine/device/alarm/${this.data.productId}/${this.data.deviceId}/1382229364221140992`,
      "id": "request-notice01"
    }]
    wx.onSocketOpen(res => {
      for (let i = 0; i < socketMsgQueue.length; i++) {
        this.sendSocketMessage(JSON.stringify(socketMsgQueue[i]))
      }
    })
    wx.onSocketMessage(res => {
      const data = JSON.parse(res.data)
      if (data.requestId === 'request-data') {       
        let prop = data.payload.properties      
        const list = this.data.multi
        list.forEach(item => {
          if (item.property === Object.keys(prop)[0]) {
            let value = prop[item.property]
            let formatValue
            let unit = item.unit ? item.unit : ''
            if (typeof value === 'boolean') {
              if (item.property === 'CJ01_manuauto01') {
                formatValue = value ? '手动' : '自动'
              } else {
                formatValue = value ? '开' : '关'
              }
            } else {
              value = value === 0 ? 0 :typeof value === 'string'?value: value.toFixed(1)
              formatValue = (value + unit)
            }
            item.formatValue = formatValue
          }
        })
        this.setData({
          multi: list,
          loading: false
        })
      } else if (data.requestId === 'request-notice01') {
        const res = data.payload
        Notify({
          type: 'danger',
          message: `${res.productName}：${res.alarmName}`,
          duration: 5000,
          top: 44
        })
      }
    })
  },
  sendSocketMessage(msg) {
    wx.sendSocketMessage({
      data: msg
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.initDevice()
    this.initProps(this.data.deviceId)
    this.initHistory()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})