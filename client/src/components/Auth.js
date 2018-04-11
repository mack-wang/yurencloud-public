import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

// 所有权限限制的组件，都要经过Auth过滤一遍，才能访问
// 要过滤的组件以参数传入
export default function authFilter(Component) {
  class Auth extends React.Component {

    // 在将要挂载组件时，检查权限
    componentWillMount() {
      this.checkAuth(this.props.isAuth);
    }

    // 在props变化时，检查权限
    componentWillReceiveProps(nextProps) {
      this.checkAuth(nextProps.isAuth);
    }

    checkAuth(isAuth) {
      // 如果未授权，则跳转到登入页
      if (!isAuth) {
        this.props.dispatch(routerRedux.push('/login'));
      }
    }

    render() {
      // 因为一定要有一个顶级组件，所以一定要有div
      return (
        <div style={{ height: '100%' }}>
          {this.props.isAuth === true
            ? <Component {...this.props} />
            : null
          }
        </div>
      );
    }
  }

  const mapStateToProps = state => ({
    token: state.auth.token,
    username: state.auth.username,
    isAuth: state.auth.isAuth,
  });

  // 返回的是一个经过Auth包装的组件，这个组件自带token、username,isAuth
  return connect(mapStateToProps)(Auth);
}
