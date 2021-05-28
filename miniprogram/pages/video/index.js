// pages/video/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    seatList: [],
    urls: [
      'https://hls01open.ys7.com/openlive/a191efd4e9d54091968cb5736df69bdc.m3u8'
    ],
    url: '',
    value: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onCahnge(value){
    this.setData({
      url:this.data.urls[value.detail]
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  async getToken() {
    const res = await app.http('POST', 'https://open.ys7.com/api/lapp/token/get?appKey=e5f2a7cc731242d68deea66bcaf08849&appSecret=221f7db1e8cd91db4ccc8e911f9244b6')
    const accessToken = res.data.data.accessToken
    console.log(accessToken)
    const url = `https://open.ys7.com/api/lapp/v2/live/address/get?accessToken=${accessToken}&deviceSerial=C78551342&channelNo=1`
    wx.request({
      method: 'POST',
      url,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Host': 'open.ys7.com'
      },
      success(res) {
        console.log(res)
      },
      fail() {
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let seatList = []
    for (let i = 0; i < 6; i++) {
      seatList.push({ value: i, text: `${i + 1}号机` })
    }
    this.setData({
      seatList,
      url: this.data.urls[0]
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