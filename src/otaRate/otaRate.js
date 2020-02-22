import React from "react";
import {
  Layout,
  Card,
  message,
  Progress
} from "antd";

import {
  queryOtaRate
} from "../axios";
import "./otaRate.css";

const { Content } = Layout;

class App extends React.Component {
  state = {
    rate: 0
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  componentWillMount() { }

  componentDidMount() {
    var url = window.location.href;
    var imei = url.split('=')[1];
    imei = imei.split('?')[0];
    var requestId = url.split('=')[2];
    this.setState({ imei: imei });
    var queryota = () => {
      queryOtaRate([imei, requestId]).then(res => {
        if (res.status === 500) {
          message.error('当前设备没有ota进程');
          this.setState({ rate: 0 });
        } else if (res.data.status === 1) {
          if (!res.data.data.configBO) {
            message.error('当前设备没有ota进程');
            return
          }
          if (res.data.data.configBO.measure === 66) {
            if (res.data.data.statusEnum) {
              if (res.data.data.statusEnum === 'CAN_SEND_ERROR') {
                message.error('CAN发送失败,请关闭页面');
                this.setState({ status: 'exception', tip: 'CAN发送失败' });
              } else if (res.data.data.statusEnum === 'CAN_NO_REPLY') {
                message.error('未收到CAN回复,请关闭页面');
                this.setState({ status: 'exception', tip: '未收到CAN回复' });
              } else if (res.data.data.statusEnum === 'ERROR_FRAME_RECEIVED') {
                message.error('接收到协议外错误帧,请关闭页面');
                this.setState({ status: 'exception', tip: '接收到协议外错误帧' });
              } else if (res.data.data.statusEnum === 'DECRYPT_ERROR') {
                message.error('解密失败,请关闭页面');
                this.setState({ status: 'exception', tip: '解密失败' });
              } else if (res.data.data.statusEnum === 'FILE_WRONG') {
                message.error('文件错误,请关闭页面');
                this.setState({ status: 'exception', tip: '文件错误' });
              } else if (res.data.data.statusEnum === 'CONFIG_SUCCESS') {
                // message.error('文件错误,请关闭页面');
                this.setState({ status: 'exception', tip: '下发配置成功，等待上报配置结果' });
              } else if (res.data.data.statusEnum === 'CONFIG_ERROR') {
                message.error('下发配置失败,请关闭页面');
                this.setState({ status: 'exception', tip: '下发配置失败' });
              } else if (res.data.data.statusEnum === 'CONFIG_NO_STATUS') {
                message.error('无配置状态,请关闭页面');
                this.setState({ status: 'exception', tip: '无配置状态' });
              } else if (res.data.data.statusEnum === 'CONFIG_DEVICE_DISCONNECT') {
                message.error('下发配置时设备掉线,请关闭页面');
                this.setState({ status: 'exception', tip: '文件错误' });
              } else if (res.data.data.statusEnum === 'UPDATE_SUCCESS') {
                this.setState({ rate: 100, status: 'success', tip: '固件升级已完成' });
                message.success('升级已完成，请至升级记录页面查询详情');
              } else if (res.data.data.statusEnum === 'LOAD_ON_STATUS') {
                this.setState({ rate: res.data.data.packNumber / res.data.data.totalPack * 100, tip: '固件正在下发和烧录，请您稍候' });
                setTimeout(function () {
                  queryota();
                }, 500);
              }
            } else {
              message.error('当前设备没有ota进程');
              this.setState({ rate: 0 });
            }
          } else {
            if (res.data.data.statusEnum) {
              if (res.data.data.statusEnum === 'LOAD_ERROR') {
                message.error('下载失败,请关闭页面');
                this.setState({ status: 'exception', tip: '下载失败' });
              } else if (res.data.data.statusEnum === 'LOAD_NO_STATUS') {
                message.error('设备无下载状态,请关闭页面');
                this.setState({ status: 'exception', tip: '设备无下载状态' });
              } else if (res.data.data.statusEnum === 'LOAD_FIRMWARE_NOT_FOUND') {
                message.error('未找到设备固件,请关闭页面');
                this.setState({ status: 'exception', tip: '未找到设备固件' });
              } else if (res.data.data.statusEnum === 'LOAD_FIRMWARE_DEVICE_DISCONNECT') {
                message.error('下载固件时设备离线,请关闭页面');
                this.setState({ status: 'exception', tip: '下载固件时设备离线' });
              } else if (res.data.data.statusEnum === 'LOAD_FIRMWARE_DEFORE_CONFIG') {
                message.error('下载固件前没有进行配置,请关闭页面');
                this.setState({ status: 'exception', tip: '下载固件前没有进行配置' });
              } else if (res.data.data.statusEnum === 'LOAD_FIRMWARE_DEVICE_NO_ACK') {
                message.error('下载固件时设备无ACK应答,请关闭页面');
                this.setState({ status: 'exception', tip: '下载固件时设备无ACK应答' });
              } else if (res.data.data.statusEnum === 'CONFIG_SUCCESS') {
                // message.error('文件错误,请关闭页面');
                this.setState({ status: 'exception', tip: '下发配置成功，等待上报配置结果' });
              } else if (res.data.data.statusEnum === 'CONFIG_ERROR') {
                message.error('下发配置失败,请关闭页面');
                this.setState({ status: 'exception', tip: '下发配置失败' });
              } else if (res.data.data.statusEnum === 'CONFIG_NO_STATUS') {
                message.error('无配置状态,请关闭页面');
                this.setState({ status: 'exception', tip: '无配置状态' });
              } else if (res.data.data.statusEnum === 'CONFIG_DEVICE_DISCONNECT') {
                message.error('下发配置时设备掉线,请关闭页面');
                this.setState({ status: 'exception', tip: '文件错误' });
              } else if (res.data.data.statusEnum === 'LOAD_SUCCESS') {
                this.setState({ rate: 100, status: 'success', tip: '固件升级已完成' });
                message.success('升级已完成，请至升级记录页面查询详情');
              } else if (res.data.data.statusEnum === 'LOAD_ON_STATUS') {
                this.setState({ rate: res.data.data.packNumber / res.data.data.totalPack * 100, tip: '固件正在下发和烧录，请您稍候' });
                setTimeout(function () {
                  queryota();
                }, 500);
              }
            } else {
              message.error('当前设备没有ota进程');
              this.setState({ rate: 0 });
            }
          }
        } else {
          message.error('当前设备没有ota进程');
          return;
        }
      });
    }
    queryota();
  }

  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Layout>
          <Content style={{ margin: "16px 16px", textAlign: 'center' }} id="NodeManage">
            <Card title={'升级进度 - ' + this.state.imei} id="nodeManage">
              <div style={{ marginTop: 5 }}>
                <Progress type="circle" percent={this.state.rate} status={this.state.status} />
                <p>{this.state.tip}</p>
              </div>
            </Card>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default App;