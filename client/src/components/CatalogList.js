import React from 'react';
import { Table, Layout, Breadcrumb, Modal, Input, Button } from 'antd';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import style from './ArticleList.css';

const { Column } = Table;
const { Content } = Layout;

const confirm = Modal.confirm;

class CatalogList extends React.Component {

  componentWillMount() {
    const { dispatch } = this.props;
    // 重置查询语句
    dispatch({ type: 'query/reset' });
    dispatch({ type: 'catalog/allCatalog' });
    dispatch({ type: 'catalog/catalogPage' });
  }

  onChange = (page, pageSize) => {
    const { dispatch } = this.props;
    dispatch({ type: 'query/update', payload: { page, pageSize } });
    dispatch({ type: 'catalog/catalogPage' });
  };

  onShowSizeChange = (page, pageSize) => {
    const { dispatch } = this.props;
    dispatch({ type: 'query/update', payload: { page, pageSize } });
    dispatch({ type: 'catalog/catalogPage' });
  };

  onClickDelete = (id) => {
    const { dispatch } = this.props;
    confirm({
      title: '确认要删除目录吗?',
      content: '会将该目录及子目录下的所有文章转移至未定义目录，并删除该目录下的所有子目录！',
      onOk() {
        dispatch({ type: 'catalog/deletes', payload: { id } });
      },
    });
  };

  onClickOk = () => {
    const { action, dispatch } = this.props;
    if (action === 'modify') {
      dispatch({ type: 'catalog/modify' });
    }
    if (action === 'addCatalog') {
      dispatch({ type: 'catalog/add' });
      dispatch({ type: 'catalog/update', payload: { value: '' } });
    }
    if (action === 'createCatalog') {
      dispatch({ type: 'catalog/create' });
      dispatch({ type: 'catalog/update', payload: { value: '' } });
    }
  };

  onChangeInput = (event) => {
    this.props.dispatch({ type: 'catalog/update', payload: { value: event.target.value } });
  };

  render() {
    const { pageInfo, dispatch, allCatalog, value, addonBefore, disable } = this.props;
    const catalogLevel = ['菜单', '一级目录', '二级目录'];
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
          <Breadcrumb.Item>编辑目录</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{ background: '#fff', padding: 24, margin: 0 }}>
          <Input
            addonBefore={addonBefore}
            value={value}
            onChange={this.onChangeInput}
            style={{ marginBottom: 14, width: '50%' }}
          />
          <Button style={{ marginLeft: 14 }} disabled={disable} type="primary" onClick={this.onClickOk}>确认</Button>
          <Button
            style={{ marginLeft: 14 }} type="primary"
            onClick={() => dispatch({ type: 'catalog/update',
              payload: {
                addonBefore: '添加菜单',
                disable: false,
                action: 'createCatalog',
              } })}
          >添加菜单</Button>
          <Table dataSource={pageInfo.list} rowKey="id" pagination={pagination}>
            <Column
              title="目录"
              key="name"
              dataIndex="name"
            />
            <Column
              title="路径"
              key="path"
              render={(text, record) => (
                <span>{`${record.gid === 0 ? '' : `${allCatalog[record.gid].name}/`}${record.pid === 0 ? '' : `${allCatalog[record.pid].name}/`}${allCatalog[record.id].name}`}</span>
              )}
            />
            <Column
              title="级别"
              key="catalog"
              render={(text, record) => (
                <span>{catalogLevel[record.level]}</span>
              )}
            />
            <Column
              title="操作"
              key="action"
              render={(text, record) => (
                <span>
                  <a
                    onClick={() => dispatch({ type: 'catalog/update',
                      payload: {
                        addonBefore: '修改',
                        value: record.name,
                        disable: false,
                        action: 'modify',
                        id: record.id,
                      } })}
                  >修改</a>
                  <span className={style.antDivider} />
                  <a onClick={() => this.onClickDelete(record.id)}>删除</a>
                  <span className={style.antDivider} />
                  <a onClick={() => dispatch({ type: 'catalog/off', payload: { id: record.id } })}>{record.off === 0 ? '关闭' : '开启'}</a>
                  <span className={style.antDivider} />
                  {record.level !== 2 ? <a
                    onClick={() => dispatch({ type: 'catalog/update',
                      payload: {
                        addonBefore: `${record.name}`,
                        disable: false,
                        action: 'addCatalog',
                        id: record.id,
                      } })}
                  >添加子目录</a> : ''}
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
  pageInfo: state.catalog.pageInfo,
  allCatalog: state.catalog.allCatalog,
  value: state.catalog.value,
  addonBefore: state.catalog.addonBefore,
  disable: state.catalog.disable,
  action: state.catalog.action,
});

// 返回的是一个经过Auth包装的组件，这个组件自带token、username,isAuth
export default withRouter(connect(mapStateToProps)(CatalogList));
