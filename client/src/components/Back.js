import React from 'react';
import { Button } from 'antd';
import { withRouter } from 'react-router-dom';

const Back = ({ history }) => (
  <Button type="default" style={{ marginLeft: 8 }} onClick={() => history.goBack()} className="login-form-button">
    返回
  </Button>
);

export default withRouter(Back);
