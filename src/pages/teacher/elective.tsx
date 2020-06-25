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
import XLSX from 'xlsx';

const { Option } = Select;

interface State {
  opends: Opend[];
  courses: Course[];
  users: User[];
  electives: Elective[];
  opend_id?: number;
  user?: User;
}

export default class extends React.Component<{}, State> {
  state: State = {
    courses: [],
    opends: [],
    electives: [],
    users: [],
  };

  loadData = () => {
    message.loading({
      content: '加载数据...',
      duration: 1,
    });
    let user = getStorage('user') || undefined;
    this.setState({
      courses: courses.getItems(),
      opends: opends.getItems().filter(v => {
        if (v.user_id === user?.id) {
          return v;
        }
      }),
      users: users.getItems(),
      electives: electives.getItems(),
      user,
    });
  };

  componentDidMount = async () => {
    this.loadData();
  };

  download = () => {
    let wb = XLSX.utils.book_new();
    let ws_data: (string | number | undefined)[][] = [
      ['学号', '姓名', '平时分', '考试分数'],
    ];
    let students = this.state.electives.filter(v => {
      if (v.opend_id === this.state.opend_id) {
        return v;
      }
    });
    for (const s of students) {
      let user = this.state.users.find(u => u.id === s.user_id);
      if (user) {
        ws_data.push([user.id, user.name, s.usual, s.exam]);
      }
    }
    let ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, '学生登分表');
    XLSX.writeFile(wb, '学生登分表.xlsx');
  };

  upload = (event: React.DragEvent<any>) => {
    console.log(event.dataTransfer.files);
  };

  render() {
    return (
      <div>
        <div>
          <Select
            style={{
              width: '200px',
            }}
            onChange={v => this.setState({ opend_id: parseInt(v.toString()) })}
          >
            {this.state.opends.map(o => (
              <Option key={o.id} value={o.id}>
                {o.course_id} - {o.time} - {o.classroom}
              </Option>
            ))}
          </Select>
          <Divider type="vertical" />
          <Button disabled={!this.state.opend_id} onClick={this.download}>
            下载登分表
          </Button>
          <Divider type="vertical" />
          <Button disabled={!this.state.opend_id} onDrop={this.upload}>
            拖动登分表到这里上传成绩
          </Button>
        </div>
        <Divider />
        <Table
          rowKey="id"
          columns={[
            {
              title: '学号',
              dataIndex: 'user_id',
              key: 'sid',
              render: (v, r: Elective) => {
                let t = this.state.users.find(i => i.id === r.user_id);
                return t?.id;
              },
            },
            {
              title: '姓名',
              dataIndex: 'user_id',
              key: 'sname',
              render: (v, r: Elective) => {
                let t = this.state.users.find(i => i.id === r.user_id);
                return t?.name;
              },
            },
            {
              title: '平时分',
              dataIndex: 'usual',
              key: 'usual',
              render: (v, r: Elective) => {
                return r.usual ?? '暂未登分';
              },
            },
            {
              title: '考试成绩',
              dataIndex: 'exam',
              key: 'exam',
              render: (v, r: Elective) => {
                return r.exam ?? '暂未登分';
              },
            },
            {
              title: '总分',
              dataIndex: 'total',
              key: 'total',
              render: (v, r: Elective) => {
                return r.total ?? '暂未登分';
              },
            },
          ]}
          dataSource={this.state.electives.filter(v => {
            if (v.opend_id === this.state.opend_id) {
              return v;
            }
          })}
        />
      </div>
    );
  }
}
