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
import { Course, courses, Academy, academys } from '@/db';
import { getStorage, saveStorage } from '@/storage';

const { Option } = Select;

interface State {
  courses: Course[];
  acadamys: Academy[];
  showModal: boolean;
  isAdd: boolean;
}

export default class extends React.Component<{}, State> {
  state: State = {
    courses: [],
    showModal: false,
    acadamys: [],
    isAdd: true,
  };

  formRef = React.createRef<FormInstance>();

  componentDidMount = async () => {
    this.setState({
      courses: courses.getItems(),
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

  onModify = async (course: Course) => {
    this.setState({
      showModal: true,
      isAdd: false,
    });
    while (!this.formRef.current) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    this.formRef.current?.setFieldsValue(course);
  };

  handleOk = async (values: any) => {
    if (this.state.isAdd) {
      await courses.insert(values as Course);
    } else {
      await courses.update(values as Course);
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
              title: '课程号',
              dataIndex: 'id',
              key: 'id',
            },
            {
              title: '课程名',
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
              title: '学分',
              dataIndex: 'credit',
              key: 'credit',
            },
            {
              title: '学时',
              dataIndex: 'hour',
              key: 'hour',
            },
            {
              title: '操作',
              render: (record: Course) => (
                <Button type="dashed" onClick={() => this.onModify(record)}>
                  修改
                </Button>
              ),
            },
          ]}
          dataSource={this.state.courses}
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
              label="课程号"
              name="id"
              rules={[{ required: true, message: '不能为空' }]}
            >
              <Input disabled={!this.state.isAdd} />
            </Form.Item>
            <Form.Item
              label="课程名"
              name="name"
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
              label="学分"
              name="credit"
              rules={[{ required: true, message: '不能为空' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="学时"
              name="hour"
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
