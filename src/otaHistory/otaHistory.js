import React from "react";
import {
  Table,
  Layout,
  Row,
  Col,
  Card,
  Button,
  message,
  DatePicker,
  Select
} from "antd";

import {
  getDeviceInfo,
  queryhistory,
  getUserInfo
} from "../axios";
import "./otaHistory.css";

const { Content } = Layout;
const { RangePicker } = DatePicker;
const Option = Select.Option;
const role = localStorage.getItem('user_type');

const historyTableColumns = [
  {
    title: "设备ID",
    dataIndex: "device_id",
    key: "device_id"
  },
  {
    title: "IMEI",
    dataIndex: "imei",
    key: "imei"
  },
  {
    title: "固件名称",
    dataIndex: "ota_name",
    key: "ota_name"
  },
  {
    title: "固件版本号",
    dataIndex: "ota_version",
    key: "ota_version"
  },
  {
    title: "接收ID",
    dataIndex: "receiveid",
    key: "receiveid"
  },
  {
    title: "发送ID",
    dataIndex: "sendid",
    key: "sendid"
  },
  {
    title: "MCU类型",
    dataIndex: "mcu",
    key: "mcu"
  },
  {
    title: "CAN端口",
    dataIndex: "can",
    key: "can"
  },
  {
    title: "升级模式",
    dataIndex: "type",
    key: "type"
  },
  {
    title: "升级结果",
    dataIndex: "result",
    key: "result"
  },
  {
    title: "升级下发时间",
    dataIndex: "upgrade_time",
    key: "upgrade_time"
  },
  {
    title: "升级结束时间",
    dataIndex: "upgrade_end_time",
    key: "upgrade_end_time"
  }
];

class App extends React.Component {
  state = {
    collapsed: false,
    historyTableDataSource: [],
    user_option: null,
    device_option: null,
    selectedImei: '',
    selectedUser: '',
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
        let device_list = [];
        res.data.data.forEach(element => {
          let obj = {};
          obj.key = element.imei;
          obj.value = element.imei;
          device_list.push(obj);
        });
        const optionsdiv1 = device_list.map((item, i) => {
          return (
            <Option key={item.key} value={item.key}>{item.key}</Option>
          )
        });
        let optionsdiv = (
          <Select placeholder="请选择设备" style={{ width: 170 }} onChange={e => { this.setState({ selectedImei: e }) }}>
            <Option key={'all_device'} value={''}>全部设备</Option>
            {optionsdiv1}
          </Select>
        );
        this.setState({
          device_option: optionsdiv
        })
      } else {
        message.error('获取固件列表失败');
        return;
      }
    });

    // 管理远用户获取用户列表
    role === 'ADMIN' && getUserInfo().then(res => {
      if (res.data.status === 1) {
        let user_list = [];
        res.data.data.forEach(element => {
          let obj = {};
          obj.key = element.gid;
          obj.label = element.username;
          user_list.push(obj);
        });
        const optionsdiv1 = user_list.map((item, i) => {
          return (
            <Option key={item.key} value={item.label}>{item.label}</Option>
          )
        });
        let optionsdiv = (
          <Select placeholder="请选择用户" style={{ width: 170 }} onChange={e => { this.setState({ selectedUser: e }) }}>
            <Option key={'all_user'} value={''}>全部用户</Option>            
            {optionsdiv1}
          </Select>
        );
        this.setState({
          user_option: optionsdiv
        })
      } else {
        message.error('获取固件列表失败');
        return;
      }
    });

    // 获取默认一周或一个月的记录
    let starttime = new Date();
    let endtime = new Date();
    starttime.setDate(endtime.getDate()-7);
    let pad = n => n < 10 ? `0${n}` : n;
    let start_time = `${starttime.getFullYear()}-${pad(starttime.getMonth() + 1)}-${pad(starttime.getDate())} 00:00:00`;
    let end_time = `${endtime.getFullYear()}-${pad(endtime.getMonth() + 1)}-${pad(endtime.getDate())} 23:59:59`;

    queryhistory(['', start_time, end_time, '']).then(res => {
      if(res.status === 500){
        message.error('请求失败');
        return;
      }
      if (res.data.status === 1) {
        let historyTableDataSource = [];
        res.data.data.forEach(element => {
          let obj = {};
          obj.device_id = element.imei.substring(element.imei.length - 6);
          obj.imei = element.imei;
          obj.result = element.loadStatus.code == '66' ? '成功' : element.loadStatus.status;
          obj.can = element.configBO.cannum;
          obj.mcu = element.configBO.mcuType;
          obj.ota_version = element.configBO.fotaImages.firmVersion;
          obj.ota_name = element.configBO.fotaImages.fileName;
          obj.type = element.configBO.measure == 66 ? '在线' : '离线';
          obj.sendid = element.configBO.sendID;
          obj.receiveid = element.configBO.recID;
          obj.upgrade_time = element.upgradeStartTime;
          obj.upgrade_end_time = element.upgradeEndTime;
          historyTableDataSource.push(obj);
        });

        this.setState({
          historyTableDataSource
        });
      } else {
        message.error('获取固件列表失败');
        return;
      }
    });
  }

  query = () => {
    console.log(this.state.start_date)
    if (!this.state.start_date) {
      message.error('请选择时间后查询！');
      return;
    }
    let starttime = new Date(this.state.start_date);
    let endtime = new Date(this.state.end_date);
    let pad = n => n < 10 ? `0${n}` : n;
    let start_time = `${starttime.getFullYear()}-${pad(starttime.getMonth() + 1)}-${pad(starttime.getDate())} 00:00:00`;
    let end_time = `${endtime.getFullYear()}-${pad(endtime.getMonth() + 1)}-${pad(endtime.getDate())} 23:59:59`;

    queryhistory([this.state.selectedImei, start_time, end_time, this.state.selectedUser]).then(res => {
      if(res.status === 500){
        message.error('请求失败');
        return;
      }
      if (res.data.status === 1) {
        let historyTableDataSource = [];
        res.data.data.forEach(element => {
          let obj = {};
          obj.device_id = element.imei.substring(element.imei.length - 6);
          obj.imei = element.imei;
          obj.result = element.loadStatus.code == '66' ? '成功' : element.loadStatus.status;
          obj.can = element.configBO.cannum;
          obj.mcu = element.configBO.mcuType;
          obj.ota_version = element.configBO.fotaImages.firmVersion;
          obj.ota_name = element.configBO.fotaImages.fileName;
          obj.type = element.configBO.measure == 66 ? '在线' : '离线';
          obj.sendid = element.configBO.sendID;
          obj.receiveid = element.configBO.recID;
          obj.upgrade_time = element.upgradeStartTime;
          obj.upgrade_end_time = element.upgradeEndTime;
          historyTableDataSource.push(obj);
        });

        this.setState({
          historyTableDataSource: historyTableDataSource
        });
      } else {
        message.error('获取固件升级历史记录失败');
        return;
      }
    });
  }

  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>

        <Layout>
          <Content style={{ margin: "16px 16px" }} id="NodeManage">
            <Card title="OTA历史纪录" id="nodeManage">
              <div style={{ marginTop: 5 }}>
                <Row>
                  <Col span={4}>
                    {this.state.device_option}
                  </Col>
                  <Col span={4}>
                    {this.state.user_option}
                  </Col>
                  <Col span={6}>
                    <RangePicker onChange={(e) => { this.setState({ start_date: e[0]._d, end_date: e[1]._d }) }}/>
                  </Col>
                  <Col span={1}>
                  </Col>
                  <Col span={3}>
                    <Button onClick={this.query} type='primry'>查询</Button>
                  </Col>
                </Row>
              </div>
              <div style={{ marginTop: 5 }}>
                <Table
                  dataSource={this.state.historyTableDataSource}
                  columns={historyTableColumns}
                />
              </div>
            </Card>
          </Content>

        </Layout>
      </Layout>
    );
  }
}

export default App;
