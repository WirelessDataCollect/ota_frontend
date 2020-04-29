import React from "react";
import { Upload, Table, Layout, Row, Col, Card, Button, Input, Modal, message, Icon, Select } from "antd";
import {
  fileinfoUpload,
  getFirmwareInfo,
  deletebyfirmwareid
} from "../axios";
import "./uploadOtaFile.css";
import * as config from "../axios/config.js";

const { Content } = Layout;
const Option = Select.Option;
const InputGroup = Input.Group;
const nodeInfoTableColumns = [
  {
    title: "固件名称",
    dataIndex: "firmwareName",
    key: "firmwareName"
  },
  {
    title: "固件版本号",
    dataIndex: "firmVersion",
    key: "firmVersion"
  },
  {
    title: "目标设备",
    dataIndex: "mcuType",
    key: "mcuType"
  },
  {
    title: "上传者",
    dataIndex: "uploader",
    key: "uploader"
  },
  {
    title: "联系方式",
    dataIndex: "uploaderTel",
    key: "uploaderTel"
  },
  {
    title: "固件信息说明",
    dataIndex: "content",
    key: "content"
  }
];


var fileID = null;
const props = {
  name: 'file',
  action: config.requestIp + '/firmware/upload',
  body: {
    access_token: localStorage.getItem('access_token')
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      // console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      // console.log(info)
      message.success(`${info.file.name} 文件上传成功`);
      fileID = info.file.response.data.firmwareId;

    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败`);
    }
  },
};


class App extends React.Component {
  state = {
    uploadName: null,
    uploadNumber: null,
    uploadVersionNumber: null,
    uploadInfo: null,
    uploading: false,
    fileList: [],
    deleteNodeDisabled: false,
    uploadMcu: undefined
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  componentDidMount() {
    getFirmwareInfo().then(res => {
      if(res.status === 500){
        message.error('请求失败');
        return;
      }
      if (res.data.status === 1) {
        let nodeInfoTableDataSource = [];
        res.data.data.forEach(element => {
          let obj = {};
          obj.firmwareId = element.firmwareId;
          obj.uploader = element.uploader;
          obj.uploaderTel = element.uploaderTel;
          obj.firmVersion = element.firmVersion;
          obj.content = element.content;
          obj.key = element.firmwareId;
          obj.mcuType = element.mcuType;
          obj.firmwareName = element.fileName;

          nodeInfoTableDataSource.push(obj);
        });
        this.setState({ nodeInfoTableDataSource: nodeInfoTableDataSource });
      } else {
        message.error('查询失败');
        return;
      }
    });
  }

  uploadFileModel = () => {
    this.setState({ uploadFileModalVisible: true });
  };

  uploadFileModalHandleCancel = () => {
    this.setState({
      uploadFileModalVisible: false,
      uploadName: null,
      uploadNumber: null,
      uploadVersionNumber: null,
      uploadInfo: null,
      uploadMcu: undefined
    });
  };

  uploadFileModalHandleOk = () => {
    if (!this.state.uploadVersionNumber || !this.state.uploadInfo || !this.state.uploadMcu || !this.state.uploadName) {
      message.error('请先补全信息！');
      return
    }
    if (fileID == null) {
      message.error('请先上传文件！');
      return
    } else {
      fileinfoUpload([this.state.uploadVersionNumber, this.state.uploadInfo, fileID, this.state.uploadMcu, this.state.uploadName]).then(res => {
        if(res.status === 500){
          message.error('请求失败');
          return;
        }
        if (res.data.status === 1) {
          message.success('上传成功');
          fileID = null;
          this.setState({
            uploadFileModalVisible: false,
            uploadVersionNumber: null,
            uploadInfo: null,
            uploadMcu: undefined,
            uploadName: null,
            fileList: [],
          });
          getFirmwareInfo().then(res => {
            if(res.status === 500){
              message.error('请求失败');
              return;
            }
            if (res.data.status === 1) {
              let nodeInfoTableDataSource = [];
              res.data.data.forEach(element => {
                let obj = {};
                obj.firmwareId = element.firmwareId;
                obj.uploader = element.uploader;
                obj.uploaderTel = element.uploaderTel;
                obj.firmVersion = element.firmVersion;
                obj.content = element.content;
                obj.key = element.firmwareId;
                obj.firmwareName = element.fileName;
                nodeInfoTableDataSource.push(obj);
              });
              this.setState({ nodeInfoTableDataSource: nodeInfoTableDataSource });
            } else {
              message.error('查询失败');
              return;
            }
          });
        } else {
          message.error('上传失败');
          return;
        }
      });
    }
  }

  dataInfoTableRowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      if (selectedRows.length !== 0) {
        this.setState({
          deleteNodeDisabled: false,
          selectedId: selectedRowKeys,
          // selectedLength: selectedRows.length
        });
      }
    }
    
  };

  deleteNodeModel = () => {
    this.setState({ deleteNodeModalVisible: true });
  };

  deleteNodeModalHandleOk = () => {
    // if (this.state.selectedLength > 1) {
    //   message.error('每次只能删除一个固件，请勿多选！');
    //   return;
    // 
    deletebyfirmwareid(this.state.selectedId.join(',')).then(res => {
      console.log(res)
      if(res.status === 500){
        message.error('您不是该固件的上传者，不可删除');
        this.setState({ deleteNodeModalVisible: false });
        return;
      }
      if (res.data.status === 1) {
        message.success('删除成功！');
        this.setState({ deleteNodeModalVisible: false, selectedId: null });
        getFirmwareInfo().then(res => {
          if (res.data.status === 1) {
            let nodeInfoTableDataSource = [];
            res.data.data.forEach(element => {
              let obj = {};
              obj.firmwareId = element.firmwareId;
              obj.uploader = element.uploader;
              obj.uploaderTel = element.uploaderTel;
              obj.firmVersion = element.firmVersion;
              obj.content = element.content;
              obj.key = element.firmwareId;
              obj.firmwareName = element.fileName;
              nodeInfoTableDataSource.push(obj);
            });
            this.setState({ nodeInfoTableDataSource: nodeInfoTableDataSource });
          } else {
            message.error('查询失败');
            return;
          }
        });
      } else {
        message.error('删除失败');
        this.setState({ deleteNodeModalVisible: false, selectedId: null });
        return;
      }
    });
  }

  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>

        <Layout>
          <Content style={{ margin: "16px 16px" }} id="NodeManage">
            <Card title="OTA文件管理" id="nodeManage">
              <div className="gutter-example-nodemanage">
                <Row>
                  <Col className="gutter-row-nodemanage" span={6}>
                    <div className="gutter-box-nodemanage">
                      <div>
                        <Button type="primary" onClick={this.uploadFileModel}>
                          上传
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
                          onCancel={() => { this.setState({ deleteNodeModalVisible: false }) }}
                          cancelText="取消"
                          okText="确定"
                        >
                          <p>确定删除选中的固件吗？</p>
                        </Modal>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
              <div style={{ marginTop: 20 }}>
                <Table
                  rowSelection={this.dataInfoTableRowSelection}
                  dataSource={this.state.nodeInfoTableDataSource}
                  columns={nodeInfoTableColumns}
                />
              </div>
              <div id="uploadFile">
                <Modal
                  title="上传文件"
                  visible={this.state.uploadFileModalVisible}
                  onOk={this.uploadFileModalHandleOk}
                  onCancel={this.uploadFileModalHandleCancel}
                  cancelText="关闭"
                  okText="确定"
                >
                  <InputGroup compact>
                    <Input
                      style={{ width: 120, textAlign: 'center' }}
                      defaultValue="固件名"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: 250 }}
                      placeholder="请输入固件名"
                      value={this.state.uploadName}
                      onChange={e => {
                        this.setState({ uploadName: e.target.value });
                      }}
                    />
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: 120, textAlign: 'center' }}
                      defaultValue="固件版本号"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: 250 }}
                      placeholder="请输入固件版本号"
                      value={this.state.uploadVersionNumber}
                      onChange={e => {
                        this.setState({ uploadVersionNumber: e.target.value });
                      }}
                    />
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: 120, textAlign: 'center' }}
                      defaultValue="MCU类型"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Select placeholder="请选择MCU类型" value={this.state.uploadMcu} style={{ width: 250 }} onChange={e => { this.setState({ uploadMcu: e }) }}>
                      <Option value="单通道控制器">单通道控制器</Option>
                      <Option value="双通道控制器">双通道控制器</Option>
                      <Option value="中央控制器">中央控制器</Option>
                    </Select>
                  </InputGroup>
                  <InputGroup compact>
                    <Input.TextArea
                      style={{ width: 120, textAlign: 'center', resize: 'none' }}
                      defaultValue="固件信息说明"
                      disabled={true}
                      rows={2}
                      className="inputTitle"
                    />
                    <Input.TextArea
                      style={{ width: 250, resize: 'none' }}
                      rows={2}
                      placeholder="请输入固件信息说明"
                      value={this.state.uploadInfo}
                      onChange={e => {
                        this.setState({ uploadInfo: e.target.value });
                      }}
                    />
                  </InputGroup>
                  <InputGroup compact>
                    <div className="uploadFileDiv">
                      <Upload {...props}>
                        <Button>
                          <Icon type="upload" /> 上传文件
                        </Button>
                      </Upload>
                    </div>
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
