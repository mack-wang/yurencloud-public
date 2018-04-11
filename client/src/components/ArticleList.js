import React from 'react';
import { Table, Icon, Layout, Breadcrumb, message, Modal, Input, Cascader, Button } from 'antd';
import { connect } from 'dva';
import { withRouter, Link } from 'dva/router';
import dateformat from 'dateformat';
import style from './ArticleList.css';

const { Column } = Table;
const { Content } = Layout;
const { Search } = Input;
const ButtonGroup = Button.Group;

const confirm = Modal.confirm;

class ArticleList extends React.Component {

  componentWillMount() {
    const { dispatch } = this.props;
    // 重置查询语句
    dispatch({ type: 'query/reset' });
    dispatch({ type: 'catalog/cascader' });
    dispatch({ type: 'article/getAll' });
  }

  onChange = (page, pageSize) => {
    const { dispatch } = this.props;
    dispatch({ type: 'query/update', payload: { page, pageSize } });
    dispatch({ type: 'article/getAll' });
  };

  onShowSizeChange = (page, pageSize) => {
    const { dispatch } = this.props;
    dispatch({ type: 'query/update', payload: { page, pageSize } });
    dispatch({ type: 'article/getAll' });
  };

  onClickDelete = (id) => {
    const { dispatch } = this.props;
    confirm({
      title: '确认要删除文章吗?',
      content: '删除后不可恢复',
      onOk() {
        dispatch({ type: 'article/deletes', payload: { id } });
      },
    });
  };


  onChangeSearch = (event) => {
    this.props.dispatch({ type: 'article/update', payload: { search: event.target.value } });
  };

  getByCatalog = (value) => {
    const { dispatch } = this.props;
    dispatch({ type: 'article/update', payload: { cascaderValue: value } });
    dispatch({ type: 'query/init', payload: { catalogId: value[2] } });
    dispatch({ type: 'article/getAll' });
  };

  getByTitle = (value) => {
    const { dispatch } = this.props;
    dispatch({ type: 'query/init', payload: { title: value } });
    dispatch({ type: 'article/getAll' });
  };

  reload = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'article/update', payload: { search: '', cascaderValue: [] } });
    dispatch({ type: 'query/reset' });
    dispatch({ type: 'article/getAll' });
  };


  render() {
    const { pageInfo, dispatch, catalog, search, cascaderValue, query } = this.props;
    const { createdAt, good, view } = query;
    const pagination = {
      current: pageInfo.pageNum,
      total: pageInfo.total,
      defaultCurrent: 1,
      pageSize: pageInfo.pageSize,
      showSizeChanger: true,
      onChange: this.onChange,
      onShowSizeChange: this.onShowSizeChange,
      showTotal: (total, range) => `当前 ${range[0]}-${range[1]} 共 ${total}`,
    };
    return (
      <Layout style={{ padding: '0 24px 24px' }}>
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>文章</Breadcrumb.Item>
          <Breadcrumb.Item>文章列表</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{ background: '#fff', padding: 24, margin: 0 }}>
          <Cascader
            options={catalog}
            onChange={this.getByCatalog}
            placeholder="按目录搜索"
            className={style.inlineElement}
            style={{ width: 250 }}
            value={cascaderValue}
          />
          <Search
            placeholder="按文章标题搜索"
            value={search}
            style={{ width: 200 }}
            onSearch={this.getByTitle}
            className={style.inlineElement}
            onChange={this.onChangeSearch}
          />
          <Button className={style.inlineElement} onClick={this.reload}>全部</Button>
          <div className={style.inlineElement}>
            <ButtonGroup >
              <Button
                onClick={() => {
                  dispatch({ type: 'query/update', payload: { createdAt: createdAt === 'asc' ? 'desc' : 'asc' } });
                  dispatch({ type: 'article/getAll' });
                }}
              >创建时间 <Icon type={createdAt === 'desc' ? 'down' : 'up'} /></Button>
              <Button
                onClick={() => {
                  dispatch({ type: 'query/update', payload: { good: good === 'desc' ? 'asc' : 'desc' } });
                  dispatch({ type: 'article/getAll' });
                }}
              >喜欢 <Icon type={good === 'desc' ? 'down' : 'up'} /></Button>
              <Button
                onClick={() => {
                  dispatch({ type: 'query/update', payload: { view: view === 'desc' ? 'asc' : 'desc' } });
                  dispatch({ type: 'article/getAll' });
                }}
              >浏览 <Icon type={view === 'desc' ? 'down' : 'up'} /></Button>
            </ButtonGroup>
          </div>
          <Table dataSource={pageInfo.list} rowKey="id" pagination={pagination}>
            <Column
              title="标题"
              key="title"
              render={(text, record) => (
                <div>
                  <span>
                    {record.top === 0 ? '' : <Icon type="pushpin" style={{ color: '#F56C6C' }} />}
                  </span>
                  <span>
                    {record.recommend === 0 ? '' : <Icon type="star" style={{ color: '#F56C6C' }} />}
                  </span>
                  <span>{record.title}</span>
                </div>
              )}
            />
            <Column
              title="目录"
              key="catalog"
              dataIndex="catalog.name"
            />
            <Column
              title="创建时间"
              key="createdAt"
              render={(text, record) => (
                <span>
                  {dateformat(record.createdAt, 'mm月dd日')}
                </span>
              )}
            />
            <Column
              title="喜欢"
              key="good"
              render={(text, record) => (
                <span> <Icon type="heart" /> {record.good}</span>
              )}
            />
            <Column
              title="浏览"
              key="view"
              render={(text, record) => (
                <span> <Icon type="eye" /> {record.view}</span>
              )}
            />
            <Column
              title="操作"
              key="action"
              render={(text, record) => (
                <span>
                  <Link to={`/admin/article/update/${record.id}`}>修改</Link>
                  <span className={style.antDivider} />
                  <a onClick={() => this.onClickDelete(record.id)}>删除</a>
                  <span className={style.antDivider} />
                  <a
                    onClick={() => dispatch({
                      type: 'article/recommend',
                      payload: { id: record.id },
                    })}
                  >{record.recommend === 0 ? '推荐' : '取消推荐'}</a>
                  <span className={style.antDivider} />
                  <a
                    onClick={() => dispatch({
                      type: 'article/top',
                      payload: { id: record.id },
                    })}
                  >{record.top === 0 ? '置顶' : '取消置顶'}</a>
                </span>
              )}
            />
          </Table>
        </Content>
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
  pageInfo: state.article.pageInfo,
  catalog: state.catalog.catalog,
  search: state.article.search,
  cascaderValue: state.article.cascaderValue,
  query: state.query,
});

// 返回的是一个经过Auth包装的组件，这个组件自带token、username,isAuth
export default withRouter(connect(mapStateToProps)(ArticleList));
