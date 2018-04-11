import React from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col, Checkbox, Button, Card, message } from 'antd';
import { routerRedux } from 'dva/router';
import Agreement from 'components/Agreement';
import { checkUsername, register } from 'services/user';
import Back from '../components/Back';


const FormItem = Form.Item;

class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
  };
  handleSubmit = (e) => {
    e.preventDefault();
    // 验证所有的值，如果没错误就提交
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const { success, result, content } = await register({
          username: values.username,
          password: values.password,
        });
          // 如果是java返回是null,则不能转换成json,就会报错，有错误，我们就说用户名已经存在
        if (success && result) {
            // 注册成功,跳转到登录页
          this.props.dispatch(routerRedux.push('/login'));
          message.success(content);
        } else {
            // 注册失败
          message.error(content);
        }
      }
    });
  };
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  checkUsername = async (rule, value, callback) => {
    const form = this.props.form;
    const username = form.getFieldValue('username');
    if (username.length >= 6) {
      const { success, result, content } = await checkUsername(username);
      if (success) {
        if (result) {
          callback(content);
        } else {
          callback();
        }
      } else {
        message.error(content);
      }
    }
  };

  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('确认密码错误！');
    } else {
      callback();
    }
  };
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
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
            <Card title="注册" bordered={false} style={{ marginTop: 200 }}>
              <Form onSubmit={this.handleSubmit}>
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
                    }, {
                      validator: this.checkUsername,
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
                      validator: this.checkConfirm,
                    }, {
                      min: 6, message: '密码至少6位!',
                    }, {
                      max: 32, message: '密码最多32位!',
                    }],
                  })(
                    <Input type="password" />,
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="确认密码"
                  hasFeedback
                >
                  {getFieldDecorator('confirm', {
                    validateTrigger: 'onBlur',
                    rules: [{
                      required: true, message: '请确认密码!',
                    }, {
                      validator: this.checkPassword,
                    }],
                  })(
                    <Input type="password" onBlur={this.handleConfirmBlur} />,
                  )}
                </FormItem>
                <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }}>
                  {getFieldDecorator('agreement', {
                    valuePropName: 'checked',
                    rules: [{
                      required: true, message: '请阅读网站用户注册协议！',
                    }],
                  })(
                    <Checkbox>我已经阅读 <Agreement /></Checkbox>,
                  )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                  <Button type="primary" htmlType="submit">注册</Button>
                  <Back />
                </FormItem>
              </Form>
            </Card>
          </Col>
          <Col span={6} />
        </Row>
      </div>
    );
  }
}

const Register = Form.create()(RegistrationForm);

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Register);
