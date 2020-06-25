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
  electives,
  Elective,
} from '@/db';
import { getStorage, saveStorage } from '@/storage';

interface State {
  opends: Opend[];
  courses: Course[];
  users: User[];
  electives: Elective[];
  user?: User;
}

export default class extends React.Component<{}, State> {
  state: State = {
    courses: [],
    opends: [],
    electives: [],
    users: [],
  };

  componentDidMount = async () => {
    this.setState({
      courses: courses.getItems(),
      opends: opends.getItems(),
      users: users.getItems(),
      electives: electives.getItems(),
      user: getStorage('user') ?? undefined,
    });
  };

  select = async (opend: Opend) => {
    await electives.insert({
      course_id: opend.course_id,
      opend_id: opend.id,
      user_id: this.state.user?.id,
    });
    this.componentDidMount();
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
              render: (record: Opend) => {
                let disabled =
                  this.state.electives.findIndex(
                    e =>
                      e.user_id === this.state.user?.id &&
                      e.course_id === record.course_id,
                  ) >= 0;
                return (
                  <Button
                    type="primary"
                    onClick={() => this.select(record)}
                    disabled={disabled}
                  >
                    选课
                  </Button>
                );
              },
            },
          ]}
          dataSource={this.state.opends}
        />
      </div>
    );
  }
}
