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
import { Course, courses, Academy, academys, User, users, opends } from '@/db';
import { getStorage, saveStorage } from '@/storage';

const { Option } = Select;

interface State {
  courses: Course[];
  acadamys: Academy[];
  users: User[];
  showModal: boolean;
}

export default class extends React.Component<{}, State> {
  state: State = {
    courses: [],
    showModal: false,
    acadamys: [],
    users: [],
  };

  formRef = React.createRef<FormInstance>();

  componentDidMount = async () => {
    message.loading({
      content: '加载数据...',
      duration: 1,
    });
    this.setState({
      courses: courses.getItems(),
      acadamys: academys.getItems(),
      users: users.getItems(),
    });
  };

  onAdd = () => {
    this.formRef.current?.resetFields();
    this.setState({
      showModal: true,
    });
  };

  onModify = async (course: Course) => {
    this.setState({
      showModal: true,
    });
    while (!this.formRef.current) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    this.formRef.current?.setFieldsValue({
      course_id: course.id,
      user_id: getStorage('user')?.id,
    });
  };

  handleOk = async (values: any) => {
    message.loading({
      content: '处理中...',
      duration: 1,
    });
    opends.insert(values);
    message.success('开课成功');
    this.setState({
      showModal: false,
    });
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
                  开课
                </Button>
              ),
            },
          ]}
          dataSource={this.state.courses}
        />
        <Modal
          title={'请填写开课信息'}
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
              <Select placeholder="请选择课程" allowClear>
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
