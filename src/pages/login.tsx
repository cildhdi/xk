import React from 'react';

import './login.scss';

interface State {
  username: string;
  password: string;
  msg: string;
}

export default class Login extends React.Component<{}, State> {
  state: State = {
    username: '',
    password: '',
    msg: 'error message',
  };

  showMsg = (msg: string) => this.setState({ msg });

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
              value={this.state.password}
              onChange={e => this.setState({ password: e.target.value })}
            />
            {this.state.msg && <div className="message">{this.state.msg}</div>}
            <button className="submit">登录/Login</button>
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
