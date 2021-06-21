// pages/control/index.js
const app = getApp();
import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    houseList: [],
    CJ01_lighting01: true,
    CJ01_coolpump01: true,
    CJ01_cyclefan01: true,
    CJ01_emerstop01: false,
    productId: '20201015170538',
    loading: false,
    aways: [
      { text: '手动控制', value: 1 },
      { text: '自动控制', value: 0 }
    ],
    deviceId: 'smart_01',
    CJ01_manuauto01: 1,
    show: false,
    steps: [
      {
        text: '【操作】开启     状态：成功',
        desc: '2021-05-08 10:18:57',
      },
      {
        text: '步骤二',
        desc: '描述信息',

      },
      {
        text: '步骤三',
        desc: '描述信息',
      },
      {
        text: '步骤四',
        desc: '描述信息',
      },
      {
        text: '步骤四',
        desc: '描述信息',
      },
      {
        text: '步骤四',
        desc: '描述信息',
      },
      {
        text: '步骤四',
        desc: '描述信息',
      },
      {
        text: '步骤四',
        desc: '描述信息',
      },
    ],
    disabled: false,
    autoDisabled: false,
    name: '',
    loading: true,
    status: '',
    wtDisabled: false,
    open: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onlineChange() {
    this.setData({
      open: !this.data.open
    })
  },


  tabChange: function (event) {
    this.setData({
      active: event.detail.index
    })
  },

  //控制详情上推弹框
  detailOpen(e) {
    const id = e.currentTarget.dataset.id
    const name = id === 'CJ01_emerstop01' ?
      '紧急开关' : id === 'CJ01_lighting01' ?
        '照明灯' : id === 'CJ01_cyclefan01' ?
          '环流风机' : '湿帘水泵'
    this.setData({
      show: true,
      name
    })
    this.getLog(id)
  },
  onClose: function () {
    this.setData({
      show: false
    })
  },

  //设备操作
  stopChange(value) {
    Dialog({
      title: '提示',
      message: `确定${!this.data.CJ01_emerstop01 ? '紧急停止' : '复位'}设备吗？`,
      showCancelButton: true
    }).then(() => {
      this.putStatus('CJ01_emerstop01', value.detail)
    })
  },
  lightChange(value) {
    this.putStatus('CJ01_lighting01', value.detail)
  },
  cycleChange(value) {
    this.putStatus('CJ01_cyclefan01', value.detail)
  },
  coolChange(value) {
    this.putStatus('CJ01_coolpump01', value.detail)
  },
  //手自动控制
  awayChange(value) {
    const des = value.detail === '1' ? true : false
    this.putStatus('CJ01_manuauto01', des)
  },

  //获取手自动状态
  async getAutoStatu() {
    const url = `${app.globalData.baseUrl}/device-instance/${this.data.deviceId}/properties/_query?pageIndex=0&pageSize=1&sorts%5B0%5D.name=timestamp&sorts%5B0%5D.order=desc&terms%5B0%5D.column=property&terms%5B0%5D.value=CJ01_manuauto01`
    const res = await app.queryClient('GET', url)
    const away = res.result.data[0].value === 'true' ? 1 : 0
    this.setData({
      CJ01_manuauto01: away,
      disabled: !away
    })
  },
  //获取按钮的状态
  getStatus() {
    const propList = ["CJ01_lighting01", "CJ01_coolpump01", "CJ01_cyclefan01"]
    propList.forEach(async item => {
      const url = `${app.globalData.baseUrl}/device-instance/${this.data.deviceId}/properties/_query?pageIndex=0&pageSize=1&sorts[0].name=timestamp&sorts[0].order=desc&terms[0].column=property&terms[0].value=${item}`
      const res = await app.queryClient('GET', url)
      const data = res.result.data[0]
      const value = data.value === 'false' ? false : true
      this.setData({
        [item]: value
      })
    })
  },
  //获取紧急停止的状态
  async getStopStatus() {
    wx.getStorage({
      key: 'X-Access-Token',
      success: (res) => {
        app.client(
          "GET",
          `${app.globalData.url}/status.php?token=${res.data}&deviceId=smart_01&productId=20201015170538`
        ).then(res => {
          if (res.statusCode === 200) {
            this.setData({
              CJ01_emerstop01: !res.data.status,
              disabled: !res.data.status,
              autoDisabled: !res.data.status
            })
          }
        })
      }
    })
  },

  //获取开关操作记录
  getLog(prop) {
    wx.getStorage({
      key: 'X-Access-Token',
      success: (res) => {
        const url = `${app.globalData.url}/api/actlogsone.php?token=${res.data}&deviceId=${this.data.deviceId}&productId=${this.data.productId}&properties=${prop}`
        app.http(
          "GET",
          url
        ).then(res => {
          this.setData({
            steps: res.data.data,
          })
        })
      }
    })
  },

  //控制开关
  async putStatus(propId, value) {
    this.setData({
      disabled: true
    })
    const results = await app.queryClient(
      "PUT",
      `${app.globalData.baseUrl}/device/instance/${this.data.deviceId}/property`,
      {
        [propId]: value
      }
    );
    if (results.code === 'success') {      
      if (propId === 'CJ01_emerstop01') {
        if (results.result[0].code === 1) {
          Toast.success('操作成功')
          this.getStatus()
          this.setData({
            disabled: value,
            autoDisabled: value,
            [propId]: value
          })

        } else {
          Toast.fail('操作失败')
        }
      } else if (propId === 'CJ01_manuauto01') {
        Toast.success('操作成功')
        this.setData({
          disabled: !value
        })
      } else {
        Toast.success('操作成功')
        const res = results.result[0];
        value = res[propId];
        this.setData({
          [propId]: value
        })
        setTimeout(() => {
          this.setData({
            disabled: false
          })
        }, 1000);
      }
    } else {
      Toast.fail('操作失败' + results.message)
      if (propId === 'CJ01_emerstop01') {
        this.getStopStatus()
      } else if (propId === 'CJ01_manuauto01') {
        this.getAutoStatu()
      } else {
        this.setData({
          disabled: false
        })
        app.queryClient(
          "GET",
          `${app.globalData.baseUrl}/device-instance/${this.data.deviceId}/properties/_query?pageIndex=0&pageSize=1&sorts[0].name=timestamp&sorts[0].order=desc&terms[0].column=property&terms[0].value=${propId}`
        ).then((res) => {
          const value = res.result.data[0].value == "true";
          this.setData({
            [propId]: value
          })
        });
      }
    }
  },

  async initDevice() {
    this.setData({
      loading: true
    })
    const res = await app.queryAllDevice()
    const list = []
    res.data.forEach(item => {
      list.push({ text: item.name, value: item.id })
    })
    this.setData({
      houseList: list,
      loading: false
    })
  },

  //水肥控制按钮改变
  statusChange(value) {
    this.setData({
      status: value.detail,
      wtDisabled: value.detail
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onShow: function () {
    this.initDevice()
    this.getAutoStatu()
    this.getStatus()
    this.getStopStatus()
  },
  /**
   * 生命周期函数--监听页面显示
   */

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
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 100)
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