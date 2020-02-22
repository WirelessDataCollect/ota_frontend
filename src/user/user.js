import React from "react";
import {
  Table,
  Layout,
  Row,
  Col,
  Card,
  Button,
  Input,
  Modal,
  message,
  Select,
} from "antd";

import {
  getUserInfo,
  addUser,
  deleteUser
} from "../axios";
import "./user.css";

const { Content } = Layout;
const Option = Select.Option;
const InputGroup = Input.Group;
const nodeInfoTableColumns = [
  {
    title: "编号",
    dataIndex: "gid",
    key: "gid"
  },
  {
    title: "用户名",
    dataIndex: "username",
    key: "username"
  },
  {
    title: "电话",
    dataIndex: "phone",
    key: "phone"
  },
  {
    title: "真实姓名",
    dataIndex: "realname",
    key: "realname"
  },
  {
    title: "邮箱",
    dataIndex: "email",
    key: "email"
  },
  {
    title: "详情",
    dataIndex: "info",
    key: "info"
  }
];

class App extends React.Component {
  state = {
    collapsed: false,
    userIdSelected: [],
    userInfoTableDataSource: [],
    addUserModalVisible: false,
    deleteUserDisabled: true
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  componentWillMount() { }

  componentDidMount() {
    getUserInfo().then(res => {
      if (res.data.status === 1) {
        let userInfoTableDataSource = [];
        res.data.data.forEach(element => {
          let obj = {};
          obj.gid = element.gid;
          obj.key = element.gid;
          obj.username = element.username;
          obj.phone = element.phone;
          obj.realname = element.realname;
          obj.email = element.email;
          obj.info = element.info;
          userInfoTableDataSource.push(obj);
        });
        this.setState({ userInfoTableDataSource: userInfoTableDataSource });
      } else {
        message.error('查询失败');
        return;
      }
    });
  }

  addUserModel = () => {
    this.setState({ addUserModalVisible: true });
  };

  addUserModalHandleOk = () => {
    if (
      !this.state.addUserUsername ||
      this.state.addUserPassword === "" ||
      !this.state.addUserPhone ||
      this.state.addUserRealname === "" ||
      !this.state.addUserEmail ||
      !this.state.addUserInfo ||
      !this.state.addUserRoleids
    ) {
      message.error("请输入完整信息！");
    } else {
      addUser([
        this.state.addUserUsername,
        this.state.addUserPassword,
        this.state.addUserRealname,
        this.state.addUserPhone,
        this.state.addUserEmail,
        this.state.addUserInfo,
        this.state.addUserRoleids
      ]).then(res => {
        if (res.data.status === 1) {
          message.success("添加成功！");
          getUserInfo().then(res => {
            if (res.data.status === 1) {
              let userInfoTableDataSource = [];
              res.data.data.forEach(element => {
                let obj = {};
                obj.gid = element.gid;
                obj.key = element.gid;
                obj.username = element.username;
                obj.phone = element.phone;
                obj.realname = element.realname;
                obj.email = element.email;
                obj.info = element.info;
                userInfoTableDataSource.push(obj);
              });
              this.setState({ userInfoTableDataSource: userInfoTableDataSource });
            } else {
              message.error('添加失败，该用户名已被使用');
              return;
            }
          });
        } else {
          message.error("添加失败！");
        }
        this.setState({ addUserModalVisible: false });
        this.setState({
          addUserUsername: null,
          addUserPassword: null,
          addUserRealname: null,
          addUserPhone: null,
          addUserEmail: null,
          addUserInfo: null,
          addUserRoleids: null
        });
      });
    }
  };

  addUserModalHandleCancel = () => {
    this.setState({ addUserModalVisible: false });
    this.setState({
      addUserUsername: null,
      addUserPassword: null,
      addUserRealname: null,
      addUserPhone: null,
      addUserEmail: null,
      addUserInfo: null,
      addUserRoleids: null
    });
  };

  deleteNodeModel = () => {
    this.setState({ deleteNodeModalVisible: true });
  };

  deleteNodeModalHandleOk = () => {
    if (this.state.userIdSelected.length !== 1) {
      message.error('不可批量删除用户，请选择一位用户');
      return;
    }
    if (this.state.userIdSelected.length !== 1) {
      message.error('不可批量删除用户，请选择一位用户');
      return;
    }
    deleteUser([this.state.userIdSelected[0]]).then(res => {
      if (res.data.status === 1) {
        message.success("删除成功！");
        getUserInfo().then(res => {
          if (res.data.status === 1) {
            let userInfoTableDataSource = [];
            res.data.data.forEach(element => {
              let obj = {};
              obj.gid = element.gid;
              obj.key = element.gid;
              obj.username = element.username;
              obj.phone = element.phone;
              obj.realname = element.realname;
              obj.email = element.email;
              obj.info = element.info;
              userInfoTableDataSource.push(obj);
            });
            this.setState({ userInfoTableDataSource: userInfoTableDataSource });
          } else {
            message.error('查询失败');
            return;
          }
        });
      } else {
        message.error("删除失败！");
      }
      this.setState({ deleteNodeModalVisible: false });
    });
  };

  deleteNodeModalHandleCancel = () => {
    this.setState({ deleteNodeModalVisible: false });
  };

  dataInfoTableRowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(selectedRows)
      if (selectedRows.length < 1) {
        this.setState({ deleteUserDisabled: true })
      }else{
        this.setState({ deleteUserDisabled: false })
      }
      let re = [];
      selectedRows.forEach(ele => {
        re.push(ele.gid)
      })
      this.setState({ userIdSelected: re });
    }
  };

  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Layout>
          <Content style={{ margin: "16px 16px" }} id="NodeManage">
            <Card title="用户管理" id="nodeManage">
              <div className="gutter-example-nodemanage">
                <Row>
                  <Col className="gutter-row-nodemanage" span={6}>
                    <div className="gutter-box-nodemanage">
                      <div>
                        <Button type="primary" onClick={this.addUserModel}>
                          添加
                        </Button>
                        <Button
                          disabled={this.state.deleteUserDisabled}
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
                          <p>确定删除选中用户吗？</p>
                        </Modal>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
              <div style={{ marginTop: 5 }}>
                <Table
                  rowSelection={this.dataInfoTableRowSelection}
                  dataSource={this.state.userInfoTableDataSource}
                  columns={nodeInfoTableColumns}
                />
              </div>
              <div id="addUser">
                <Modal
                  title="添加用户"
                  visible={this.state.addUserModalVisible}
                  onOk={this.addUserModalHandleOk}
                  onCancel={this.addUserModalHandleCancel}
                  cancelText="取消"
                  okText="确定"
                >
                  <InputGroup compact>
                    <Input
                      style={{ width: "20%" }}
                      defaultValue="用户名"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: "80%" }}
                      placeholder="请输入用户名"
                      value={this.state.addUserUsername}
                      onChange={e => {
                        this.setState({ addUserUsername: e.target.value });
                      }}
                    />
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: "20%" }}
                      defaultValue="密码"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: "80%" }}
                      placeholder="请输入密码"
                      value={this.state.addUserPassword}
                      onChange={e => {
                        this.setState({ addUserPassword: e.target.value });
                      }}
                    />
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: "20%" }}
                      defaultValue="真实姓名"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: "80%" }}
                      placeholder="请输入真实姓名"
                      value={this.state.addUserRealname}
                      onChange={e => {
                        this.setState({ addUserRealname: e.target.value });
                      }}
                    />
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: "20%" }}
                      defaultValue="电话"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: "80%" }}
                      placeholder="请输入电话"
                      value={this.state.addUserPhone}
                      onChange={e => {
                        this.setState({ addUserPhone: e.target.value });
                      }}
                    />
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: "20%" }}
                      defaultValue="邮箱"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: "80%" }}
                      placeholder="请输入邮箱"
                      value={this.state.addUserEmail}
                      onChange={e => {
                        this.setState({ addUserEmail: e.target.value });
                      }}
                    />
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: "20%" }}
                      defaultValue="详情"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: "80%" }}
                      placeholder="请输入详情"
                      value={this.state.addUserInfo}
                      onChange={e => {
                        this.setState({ addUserInfo: e.target.value });
                      }}
                    />
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: "20%" }}
                      defaultValue="用户类型"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Select placeholder="请选择用户类型" style={{ width: '80%' }} onChange={e => { this.setState({ addUserRoleids: e }) }}>
                      <Option key={'5'} value={'5'}>超级管理员</Option>
                      <Option key={'3'} value={'3'}>普通用户</Option>
                    </Select>
                  </InputGroup>
                  <p style={{ color: 'red' }}>*请注意，用户名不可与已存在的用户名相同</p>

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
