import React from 'react';
import Edit from 'components/Edit';
import AdminLayout from 'components/AdminLayout';

export default class Admin extends React.Component {
  componentWillMount() {
    // 从父组件那里继续了dispatch
    this.props.dispatch({ type: 'article/init' });
  }
  render() {
    return (
      <AdminLayout {...this.props}>
        <Edit />
      </AdminLayout>
    );
  }
}
