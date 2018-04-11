import React from 'react';
import { connect } from 'dva';
import Edit from 'components/Edit';
import AdminLayout from 'components/AdminLayout';

function AdminModifyArticle(props) {
  props.dispatch({ type: 'article/update', payload: { pageInfo: {} } });
  props.dispatch({ type: 'article/modify', payload: { id: props.match.params.id } });
  return (
    <AdminLayout {...props}>
      <Edit />
    </AdminLayout>
  );
}

const mapStateToProps = () => ({});

// 返回的是一个经过Auth包装的组件，这个组件自带token、username,isAuth
export default connect(mapStateToProps)(AdminModifyArticle);
