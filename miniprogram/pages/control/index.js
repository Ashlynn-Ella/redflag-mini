// pages/control/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    checked: true,
    houseList: [
      { text: '棚室选择', value: 0 },
      { text: '棚室2', value: 1 },
    ],
    aways: [
      { text: '手动控制', value: 0 },
      { text: '自动控制', value: 1 }
    ],
    house: 0,
    away: 0,
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
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  tabChange: function (event) {
    this.setData({
      active: event.detail.index
    })
  },
  detailOpen: function () {
    this.setData({
      show: true
    })
  },
  onClose: function () {
    this.setData({
      show: false
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