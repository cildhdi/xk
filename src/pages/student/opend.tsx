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


interface State {
  opends: Opend[];
  courses: Course[];
  users: User[];
}

export default class extends React.Component<{}, State> {
  state: State = {
    courses: [],
    opends: [],
    users: [],
  };

  componentDidMount = async () => {
    message.loading({
      content: '加载数据...',
      duration: 1,
    });
    this.setState({
      courses: courses.getItems(),
      opends: opends.getItems(),
      users: users.getItems(),
    });
  };

  select = (opend: Opend) => {};

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
                <Button type="primary" onClick={() => this.select(record)}>
                  选课
                </Button>
              ),
            },
          ]}
          dataSource={this.state.opends}
        />
      </div>
    );
  }
}
