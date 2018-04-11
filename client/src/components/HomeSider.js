import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import PropTypes from 'prop-types';

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;


class HomeSider extends React.Component {

  handleOnClick = ({ item, key, keyPath }) => {
    // key = "catalog" keyPath = ["catalog二级", "article一级"]
    const subs = {
      article: '文章',
      comment: '评论',
    };
    const state = {
      select: key,
      open: keyPath[1],
      sub: subs[keyPath[1]],
      item: item.props.children,
    };
    const store = this.context.store;
    store.dispatch({ type: 'adminSider/select', payload: state });
  };

  render() {
    const { select, open } = this.props;
    return (
      <Sider width={200} style={{ background: '#fff', backgroundColor: '#EEF0F4' }}>
        <Menu
          mode="inline"
          defaultSelectedKeys={[select]}
          defaultOpenKeys={[open]}
          style={{ height: '100%' }}
          onClick={this.handleOnClick}
        >
          <SubMenu key="article" title={<span><Icon type="user" />个人中心</span>}>
            <Menu.Item key="catalog">编辑信息</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
    );
  }
}

HomeSider.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  select: state.adminSider.select,
  open: state.adminSider.open,
  sub: state.adminSider.sub,
  item: state.adminSider.item,
});

// 返回的是一个经过Auth包装的组件，这个组件自带token、username,isAuth
export default connect(mapStateToProps)(HomeSider);
