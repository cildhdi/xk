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
    message.loading({
      content: '加载数据...',
      duration: 1,
    });
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

  select = (elective: Elective) => {
    if (elective.usual || elective.exam || elective.total) {
      message.error('该课程已经登分，无法退课');
    } else {
      electives.delete(elective.id);
      message.success('退课成功');
      this.componentDidMount();
    }
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
              title: '开课信息',
              dataIndex: 'opend_id',
              key: 'opend_id',
              render: (v: number) => {
                let a = this.state.opends.find(i => i.id === v);
                let t = this.state.users.find(i => i.id === a?.user_id);
                return `上课时间：${a?.time}，上课地点：${a?.classroom}，教师：${t?.name}`;
              },
            },
            {
              title: '操作',
              render: (record: Elective) => (
                <Button
                  type="primary"
                  danger
                  onClick={() => this.select(record)}
                >
                  退课
                </Button>
              ),
            },
          ]}
          dataSource={this.state.electives}
        />
      </div>
    );
  }
}
