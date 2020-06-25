import React from 'react';
import { message } from 'antd';
import './login.scss';
import { saveStorage } from '@/storage';
import { users } from '@/db';
import md5 from 'blueimp-md5';
import { history } from 'umi';

interface State {
  username: string;
  password: string;
}

export default class Login extends React.Component<{}, State> {
  state: State = {
    username: '',
    password: '',
  };

  submit = async () => {
    if (this.state.username.length === 0 || this.state.password.length === 0) {
      message.error('请填写完整的信息');
      return;
    }
    try {
      console.log(
        `Username: ${this.state.username}  Secret:${md5(this.state.password)}`,
      );
      let user = users.query({
        username: this.state.username,
        secret: this.state.password,
      });
      if (user.length !== 0) {
        message.success('登录成功');
        saveStorage('user', user[0]);
        switch (user[0].role) {
          case '学生':
            location.href = '/student';
            break;
          case '教师':
            location.href = '/teacher';
            break;
          case '管理员':
            location.href = '/admin';
            break;
          default:
            break;
        }
      } else {
        message.error('登录失败，请检查用户名、密码是否正确');
      }
      this.setState;
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    return (
      <div className="login-page">
        <div className="topbar">
          <div className="logo" />
        </div>
        <div className="login-area">
          <div className="login-form">
            <div className="login-title">登录/Login</div>
            <input
              placeholder="请输入账号/Campus ID Number"
              value={this.state.username}
              onChange={e => this.setState({ username: e.target.value })}
            />
            <input
              placeholder="请输入密码/Password"
              type="password"
              value={this.state.password}
              onChange={e => this.setState({ password: e.target.value })}
            />
            <button className="submit" onClick={this.submit}>
              登录/Login
            </button>
          </div>
        </div>
        <div className="footer">
          <div>信息服务电话：66133370 技术支持 上海大学信息化工作办公室</div>
          <div>
            Technical support: IT Office of Shanghai University Tel:66133370
          </div>
          <div>
            地址：上海市宝山区上大路99号 邮编：200444 Address: 99 Shangda Rd.
            Shanghai, China. 200444.
          </div>
          <div>
            Copyright © 2012-2020 Shanghai University, All Rights Reserved.
          </div>
        </div>
      </div>
    );
  }
}
