import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import { LocaleProvider } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import IndexPage from 'routes/IndexPage';
import Register from 'routes/Register';
import Login from 'routes/Login';
import Home from 'routes/home/Home';
import Admin from 'routes/admin/Admin';
import authFilter from 'components/Auth';
import AdminArticleList from 'routes/admin/AdminArticleList';
import AdminCatalogList from 'routes/admin/AdminCatalogList';
import AdminArticleUpdate from 'routes/admin/AdminArticleUpdate';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import Profile from 'routes/Profile';
import Article from 'routes/Article';
// 默认语言为 en-US，如果你需要设置其他语言，推荐在入口文件全局设置 locale

moment.locale('zh-cn');

// 路由会从上往下匹配，一旦匹配到就立即执行
// 例如 /admin /admin/article 只能访问到/admin,
function RouterConfig({ history }) {
  return (
    <LocaleProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          <Route path="/" exact component={IndexPage} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          {/* 通过授权检测，才能访问视图 */}
          <Route path="/home/index" component={authFilter(Home)} />
          <Route path="/admin/article/create" component={authFilter(Admin)} />
          <Route path="/admin/article/list" component={authFilter(AdminArticleList)} />
          <Route path="/admin/article/catalog" component={authFilter(AdminCatalogList)} />
          <Route path="/admin/article/update/:id" component={authFilter(AdminArticleUpdate)} />
          <Route path="/profile" component={Profile} />
          <Route path="/article/:id" component={Article} />
        </Switch>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;
