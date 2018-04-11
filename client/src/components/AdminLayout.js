import React from 'react';
import { Layout } from 'antd';
import { connect } from 'dva';
import Navigator from 'components/Navigator';
import AdminSider from 'components/AdminSider';


class AdminLayout extends React.Component {
  state = {
    collapsed: false,
    mode: 'inline',
  };

  componentWillMount() {
    // 因为继承了Auth所以自然就拥有了token,username,isAuth这三个props
    const { pathname } = this.props.location;
    this.props.dispatch({ type: 'home/login', payload: { pathname } });
  }

  render() {
    const { children } = this.props;
    return (
      <Layout style={{ height: '100%', minWidth: '1200px' }}>
        <Navigator />
        <Layout>
          <AdminSider />
          { children }
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = () => ({
});

  // 返回的是一个经过AdminLayout包装的组件
export default connect(mapStateToProps)(AdminLayout);

