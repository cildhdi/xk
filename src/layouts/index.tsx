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
import { ResponseData } from '@/api';
import { getStorage } from '@/storage';
import { DB } from '@/db';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

interface State {
  user?: DB.BasicUser;
}

export default class IndexLayout extends React.Component<{}, State> {
  state: State = {};

  componentDidMount() {
    let user = getStorage('user');
    if (user) {
      this.setState({ user: user.bu });
    }
  }

  render() {
    const { user } = this.state;
    return (
      <Layout style={{ minHeight: '100vh' }} className="index-layout">
        <Sider>
          <div className="logo">选课系统</div>
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" icon={<PieChartOutlined />}>
              Option 1
            </Menu.Item>
            <Menu.Item key="2" icon={<DesktopOutlined />}>
              Option 2
            </Menu.Item>
            <SubMenu key="sub1" icon={<UserOutlined />} title="User">
              <Menu.Item key="3">Tom</Menu.Item>
              <Menu.Item key="4">Bill</Menu.Item>
              <Menu.Item key="5">Alex</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
              <Menu.Item key="6">Team 1</Menu.Item>
              <Menu.Item key="8">Team 2</Menu.Item>
            </SubMenu>
            <Menu.Item key="9" icon={<FileOutlined />} />
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            {user && (
              <div>
                {user.Username || '--'} / {DB.roleName[user.Role]}
                <Button type="primary" danger>
                  注销
                </Button>
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
