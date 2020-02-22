import React from "react";
import {
  Table, Layout, Card, Input, Modal, message, Select,
} from "antd";

import {
  getDeviceInfo,
  otaCommand,
  getFirmwareInfo
} from "../axios";
import "./issuanceOtaFile.css";

const { Content } = Layout;
const Option = Select.Option;
const InputGroup = Input.Group;



class App extends React.Component {
  state = {
    collapsed: false,
    otaInfoTableDataSource: [],
    otaModalVisible: null,
    selectedVersion: undefined,
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  componentWillMount() {
  }

  componentDidMount() {
    getDeviceInfo().then(res => {
      if(res.status === 500){
        message.error('请求失败');
        return;
      }
      if (res.data.status === 1) {
        let otaInfoTableDataSource = [];
        res.data.data.forEach(element => {
          let obj = {};
          obj.number = element.id;
          obj.key = element.id;
          obj.imei = element.imei;
          obj.imsi = element.imsi;
          obj.device_status = element.deviceStatus;
          obj.onlineTime = element.onlineTime;
          obj.requestId = element.requestId;
          otaInfoTableDataSource.push(obj);
        });
        this.setState({ otaInfoTableDataSource: otaInfoTableDataSource });
      } else {
        message.error('查询失败');
        return;
      }
    });


    //加载vertionList
    getFirmwareInfo().then(res => {
      if(res.status === 500){
        message.error('请求失败');
        return;
      }
      if (res.data.status === 1) {
        let version_list = [];
        res.data.data.forEach(element => {
          let obj = {};
          obj.firmwareId = element.firmwareId;
          obj.firmVersion = element.firmVersion;
          obj.fileName = element.fileName;

          version_list.push(obj);
        });
        const optionsdiv1 = version_list.map((item, i) => {
          return (
            <Option key={item.firmwareId} value={item.firmwareId.toString()}>{item.firmVersion} : {item.fileName}</Option>
          )
        });

        this.setState({
          options: optionsdiv1
        })

      } else {
        message.error('获取固件列表失败');
        return;
      }
    });

  }

  ota = (data) => {
    data = data.split(',');
    if (data[1] !== '在线') {
      message.error('该设备离线，请对在线设备进行操作！');
      return;
    }
    this.setState({
      otaModalVisible: true,
      selectImei: data[0]
    });
  }

  queryRate = (data) => {
    data = data.split(',');
    if (!data[1]) {
      message.error('该设备无正在进行的OTA进程，请前往历史纪录页面查询');
    } else {
      window.open('/app/otaRate?imei=' + data[0] + '?requestId=' + data[1]);
    }
  }

  otaModalHandleCancel = () => {
    this.setState({
      otaModalVisible: false,
      receiveId: null,
      sendID: null,
      selectedVersion: undefined,
      selectedMcu: undefined,
      selectedCan: undefined,
      selectedType: undefined
    });
  }

  otaModalHandleOk = () => {
    if ((!this.state.selectImei) ||
      (!this.state.receiveId) ||
      (!this.state.sendID) ||
      (!this.state.selectedVersion) ||
      (!this.state.selectedMcu) ||
      (!this.state.selectedCan) ||
      (!this.state.selectedType)
    ) {
      message.error('请将信息填完整！')
      return;
    }
    message.loading('命令下发需要一定时间，请勿重复点击确认按钮', 5)
    otaCommand([
      this.state.selectImei,
      this.state.receiveId,
      this.state.sendID,
      this.state.selectedVersion,
      this.state.selectedMcu,
      this.state.selectedCan,
      this.state.selectedType
    ]).then(res => {
      message.destroy();
      if(res.status === 500){
        message.error('请求失败');
        return;
      }
      if (res.data.status === 1) {
        message.success('命令下发成功')
        this.setState({
          otaModalVisible: false,
          receiveId: null,
          sendID: null,
          selectedVersion: undefined,
          selectedMcu: undefined,
          selectedCan: undefined,
          selectedType: undefined
        });
        getDeviceInfo().then(res => {
          if (res.data.status === 1) {
            let otaInfoTableDataSource = [];
            res.data.data.forEach(element => {
              let obj = {};
              obj.number = element.id;
              obj.key = element.id;
              obj.imei = element.imei;
              obj.imsi = element.imsi;
              obj.device_status = element.deviceStatus;
              obj.onlineTime = element.onlineTime;
              obj.requestId = element.requestId;
              otaInfoTableDataSource.push(obj);
            });
            this.setState({ otaInfoTableDataSource: otaInfoTableDataSource });
          } else {
            message.error('查询失败');
            return;
          }
        });
      } else {
        message.error('命令下发失败');
        return;
      }
    });
  }

  defaultMCU = (event) => {
    this.setState({ selectedMcu: event })
    if (event === '单通道控制器') {
      this.setState({ receiveId: "c6" })
      this.setState({ sendID: "62" })
    }
    else if (event === '双通道控制器') {
      this.setState({ receiveId: "c8", sendID: "64" })
    }
    else if (event === '中央控制器') {
      this.setState({ receiveId: "c4", sendID: "60" })
    }
  }


  render() {
    const otaInfoTableColumns = [
      {
        title: "设备编号",
        dataIndex: "number",
        key: "number"
      },
      {
        title: "IMEI",
        dataIndex: "imei",
        key: "imei"
      },
      {
        title: "IMSI",
        dataIndex: "imsi",
        key: "imsi"
      },
      {
        title: "设备状态",
        dataIndex: "device_status",
        key: "device_status"
      },
      {
        title: "OTA",
        dataIndex: "ota_command",
        key: "ota_command",
        render: (text, record, index) => {
          return <span><a
            data-index={[record.imei, record.device_status]}
            onClick={(e) => { this.ota(e.target.getAttribute('data-index')) }}
          >
            固件命令下发
          </a></span>
        }
      },
      {
        title: "OTA进度",
        dataIndex: "rate",
        key: "rate",
        render: (text, record, index) => {
          return <span><a
            data-index={[record.imei, record.requestId]}
            onClick={(e) => { this.queryRate(e.target.getAttribute('data-index')) }}
          // href={'/app/otaRate?imei=' + record.imei + '?requestId=' + record.requestId}
          // target='_blank'
          >
            进度查询
          </a></span>
        }
      }
    ];
    return (
      <Layout style={{ minHeight: "100vh" }}>

        <Layout>
          <Content style={{ margin: "16px 16px" }} id="NodeManage">
            <Card title="OTA命令下发" id="nodeManage">
              <div style={{ marginTop: 5 }}>
                <Table
                  dataSource={this.state.otaInfoTableDataSource}
                  columns={otaInfoTableColumns}
                />
              </div>
              <div id="uploadFile">
                <Modal
                  title="下发OTA命令"
                  visible={this.state.otaModalVisible}
                  onOk={this.otaModalHandleOk}
                  onCancel={this.otaModalHandleCancel}
                  cancelText="关闭"
                  okText="确定"
                >
                  <InputGroup compact>
                    <Input
                      style={{ width: 120, textAlign: 'center' }}
                      defaultValue="IMEI"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: 250 }}
                      value={this.state.selectImei}
                      disabled={true}
                    />
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: 120, textAlign: 'center' }}
                      defaultValue="固件版本"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Select placeholder="请选择固件版本" style={{ width: 250 }} value={this.state.selectedVersion} onChange={e => { this.setState({ selectedVersion: e }) }}>
                      {this.state.options}
                    </Select>
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: 120, textAlign: 'center' }}
                      defaultValue="MCU类型"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Select placeholder="请选择MCU类型" value={this.state.selectedMcu} style={{ width: 250 }} onChange={this.defaultMCU}>
                      <Option value="单通道控制器">单通道控制器</Option>
                      <Option value="双通道控制器">双通道控制器</Option>
                      <Option value="中央控制器">中央控制器</Option>
                    </Select>
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: 120, textAlign: 'center' }}
                      defaultValue="接收ID"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: 250 }}
                      placeholder="请输入接收ID"
                      value={this.state.receiveId}
                      prefix='0x'
                      onChange={e => {
                        this.setState({ receiveId: e.target.value });
                      }}
                    />
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: 120, textAlign: 'center' }}
                      defaultValue="发送ID"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: 250 }}
                      placeholder="请输入发送ID"
                      value={this.state.sendID}
                      prefix='0x'
                      onChange={e => {
                        this.setState({ sendID: e.target.value });
                      }}
                    />
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: 120, textAlign: 'center' }}
                      defaultValue="CAN接口"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Select placeholder="请选择CAN接口" value={this.state.selectedCan} style={{ width: 250 }} onChange={e => { this.setState({ selectedCan: e }) }}>
                      <Option value="1"> 1 </Option>
                      <Option value="2"> 2 </Option>
                    </Select>
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: 120, textAlign: 'center' }}
                      defaultValue="升级方式"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Select placeholder="请选择升级方式" value={this.state.selectedType} style={{ width: 250 }} onChange={e => { this.setState({ selectedType: e }) }}>
                      <Option value="66">在线</Option>
                      <Option value="23">离线</Option>
                    </Select>
                  </InputGroup>
                </Modal>
              </div>
            </Card>
          </Content>

        </Layout>
      </Layout>
    );
  }
}

export default App;
