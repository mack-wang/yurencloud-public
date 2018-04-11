import React from 'react';
import { Layout, Menu, Icon, Row, Col, Pagination } from 'antd';
import { connect } from 'dva';
import dateformat from 'dateformat';
import Navigator from 'components/Navigator';
import image from 'assets/image.png';
import 'wysiwyg.css';
import style from './IndexPage.css';

const { SubMenu } = Menu;
const { Content, Sider, Footer } = Layout;

class IndexPage extends React.Component {

  componentWillMount() {
    const { dispatch, defaultMenu } = this.props;
    dispatch({ type: 'index/getMenu', payload: { id: isNaN(defaultMenu) ? 2 : defaultMenu } });
    dispatch({ type: 'index/update', payload: { profile: false } });
    dispatch({ type: 'query/update', payload: { menu: isNaN(defaultMenu) ? 2 : defaultMenu } });
    dispatch({ type: 'index/getArticles' });
  }


  onChange = (page) => {
    const { dispatch } = this.props;
    dispatch({ type: 'query/update', payload: { page } });
    dispatch({ type: 'index/getArticles' });
  };

  getContent = (content) => {
    const str1 = content.replace(/<\/?.+?>/g, '');
    const str2 = str1.replace(/ /g, '');
    const omit = str2.length > 140 ? '...' : '';
    return str2.substr(0, 140) + omit;
  };

  showArticle = (id) => {
    const { dispatch } = this.props;
    dispatch({ type: 'index/goArticle', payload: { id } });
  };

  handleClick = ({ key }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'query/update', payload: { catalogId: key } });
    dispatch({ type: 'index/getArticles' });
  };

  render() {
    const { menu, articles } = this.props;
    return (
      <Layout style={{ height: '100%', minWidth: '1200px' }}>
        <Navigator />
        <Content style={{ padding: '0 50px', marginTop: '45px', backgroundColor: '#EEF0F4' }}>
          <Layout style={{ padding: '24px 0', background: '#fff' }}>
            <Sider collapsible={false} width={200} style={{ background: '#fff' }}>
              <Menu
                mode="inline"
                style={{ height: '100%' }}
                onClick={this.handleClick}
              >
                {
                      menu.map((item1) => {
                        return (<SubMenu
                          key={item1.value}
                          title={<span><Icon type="book" />{item1.label}</span>}
                        >
                          {item1.children.map(item2 => <Menu.Item
                            key={item2.value}
                          >{item2.label}</Menu.Item>)}
                        </SubMenu>);
                      })
                    }
              </Menu>
            </Sider>
            <Content style={{ padding: '0 24px', minHeight: 700 }}>
              {articles.list ? articles.list.map((item) => {
                return (<Row
                  className={style.articleRow} key={item.id}
                  onClick={this.showArticle.bind(this, item.id)}
                >
                  <Col span={4}>
                    <img className={style.image} src={item.image ? item.image : image} />
                  </Col>
                  <Col span={16} className={style.article}>
                    <div className={style.articleCol}>
                      <span>
                        {item.top === 0 ? '' :
                        <Icon type="pushpin" style={{ color: '#F56C6C' }} />}
                      </span>
                      <span>
                        {item.recommend === 0 ? '' :
                        <Icon type="star" style={{ color: '#F56C6C' }} />}
                      </span>
                      {item.title}
                    </div>
                    <div className={style.articleBrief}>
                      {this.getContent(item.content)}
                    </div>
                    <div className={style.icons}>
                      <span><Icon type="eye" /><span>{item.view}</span></span>
                      <span><Icon type="heart" /><span>{item.good}</span></span>
                    </div>
                  </Col>
                  <Col
                    span={4}
                    className={style.date}
                  >{dateformat(item.updatedAt, 'mm月dd日')}</Col>
                </Row>);
              }) : ''
                  }
              <Pagination
                defaultCurrent={articles.pageNum}
                total={articles.total}
                style={{ float: 'right', marginTop: 14 }}
                onChange={this.onChange}
              />
            </Content>
          </Layout>
        </Content>
        <Footer style={{ textAlign: 'center'}}>
          愚人云端 ©2017 浙ICP备17042562号
        </Footer>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
    menu: state.index.menu,
    articles: state.index.articles,
    defaultMenu: state.index.defaultMenu,
  };
}

export default connect(mapStateToProps)(IndexPage);
