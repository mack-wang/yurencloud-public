import React from 'react';
import { Layout, Breadcrumb, Icon } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Navigator from 'components/Navigator';
import avatar from 'assets/avatar.png';
import 'wysiwyg.css';
import style from './IndexPage.css';

const { Content, Footer, Header } = Layout;

class Article extends React.Component {

  componentWillMount() {
    const { dispatch, match } = this.props;
    dispatch({ type: 'index/update', payload: { variable: 0 } });
    dispatch({ type: 'index/getArticle', payload: { id: match.params.id } });
    dispatch({ type: 'index/getCatalog', payload: { id: match.params.id } });
  }

  clickBack = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'index/update', payload: { article: {} } });
    dispatch({ type: 'index/getArticles' });
    routerRedux.push('/');
  };

  clickLike = (id) => {
    const { dispatch } = this.props;
    dispatch({ type: 'index/setLikes', payload: { id } });
  };

  render() {
    const { article, catalog, like, variable } = this.props;
    return (
      <Layout style={{ height: '100%', minWidth: '1200px' }}>
        <Navigator />
        <Content style={{ padding: '0 50px', backgroundColor: '#EEF0F4' }}>
          <span className={style.back} onClick={this.clickBack}><Icon type="left" />返回</span>
          <Breadcrumb style={{ margin: '12px', display: 'inline-block' }}>
            <Breadcrumb.Item>{catalog[2]}</Breadcrumb.Item>
            <Breadcrumb.Item>{catalog[1]}</Breadcrumb.Item>
            <Breadcrumb.Item>{catalog[0]}</Breadcrumb.Item>
          </Breadcrumb>
          <Layout style={{ padding: '24px 0', background: '#fff' }}>
            <Header className={style.header}>{article.title}</Header>
            <div className={like ? style.like : style.heart} onClick={() => this.clickLike(article.id)}>
              <Icon type="heart" />喜欢
                </div>
            <Content className={style.content}>
              <div>
                <img className={style.avatar} src={avatar} alt="" />
                <div className={style.detail}>
                  <div>
                        王乐城愚人云端
                      </div>
                  <div>
                    <span>更新于 {article.updatedAt}</span>
                    <span>字数 {article.words ? article.words : 0}</span>
                    <span>阅读 {article.view}</span>
                    <span>喜欢 {article.good + variable}</span>
                  </div>
                </div>
              </div>
              <div className="wysiwyg" dangerouslySetInnerHTML={{ __html: article.content }} />
            </Content>
            <Footer className={style.footer}>
              <div className={style.button}>
                    赞赏支持
                    <div />
              </div>
              <div>*支持支付宝</div>
            </Footer>
          </Layout>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          愚人云端 ©2017 浙ICP备17042562号
        </Footer>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
    menu: state.index.menu,
    openKeys: state.index.openKeys,
    selectedKeys: state.index.selectedKeys,
    article: state.index.article,
    catalog: state.index.catalog,
    defaultMenu: state.index.defaultMenu,
    like: state.index.like,
    variable: state.index.variable,
  };
}

export default connect(mapStateToProps)(Article);
