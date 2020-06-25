import React from 'react';
import {
  Table,
  message,
  Button,
  Divider,
  Modal,
  Form,
  Input,
  InputNumber,
  Radio,
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import { Academy, academys } from '@/db';

interface State {
  academys: Academy[];
  showModal: boolean;
  isAdd: boolean;
}

export default class extends React.Component<{}, State> {
  state = {
    academys: [],
    showModal: false,
    isAdd: true,
  };

  formRef = React.createRef<FormInstance>();

  componentDidMount = async () => {
    message.loading({
      content: '加载数据...',
      duration: 1,
    });
    this.setState({
      academys: academys.getItems(),
    });
  };

  onAdd = () => {
    this.formRef.current?.resetFields();
    this.setState({
      showModal: true,
      isAdd: true,
    });
  };

  onModify = async (academy: Academy) => {
    this.setState({
      showModal: true,
      isAdd: false,
    });
    while (!this.formRef.current) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    this.formRef.current?.setFieldsValue(academy);
  };

  handleOk = async (values: any) => {
    message.loading({
      content: '处理中...',
      duration: 1,
    });
    if (this.state.isAdd) {
      academys.insert(values as Academy);
    } else {
      academys.update(values as Academy);
    }
    this.setState({
      showModal: false,
    });
    this.componentDidMount();
  };

  handleCancel = async () => {
    this.setState({
      showModal: false,
    });
  };

  render() {
    return (
      <div>
        <Button type="primary" onClick={this.onAdd}>
          添加
        </Button>
        <Divider />
        <Table
          rowKey="id"
          columns={[
            {
              title: '学院号',
              dataIndex: 'id',
              key: 'id',
            },
            {
              title: '学院名',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '地址',
              dataIndex: 'addr',
              key: 'addr',
            },
            {
              title: '电话',
              dataIndex: 'phone',
              key: 'phone',
            },
            {
              title: '操作',
              render: record => (
                <Button type="dashed" onClick={() => this.onModify(record)}>
                  修改
                </Button>
              ),
            },
          ]}
          dataSource={this.state.academys}
        />
        <Modal
          title={this.state.isAdd ? '请填写信息' : '请修改信息'}
          visible={this.state.showModal}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={this.handleOk}
            ref={this.formRef}
          >
            <Form.Item
              label="学院号"
              name="id"
              rules={[{ required: true, message: '学院号不能为空' }]}
            >
              <Input disabled={!this.state.isAdd} />
            </Form.Item>
            <Form.Item
              label="学院名"
              name="name"
              rules={[{ required: true, message: '学院名不能为空' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="地址"
              name="addr"
              rules={[{ required: true, message: '地址不能为空' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="电话"
              name="phone"
              rules={[{ required: true, message: '电话不能为空' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 6 }}>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}
