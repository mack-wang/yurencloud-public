import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'dva/router';
import { connect } from 'dva';
import Head from 'react-declarative-head';
import img from 'assets/yurencloud.png';

const { Header } = Layout;

class Navigator extends React.Component {

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'catalog/cascaderMenu' });
  }

  // 当key 不是一个数字
  handleClick = ({ key }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'index/update', payload: { defaultMenu: key } });
    switch (key) {
      case 'home':
      case 'user':
        dispatch({ type: 'home/login', payload: { pathname: '/login' } });
        break;
      case 'profile':
      case 'register':
      case 'login':
      case 'index':
      case 'logo':
        break;
      case 'logout':
        dispatch({ type: 'auth/logout' });
        break;
      default:
        dispatch({ type: 'index/getMenu', payload: { id: key } });
        dispatch({ type: 'query/reset' });
        dispatch({ type: 'query/update', payload: { menu: key } });
        dispatch({ type: 'index/getArticles' });
        break;
    }
  };

  render() {
    const { isAuth, username, catalogMenu, defaultMenu } = this.props;
    return (
      <Header className="header" style={{ minWidth: '1200px' }}>
        <Head>
          <title>愚人云端</title>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
          <meta name="author" content="王乐城;http://yurencloud.com" />
          <meta name="keywords" content="愚人云端,王乐城愚人云端,王乐城,前端,web前端,yurencloud,愚人,云端" />
          <meta name="description" content="愚人云端专注web前端探索。愚人云端-愚人有大智。" />
        </Head>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[defaultMenu]}
          style={{ lineHeight: '64px', paddingRight: '50px' }}
          onClick={this.handleClick}
        >
          <Menu.Item key="logo"><img
            src={img} alt=""
            style={{ width: 40, height: 30 }}
          /></Menu.Item>
          <Menu.Item key="index" style={{ fontSize: 16 }}>愚人云端</Menu.Item>
          {catalogMenu.map(item => <Menu.Item key={item.value}>{item.label}</Menu.Item>)}
          <Menu.Item key="profile"><Link to="/profile">博客作者</Link></Menu.Item>
          {
            isAuth ?
              [
                <Menu.Item
                  key="home" style={{ float: 'right' }}
                >
                  个人中心
                </Menu.Item>,
                <Menu.Item
                  key="user" style={{ float: 'right' }}
                >
                  {username}
                </Menu.Item>,
                <Menu.Item key="logout" style={{ float: 'right' }}>
                  退出
                </Menu.Item>,
              ].map(item => item) :
              [
                <Menu.Item key="register" style={{ float: 'right' }}><Link
                  to="/register"
                >注册</Link></Menu.Item>,
                <Menu.Item key="login" style={{ float: 'right' }}><Link
                  to="/login"
                >登入</Link></Menu.Item>,
              ].map(item => item)
          }
        </Menu>
      </Header>
    );
  }

}

const mapStateToProps = state => ({
  username: state.auth.username,
  isAuth: state.auth.isAuth,
  catalogMenu: state.catalog.catalogMenu,
  defaultMenu: state.index.defaultMenu,
});

// 返回的是一个经过Auth包装的组件，这个组件自带token、username,isAuth
export default connect(mapStateToProps)(Navigator);
