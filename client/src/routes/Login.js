import React from 'react';
import { Form, Input, Row, Col, Button, Card } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import Back from '../components/Back';
import style from './Login.css';

const FormItem = Form.Item;
// 定义了Login的组件,无状态组件
const LoginForm = ({ dispatch, form: { getFieldDecorator, validateFieldsAndScroll }, location }) => {
  function handleSubmit(e) {
    e.preventDefault();
    // 验证所有的值，如果没错误就提交
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        // 触发 登入请求的action,并装载参数
        values.pathname = location.pathname;
        dispatch({ type: 'login/login', payload: values });
      }
    });
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 14,
        offset: 6,
      },
    },
  };
  return (
    <div style={{ background: '#ECECEC', height: '100%' }}>
      <Row>
        <Col span={6} />
        <Col span={12}>
          <Card title="登录" bordered={false} style={{ marginTop: 200 }}>
            <Form onSubmit={handleSubmit}>
              <FormItem
                {...formItemLayout}
                label="用户名"
                hasFeedback
              >
                {getFieldDecorator('username', {
                  validateTrigger: 'onBlur',
                  rules: [{
                    pattern: '^[A-Za-z0-9_-]{6,32}$', message: '格式错误!',
                  }, {
                    required: true, message: '请输入用户名!',
                  }],
                })(
                  <Input placeholder="6-32字,可包含字母、数字、横线、下划线" />,
                  )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="密码"
                hasFeedback
              >
                {getFieldDecorator('password', {
                  validateTrigger: 'onBlur',
                  rules: [{
                    required: true, message: '请输入密码!',
                  }, {
                    min: 6, message: '密码至少6位!',
                  }, {
                    max: 32, message: '密码最多32位!',
                  }],
                })(
                  <Input type="password" />,
                  )}
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" >登录</Button>
                <Back />
              </FormItem>
            </Form>
          </Card>
        </Col>
        <Col span={6} />
      </Row>
      <Row>
        <Col>
          <div className={style.register}>如果你还没注册？<Link to="/register">立即注册</Link></div>
        </Col>
      </Row>
    </div>
  );
};

const Login = Form.create()(LoginForm);

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Login);
