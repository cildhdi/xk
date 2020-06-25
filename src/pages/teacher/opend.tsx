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
import {
  Course,
  courses,
  Academy,
  academys,
  Opend,
  opends,
  User,
  users,
} from '@/db';
import { getStorage, saveStorage } from '@/storage';

const { Option } = Select;

interface State {
  opends: Opend[];
  courses: Course[];
  users: User[];
  showModal: boolean;
  isAdd: boolean;
}

export default class extends React.Component<{}, State> {
  state: State = {
    courses: [],
    opends: [],
    users: [],
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
      courses: courses.getItems(),
      opends: opends
        .getItems()
        .filter(v => v.user_id === getStorage('user')?.id),
      users: users.getItems(),
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
    message.loading({
      content: '处理中...',
      duration: 1,
    });
    console.log(values);
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
        <Divider />
        <Table
          rowKey="id"
          columns={[
            {
              title: '开课号',
              dataIndex: 'id',
              key: 'id',
            },
            {
              title: '课程名',
              dataIndex: 'course_id',
              key: 'course_id',
              render: (v: number) => {
                let a = this.state.courses.find(i => i.id === v);
                return a?.name;
              },
            },
            {
              title: '教师名',
              dataIndex: 'user_id',
              key: 'user_id',
              render: (v: number) => {
                let a = this.state.users.find(i => i.id === v);
                return a?.name;
              },
            },
            {
              title: '上课时间',
              dataIndex: 'time',
              key: 'time',
            },
            {
              title: '教室',
              dataIndex: 'classroom',
              key: 'classroom',
            },
            {
              title: '人数限制',
              dataIndex: 'limit',
              key: 'limit',
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
          dataSource={this.state.opends}
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
              name="course_id"
              label="课程"
              rules={[{ required: true }]}
            >
              <Select placeholder="请选择课程" allowClear disabled={true}>
                {this.state.courses.map(v => (
                  <Option value={v.id}>{v.name}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="user_id"
              label="开课教师"
              rules={[{ required: true }]}
            >
              <Select placeholder="请选择开课教师" allowClear disabled={true}>
                {this.state.users.map(v => (
                  <Option value={v.id}>{v.name}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="上课时间"
              name="time"
              rules={[{ required: true, message: '不能为空' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="上课教室"
              name="classroom"
              rules={[{ required: true, message: '不能为空' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="上课人数"
              name="limit"
              rules={[{ required: true, message: '不能为空' }]}
              initialValue={50}
            >
              <InputNumber min={10} max={300} />
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
