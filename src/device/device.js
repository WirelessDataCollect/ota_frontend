import React from "react";
import {
  Table,
  Layout,
  Card,
  Input,
  Modal,
  message,
} from "antd";

import {
  getDeviceInfo
} from "../axios";
import "./device.css";

const { Content } = Layout;


const InputGroup = Input.Group;

const nodeInfoTableColumns = [
  {
    title: "设备ID",
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
    title: "最后上线时间",
    dataIndex: "onlineTime",
    key: "onlineTime"
  }
];

class App extends React.Component {
  state = {
    collapsed: false,
    nodeNameSelected: [],
    nodeInfoTableDataSource: [],
    addNodeModalVisible: false
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  componentWillMount() { }

  componentDidMount() {
    getDeviceInfo().then(res => {
      if(res.status === 500){
        message.error('请求失败');
        return;
      }
      if (res.data.status === 1) {
        let nodeInfoTableDataSource = [];
        res.data.data.forEach(element => {
          let obj = {};
          obj.number = element.imei.substring(element.imei.length - 6);
          obj.key = element.id;
          obj.imei = element.imei;
          obj.imsi = element.imsi;
          obj.device_status = element.deviceStatus;
          obj.onlineTime = element.onlineTime;
          nodeInfoTableDataSource.push(obj);
        });
        this.setState({ nodeInfoTableDataSource: nodeInfoTableDataSource });
      } else {
        message.error('查询失败');
        return;
      }
    });
  }

  // addNodeModel = () => {
  //   this.setState({ addNodeModalVisible: true });
  // };

  // addNodeModalHandleOk = () => {
  //   if (
  //     !this.state.addNodeImeiInput ||
  //     this.state.addNodeImeiInput === "" ||
  //     !this.state.addNodeImsiInput ||
  //     this.state.addNodeImsiInput === "" ||
  //     !this.state.addNodeGardenIDInput
  //   ) {
  //     message.error("请输入完整信息！");
  //   } else {
  //     addNode([
  //       this.state.addNodeImeiInput,
  //       this.state.addNodeImsiInput
  //     ]).then(res => {
  //       if (res.data.success) {
  //         message.success("添加成功！");
  //         console.log(this.state.addNodeGardenIDInput)
  //         let date = new Date();
  //         let line = {
  //           key: this.state.nodeInfoTableDataSource.length,
  //           imei: this.state.addNodeImeiInput,
  //           imsi: this.state.addNodeImsiInput,
  //           create_time:
  //             date.getFullYear() +
  //             "-" +
  //             date.getMonth() +
  //             "-" +
  //             date.getDay() +
  //             " " +
  //             date.getHours() +
  //             ":" +
  //             date.getMinutes() +
  //             ":" +
  //             date.getSeconds()
  //         };
  //         {
  //           let tempData = [...this.state.nodeInfoTableDataSource];
  //           tempData.unshift(line);
  //           console.log(tempData)
  //           this.setState({
  //             nodeInfoTableDataSource: tempData,
  //             addNodeImeiInput: null,
  //             addNodeImsiInput: null
  //           });
  //         }
  //       } else {
  //         message.error("添加失败！");
  //       }
  //       this.setState({ addNodeModalVisible: false });
  //       this.setState({
  //         addNodeImeiInput: null,
  //         addNodeImsiInput: null
  //       });
  //     });
  //   }
  // };

  // addNodeModalHandleCancel = () => {
  //   this.setState({ addNodeModalVisible: false });
  //   this.setState({
  //     addNodeImeiInput: null,
  //     addNodeImsiInput: null
  //   });
  // };

  // deleteNodeModel = () => {
  //   this.setState({ deleteNodeModalVisible: true });
  // };

  // deleteNodeModalHandleOk = () => {
  //   deleteNode([JSON.stringify(this.state.nodeNameSelected), userID]).then(res => {
  //     console.log(res)
  //     if (res.data.success) {
  //       message.success("删除成功！");
  //       let temp = [];
  //       for (let i = 0; i < this.state.nodeNameSelected.length; i++) {
  //         temp = this.state.nodeInfoTableDataSource.filter(
  //           item => item.imei !== this.state.nodeNameSelected[i]
  //         );
  //         this.setState({ nodeInfoTableDataSource: temp });
  //       }
  //     } else {
  //       message.error("删除失败！");
  //     }
  //     this.setState({ deleteNodeModalVisible: false });
  //   });
  // };

  // deleteNodeModalHandleCancel = () => {
  //   this.setState({ deleteNodeModalVisible: false });
  // };

  // dataInfoTableRowSelection = {
  //   onChange: (selectedRowKeys, selectedRows) => {
  //     let nodeNameList = selectedRows.map(row => row.imei);
  //     this.setState({ nodeNameSelected: nodeNameList }, () => {
  //       if (this.state.nodeNameSelected.length === 0) {
  //         this.setState({
  //           deleteNodeDisabled: true,
  //           frequencyChangeDisabled: true
  //         });
  //       } else {
  //         this.setState({
  //           deleteNodeDisabled: false,
  //           frequencyChangeDisabled: false
  //         });
  //       }
  //     });
  //   }
  // };

  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>

        <Layout>
          <Content style={{ margin: "16px 16px" }} id="NodeManage">
            <Card title="设备管理" id="nodeManage">
              {/* <div className="gutter-example-nodemanage">
                <Row>
                  <Col className="gutter-row-nodemanage" span={6}>
                    <div className="gutter-box-nodemanage">
                      <div>
                        <Button type="primary" onClick={this.addNodeModel}>
                          添加
                        </Button>
                        <Button
                          disabled={this.state.deleteNodeDisabled}
                          onClick={this.deleteNodeModel}
                          style={{ marginLeft: 10 }}
                        >
                          删除
                        </Button>
                        <Modal
                          title="提示"
                          visible={this.state.deleteNodeModalVisible}
                          onOk={this.deleteNodeModalHandleOk}
                          onCancel={this.deleteNodeModalHandleCancel}
                          cancelText="取消"
                          okText="确定"
                        >
                          <p>确定删除选中节点吗？</p>
                        </Modal>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div> */}
              <div style={{ marginTop: 5 }}>
                <Table
                  rowSelection={this.dataInfoTableRowSelection}
                  dataSource={this.state.nodeInfoTableDataSource}
                  columns={nodeInfoTableColumns}
                />
              </div>
              <div id="addNode">
                <Modal
                  title="添加设备"
                  visible={this.state.addNodeModalVisible}
                  onOk={this.addNodeModalHandleOk}
                  onCancel={this.addNodeModalHandleCancel}
                  cancelText="取消"
                  okText="确定"
                >
                  <InputGroup compact>
                    <Input
                      style={{ width: "15%" }}
                      defaultValue="IMEI"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: "85%" }}
                      placeholder="请输入15位IMEI号"
                      value={this.state.addNodeImeiInput}
                      onChange={e => {
                        this.setState({ addNodeImeiInput: e.target.value });
                      }}
                    />
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: "15%" }}
                      defaultValue="IMSI"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: "85%" }}
                      placeholder="请输入IMSI号"
                      value={this.state.addNodeImsiInput}
                      onChange={e => {
                        this.setState({ addNodeImsiInput: e.target.value });
                      }}
                    />
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
