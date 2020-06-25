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
import { Term, terms } from '@/db';
import { getStorage, saveStorage } from '@/storage';

interface State {
  terms: Term[];
  showModal: boolean;
  isAdd: boolean;
}

export default class extends React.Component<{}, State> {
  state: State = {
    terms: [],
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
      terms: terms.getItems(),
    });
  };

  onAdd = () => {
    this.formRef.current?.resetFields();
    this.setState({
      showModal: true,
      isAdd: true,
    });
  };

  onModify = async (term: Term) => {
    this.setState({
      showModal: true,
      isAdd: false,
    });
    while (!this.formRef.current) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    this.formRef.current?.setFieldsValue(term);
  };

  handleOk = async (values: any) => {
    message.loading({
      content: '处理中...',
      duration: 1,
    });
    if (this.state.isAdd) {
      terms.insert(values as Term);
    } else {
      terms.update(values as Term);
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
              title: '学期号',
              dataIndex: 'id',
              key: 'id',
            },
            {
              title: '学期名',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '操作',
              render: (record: Term) => {
                let t = getStorage('term');
                let canSet = record.id !== t?.id;
                return (
                  <div>
                    <Button type="dashed" onClick={() => this.onModify(record)}>
                      修改
                    </Button>
                    <Divider type="vertical" />
                    <Button
                      type="primary"
                      disabled={!canSet}
                      onClick={() => {
                        saveStorage('term', record);
                        this.forceUpdate();
                      }}
                    >
                      设为当前学期
                    </Button>
                  </div>
                );
              },
            },
          ]}
          dataSource={this.state.terms}
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
              label="学期号"
              name="id"
              rules={[{ required: true, message: '不能为空' }]}
            >
              <Input disabled={!this.state.isAdd} />
            </Form.Item>
            <Form.Item
              label="学期名"
              name="name"
              rules={[{ required: true, message: '学院名不能为空' }]}
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
