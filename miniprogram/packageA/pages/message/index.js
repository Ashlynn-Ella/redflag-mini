// packageA/pages/message/index.js
const app = getApp();
import dayjs from 'dayjs/index'
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    show: false,
    houseList: [],
    deviceId: 'smart_01',
    maxDate: new Date().getTime(),
    minDate: new Date(2020, 0, 1).getTime(),
    defalutDate: '',
    time: [],
    productId: '20201015170538',
    pageIndex: 0,
    pageSize: 7,
    systemlogs: [],
    event: [],
    alertlogs: [],
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initDevice()
    this.initDate()
    this.initLogs()
  },
  onClose: function () {
    this.setData({
      show: false
    })
    this.selectComponent('#item').toggle(false);
  },
  formatDate(date) {
    date = new Date(date).getTime();
    return date;
  },
  confirm: function (value) {
    const [start, end] = value.detail;
    const days = (this.formatDate(end) - this.formatDate(start)) / (1000 * 24 * 3600) || 10
    this.setData({
      show: false,
      canvasShow: true,
      date: days,
    })
    this.selectComponent('#item').toggle(false)
    this.initLogs()
  },
  dateOpen: function () {
    this.setData({
      show: true
    })
  },
  tabChange(event) {
    this.setData({
      active: event.detail.index
    })
    this.initLogs()
  },

  //设备切换
  sysChange(value) {
    const productId = this.data.houseList.filter(item => item.value === value.detail)[0].productId
    this.setData({
      deviceId: value.detail,
      productId
    })
    this.initLogs()
  },

  async initDevice() {
    const res = await app.queryAllDevice()
    const list = []
    res.data.forEach(item => {
      list.push({ text: item.name, value: item.id, productId: item.productId })
    })
    this.setData({
      houseList: list
    })
  },

  initLogs() {
    this.setData({
      loading: true
    })
    const start = dayjs(this.data.defalutDate[0]).format('YYYY-MM-DD')
    const end = dayjs(this.data.defalutDate[1]).format('YYYY-MM-DD')
    // const deviceId = this.data.active === 0 ?
    //   this.data.house1 : this.data.active === 1 ?
    //     this.data.house2 : this.data.house3
    const event = this.data.active === 0 ?
      'systemlogs' : this.data.active === 1 ?
        'alertlogs' : 'event'
    wx.getStorage({
      key: 'X-Access-Token',
      success: async (res) => {
        const url = `${app.globalData.url}/${event}.php?token=${res.data}&deviceId=${this.data.deviceId}&productId=${this.data.productId}&pageIndex=${this.data.pageIndex}&pageSize=${this.data.pageSize}&start=${start} 00:00:00&end=${end} 23:59:59`
        const result = await app.http('GET', url)
        if (result.data.total !== 0) {
          const list = this.data[event]
          this.setData({
            [event]: list.concat(result.data.data),
            loading: false
          })
        } else {
          this.setData({
            [event]: [],
            loading: false
          })
          Toast.fail('无历史记录')
        }
      }
    })
  },

  initDate() {
    const date = new Date().getTime()
    const prveDate = date - 10 * 1000 * 24 * 3600
    this.setData({
      defalutDate: [prveDate, date]
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
    this.initLogs()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const index = this.data.pageIndex
    this.setData({
      pageIndex: index + 1
    })
    this.initLogs()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})