import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { connect } from 'dva';
import { Link, withRouter } from 'dva/router';

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;


class AdminSider extends React.Component {

  handleOnClick = ({ keyPath }) => {
    this.props.dispatch({ type: 'adminSider/update', payload: { select: keyPath[0], open: keyPath[1] } });
  };

  render() {
    const { select, open } = this.props;
    return (
      <Sider width={200} style={{ background: '#fff', backgroundColor: '#EEF0F4' }}>
        <Menu
          mode="inline"
          defaultOpenKeys={[open]}
          defaultSelectedKeys={[select]}
          style={{ height: '100%' }}
          onClick={this.handleOnClick}
        >
          <SubMenu key="article" title={<span><Icon type="user" />文章</span>}>
            <Menu.Item key="create"><Link to="/admin/article/create">添加文章</Link></Menu.Item>
            <Menu.Item key="list"><Link to="/admin/article/list">文章列表</Link></Menu.Item>
            <Menu.Item key="catalog"><Link to="/admin/article/catalog">编辑目录</Link></Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
    );
  }
}

const mapStateToProps = state => ({
  select: state.adminSider.select,
  open: state.adminSider.open,
});

// 返回的是一个经过Auth包装的组件，这个组件自带token、username,isAuth
export default withRouter(connect(mapStateToProps)(AdminSider));
