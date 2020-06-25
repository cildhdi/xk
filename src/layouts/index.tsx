import React from 'react';
import { Layout, Menu, Button } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import './index.scss';
import { getStorage } from '@/storage';
import { User } from '@/db';
import { Link } from 'umi';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

interface State {
  user?: User;
}

export default class IndexLayout extends React.Component<{}, State> {
  state: State = {};

  componentDidMount() {
    let user = getStorage('user');
    if (user) {
      this.setState({ user: user });
    }
  }

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
            {user && (
              <div>
                <span className="userinfo">
                  {user.username || '--'} / {user.role}
                </span>
                <Link to="/login">
                  <Button type="primary" danger>
                    注销
                  </Button>
                </Link>
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
      </Layout>
    );
  }
}
