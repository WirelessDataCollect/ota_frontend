import React, { Component } from 'react';
import { } from 'antd';
import './App.css';
import {
  Layout,
  Menu,
  Icon,
  message,
} from "antd";
import { Route, Switch, Link } from 'react-router-dom';
import device from "./device/device";
import otaHistory from "./otaHistory/otaHistory";
import uploadOtaFile from "./uploadOtaFile/uploadOtaFile";
import issuanceOtaFile from "./issuanceOtaFile/issuanceOtaFile";
import otaRate from "./otaRate/otaRate";
import user from "./user/user";
import {
  logoff
} from "./axios/index";
const { Content, Sider } = Layout;
const role = localStorage.getItem('user_type');

export default class App extends Component {
  state = {
    menuKey: null,
  };

  componentWillMount = () => {
    const pathname = window.location.pathname;
    console.log(pathname)
    this.setState({ menuKey: pathname});
  }

  componentDidMount = () => {
    document.title = "瑞立-OTA平台";
  }

  log_off = () => {
    logoff().then(res => {
      if (res.data.status === 1) {
        message.success("注销成功");
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("userID");
        localStorage.removeItem("user_type");
        setTimeout(function () {
          window.location.href = "/";
        }, 1000);
      } else {
        message.error("注销失败");
      }
    });
  }
  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
        >
          <Menu theme="dark" mode="inline" defaultSelectedKeys={[this.state.menuKey]}>
            <Menu.Item key="admin" disabled={true}>
              <Icon type="smile-o" />
              <span>你好，{localStorage.getItem("userID")}</span>
            </Menu.Item>
            <Menu.Item key="/app">
              <Link to="/app">
                <Icon type="setting" />
                <span>设备管理</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/app/uploadOtaFile">
              <Link to="/app/uploadOtaFile" >
                <Icon type="file" />
                <span>OTA文件管理</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/app/issuanceOtaFile">
              <Link to="/app/issuanceOtaFile">
                <Icon type="cloud-download" />
                <span>OTA命令下发</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/app/otaHistory">
              <Link to="/app/otaHistory">
                <Icon type="bars" />
                <span>OTA历史纪录</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/app/user" style={{ display: (role === 'ADMIN') ? 'block' : 'none' }}>
              <Link to="/app/user">
                <Icon type="user" />
                <span>账户管理</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="log_off">
              <span onClick={this.log_off}>
                <Icon type="swap-left" />
                <span>退出登陆</span>
              </span>
            </Menu.Item>
          </Menu>
        </Sider>

        <Layout >
          <Content id="Farmer">
            <Switch>
              <Route exact path='/app' component={device} />
              <Route path="/app/uploadOtaFile" component={uploadOtaFile} />
              <Route path="/app/issuanceOtaFile" component={issuanceOtaFile} />
              <Route path="/app/otaHistory" component={otaHistory} />
              <Route path="/app/otaRate" component={otaRate} />
              <Route path="/app/user" component={user} />
            </Switch>
          </Content>
          {/* <Footer style={{ textAlign: "center" }}>
            SORL ©2018 Created by Zhejiang University
          </Footer> */}
        </Layout>
      </Layout>



    )
  }
}