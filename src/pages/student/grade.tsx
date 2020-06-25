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
    let user = getStorage('user') || undefined;
    this.setState({
      courses: courses.getItems(),
      opends: opends.getItems(),
      users: users.getItems(),
      electives: electives.getItems().filter(v => {
        if (v.user_id === user?.id) {
          return v;
        }
      }),
      user,
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
              title: '课程信息',
              dataIndex: 'course_id',
              key: 'course_id',
              render: (v: number) => {
                let a = this.state.courses.find(i => i.id === v);
                return `${a?.id}-${a?.name}`;
              },
            },
            {
              title: '平时分',
              dataIndex: 'usual',
              key: 'usual',
              render: (v, r: Elective) => {
                return r.usual || '暂未登分';
              },
            },
            {
              title: '考试成绩',
              dataIndex: 'exam',
              key: 'exam',
              render: (v, r: Elective) => {
                return r.exam || '暂未登分';
              },
            },
            {
              title: '总分',
              dataIndex: 'total',
              key: 'total',
              render: (v, r: Elective) => {
                return r.total || '暂未登分';
              },
            },
          ]}
          dataSource={this.state.electives}
        />
      </div>
    );
  }
}
