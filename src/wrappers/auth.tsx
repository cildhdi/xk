import React from 'react';
import { isLoggedin } from '@/util';
import { Redirect } from 'umi';

export default class extends React.Component {
  render() {
    const user = isLoggedin();
    if (user) {
      return <> {this.props.children} </>;
    } else {
      return <Redirect to="/login" />;
    }
  }
}
