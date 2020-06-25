import React from 'react';
import {
  Layout,
  Menu,
  Button,
  message,
  Form,
  Input,
  Modal,
  Radio,
  Divider,
} from 'antd';
import './index.scss';
import { getStorage } from '@/storage';
import { User, users } from '@/db';
import { Link } from 'umi';
import { FormInstance } from 'antd/lib/form';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

interface State {
  user?: User;
  showModal: boolean;
}

export default class IndexLayout extends React.Component<{}, State> {
  state: State = {
    showModal: false,
  };

  formRef = React.createRef<FormInstance>();

  componentDidMount() {
    let user = getStorage('user');
    if (user) {
      this.setState({ user: user });
    } else if (!user && location.href.indexOf('login') < 0) {
      location.href = '/login';
    }
  }

  onModify = async () => {
    if (this.state.user) {
      this.setState({
        showModal: true,
      });
      while (!this.formRef.current) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      this.formRef.current?.setFieldsValue(this.state.user);
    } else {
      message.error('你还没有登录');
    }
  };

  handleOk = async (values: any) => {
    message.loading({
      content: '处理中...',
      duration: 1,
    });
    let user = this.state.user;
    if (user) {
      user.name = values.name;
      user.username = values.username;
      user.sex = values.sex;
      user.birthday = values.birthday;
      user.birthplace = values.birthplace;
      users.update(user);
      message.info('修改成功，请重新登录');
      location.href = '/login';
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
    if (location.pathname === '/login') {
      return (
        <div
          style={{
            height: '100%',
          }}
        >
          {this.props.children}
        </div>
      );
    }
    const { user } = this.state;
    return (
      <Layout style={{ minHeight: '100vh' }} className="index-layout">
        <Layout className="site-layout">
          <Header className="index-header" style={{ padding: 0 }}>
            <div className="logo">选课系统</div>
            {user?.role === '管理员' && (
              <Menu className="menu" theme="dark" mode="horizontal">
                <Menu.Item key="1">
                  <Link to="/admin/academy">学院管理</Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to="/admin/student">学生管理</Link>
                </Menu.Item>
                <Menu.Item key="3">
                  <Link to="/admin/teacher">教师管理</Link>
                </Menu.Item>
                <Menu.Item key="4">
                  <Link to="/admin/term">学期管理</Link>
                </Menu.Item>
                <Menu.Item key="5">
                  <Link to="/admin/course">课程管理</Link>
                </Menu.Item>
              </Menu>
            )}
            {user?.role === '教师' && (
              <Menu className="menu" theme="dark" mode="horizontal">
                <Menu.Item key="6">
                  <Link to="/teacher/course">选择开课</Link>
                </Menu.Item>
                <Menu.Item key="7">
                  <Link to="/teacher/opend">开课列表</Link>
                </Menu.Item>
                <Menu.Item key="8">
                  <Link to="/teacher/elective">分数登记</Link>
                </Menu.Item>
              </Menu>
            )}
            {user?.role === '学生' && (
              <Menu className="menu" theme="dark" mode="horizontal">
                <Menu.Item key="9">
                  <Link to="/student/opend">选课</Link>
                </Menu.Item>
                <Menu.Item key="10">
                  <Link to="/student/elective">课表</Link>
                </Menu.Item>
                <Menu.Item key="11">
                  <Link to="/student/grade">成绩查询</Link>
                </Menu.Item>
              </Menu>
            )}
            {user && (
              <div>
                <span className="userinfo">
                  {user.name || '--'} / {user.role}
                </span>
                <Button onClick={this.onModify} type="dashed">
                  修改个人信息
                </Button>
                <Divider type="vertical" />
                <Link to="/login">
                  <Button type="primary" danger>
                    注销
                  </Button>
                </Link>
                <Divider type="vertical" />
              </div>
            )}
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360 }}
            >
              {this.props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Created by 17122990</Footer>
        </Layout>
        <Modal
          title={'请修改信息'}
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
              label="学号/工号"
              name="id"
              rules={[{ required: true, message: '学号不能为空' }]}
            >
              <Input disabled={true} />
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
      </Layout>
    );
  }
}
