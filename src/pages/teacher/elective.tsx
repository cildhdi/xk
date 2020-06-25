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
  Upload,
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import { UploadOutlined } from '@ant-design/icons';
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
      ['id', 'user_id', 'name', 'usual', 'exam'],
    ];
    let students = this.state.electives.filter(v => {
      if (v.opend_id === this.state.opend_id) {
        return v;
      }
    });
    for (const s of students) {
      let user = this.state.users.find(u => u.id === s.user_id);
      if (user) {
        ws_data.push([s.id, user.id, user.name, s.usual, s.exam]);
      }
    }
    let ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, '学生登分表');
    XLSX.writeFile(wb, '学生登分表.xlsx');
  };

  processEs = async (es: Partial<Elective>[]) => {
    for (let index = 0; index < es.length; index++) {
      if (!es[index].usual) {
        es[index].usual = 0;
      }
      if (!es[index].exam) {
        es[index].exam = 0;
      }
      if (es[index].usual && es[index].exam) {
        es[index].total = Math.round(
          ((es[index].usual ?? 0) + (es[index].exam ?? 0)) / 2,
        );
      } else {
        es[index].total = 0;
      }
    }
    await electives.updates(es);
    this.loadData();
  };

  upload = (file: File | Blob | undefined) => {
    if (file) {
      let reader = new FileReader();
      reader.onload = e => {
        if (e.target?.result instanceof ArrayBuffer) {
          let data = new Uint8Array(e.target?.result);
          let wookbook = XLSX.read(data, { type: 'array' });
          this.processEs(
            XLSX.utils.sheet_to_json(wookbook.Sheets[wookbook.SheetNames[0]]),
          );
        }
      };
      reader.readAsArrayBuffer(file);
    }
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
          <Upload
            name="file"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={info => this.upload(info.file.originFileObj)}
            fileList={[]}
          >
            <Button disabled={!this.state.opend_id}>
              <UploadOutlined /> 上传成绩
            </Button>
          </Upload>
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
