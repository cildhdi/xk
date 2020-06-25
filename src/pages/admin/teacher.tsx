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
  Select,
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import { User, users, Academy, academys } from '@/db';

const { Option } = Select;

interface State {
  users: User[];
  acadamys: Academy[];
  showModal: boolean;
  isAdd: boolean;
}

const roleName = '教师';

export default class extends React.Component<{}, State> {
  state: State = {
    users: [],
    showModal: false,
    acadamys: [],
    isAdd: true,
  };

  formRef = React.createRef<FormInstance>();

  componentDidMount = async () => {
    this.setState({
      users: users
        .getItems()
        .filter(v => (v.role === roleName ? v : undefined)),
      acadamys: academys.getItems(),
    });
  };

  onAdd = () => {
    this.formRef.current?.resetFields();
    this.setState({
      showModal: true,
      isAdd: true,
    });
  };

  onModify = async (user: User) => {
    this.setState({
      showModal: true,
      isAdd: false,
    });
    while (!this.formRef.current) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    this.formRef.current?.setFieldsValue(user);
  };

  handleOk = async (values: any) => {
    values.secret = values.username.toString();
    values.role = roleName;
    if (this.state.isAdd) {
      await users.insert(values as User);
    } else {
      await users.update(values as User);
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
              title: '工号',
              dataIndex: 'id',
              key: 'id',
            },
            {
              title: '姓名',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '学院',
              dataIndex: 'academy_id',
              key: 'academy_id',
              render: (v: number) => {
                let a = this.state.acadamys.find(i => i.id === v);
                return a?.name;
              },
            },
            {
              title: '登录名',
              dataIndex: 'username',
              key: 'username',
            },
            {
              title: '性别',
              dataIndex: 'sex',
              key: 'sex',
              filters: [
                {
                  text: '男',
                  value: '男',
                },
                {
                  text: '女',
                  value: '女',
                },
              ],
            },
            {
              title: '生日',
              dataIndex: 'birthday',
              key: 'birthday',
            },
            {
              title: '籍贯',
              dataIndex: 'birthplace',
              key: 'birthplace',
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
          dataSource={this.state.users}
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
              label="工号"
              name="id"
              rules={[{ required: true, message: '不能为空' }]}
            >
              <Input disabled={!this.state.isAdd} />
            </Form.Item>
            <Form.Item
              label="姓名"
              name="name"
              rules={[{ required: true, message: '姓名不能为空' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="登录名"
              name="username"
              rules={[{ required: true, message: '不能为空' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="academy_id"
              label="学院"
              rules={[{ required: true }]}
            >
              <Select placeholder="请选择学院" allowClear>
                {this.state.acadamys.map(v => (
                  <Option value={v.id}>{v.name}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="性别"
              name="sex"
              rules={[{ required: true, message: '性别不能为空' }]}
            >
              <Radio.Group>
                <Radio value="男">男</Radio>
                <Radio value="女">女</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="生日"
              name="birthday"
              rules={[{ required: true, message: '不能为空' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="籍贯"
              name="birthplace"
              rules={[{ required: true, message: '不能为空' }]}
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
