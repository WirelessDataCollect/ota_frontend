import http from "./tools";
import * as config from "./config";


//登录
export const login = params =>
  http.postlogin(config.requestIp + "/login", {
    username: params[0],
    password: params[1]
  });

//退出
export const logoff = params =>
  http.postlogoff(config.requestIp + "/oauth/token?token=" + localStorage.getItem('access_token'), {

  });

//提交ota文件信息
export const fileinfoUpload = params =>
  http.post(config.requestIp + "/firmware/uploadinfo", {
    // name: params[0],
    // phonenumber: params[1],
    access_token: localStorage.getItem('access_token'),
    firmwareVersion: params[0],
    content: params[1],
    firmwareId: params[2],
    mcuType: params[3],
    fileName: params[4]
  });

//获取设备信息
export const getDeviceInfo = params =>
  http.post(config.requestIp + "/device/query", {
    access_token: localStorage.getItem('access_token')
  });

//获取固件版本列表
export const getFirmwareInfo = params =>
  http.post(config.requestIp + "/firmware/query", {
    access_token: localStorage.getItem('access_token'),
    userName: localStorage.getItem('user_type') === 'ADMIN' ? '' : localStorage.getItem('userID'),
  });

//删除固件版本列表
export const deletebyfirmwareid = params =>
  http.post(config.requestIp + "/firmware/deletebyfirmwareid", {
    access_token: localStorage.getItem('access_token'),
    userName: localStorage.getItem('userID'),
    firmwareIds: params,
  });

//下发固件升级命令
export const otaCommand = params =>
  http.post(config.requestIp + "/firmware/config", {
    access_token: localStorage.getItem('access_token'),
    imei: params[0],
    RecID: params[1],
    SendID: params[2],
    firmwareId: params[3],
    mcuType: params[4],
    cannum: params[5],
    measure: params[6]
  });

//升级历史列表
export const queryhistory = params =>
  http.post(config.requestIp + "/history/query", {
    access_token: localStorage.getItem('access_token'),
    imei: params[0],
    beginTime: params[1],
    endTime: params[2],
    userName: params[3]
  });

//升级进度
export const queryOtaRate = params =>
  http.post(config.requestIp + "/firmware/downloadreport", {
    access_token: localStorage.getItem('access_token'),
    imei: params[0],
    requestId: params[1]
  });

//用户列表
export const getUserInfo = params =>
  http.post(config.requestIp + "/authority/user/get", {
    access_token: localStorage.getItem('access_token')
  });

//删除用户
export const deleteUser = params =>
  http.post(config.requestIp + "/authority/user/delete", {
    access_token: localStorage.getItem('access_token'),
    userId:params[0]
  });

//添加用户
export const addUser = params =>
  http.post(config.requestIp + "/authority/user/add", {
    access_token: localStorage.getItem('access_token'),
    username: params[0],
    password: params[1],
    realname: params[2],
    phone: params[3],
    email: params[4],
    info: params[5],
    roleIds: params[6]
  });