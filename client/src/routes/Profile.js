import React from 'react';
import { Layout, Row, Col, Card } from 'antd';
import { connect } from 'dva';
import Navigator from 'components/Navigator';
import avatar from 'assets/avatar.png';
import 'wysiwyg.css';
import style from './Profile.css';

const { Content, Footer } = Layout;

class Profile extends React.Component {

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'index/update', payload: { defaultMenu: 'profile' } });
  }

  render() {
    return (
      <Layout style={{ height: '100%', minWidth: '1200px' }}>
        <Navigator />
        <Layout>
          <Content style={{ padding: '0 50px', margin: '45px 50px', backgroundColor: '#fff', minWidth: '1280px' }}>
            <Row className={style.row}>
              <Col span={4} />
              <Col span={6} className={style.col1}>
                <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }}>
                  <div className="custom-image">
                    <img alt="example" width="100%" src={avatar} />
                  </div>
                  <div>
                    <h3>王乐城愚人云端</h3>
                    <p>www.yurencloud.com</p>
                  </div>
                </Card>
              </Col>
              <Col span={14}>
                <Card title="作者简介" bordered={false} style={{ width: 300, border: '1px solid #eee' }}>
                  <p>姓名：王乐城</p>
                  <p>职业：前端开发工程师</p>
                  <p>微博：<a href="http://weibo.com/yurencloud">王乐城愚人云端</a></p>
                  <p>博客：<a href="http://www.yurencloud.com">www.yurencloud.com</a></p>
                  <p>简书：<a href="https://www.jianshu.com/u/bf204fc7dc81">王乐城愚人云端</a></p>
                  <p>github：<a href="http://www.github.com/mack-wang">github.com/mack-wang</a></p>
                  <p>公众号：愚人云端</p>
                </Card>
              </Col>
            </Row>
          </Content>
        </Layout>
        <Footer style={{ textAlign: 'center', width: '100%' }}>
          愚人云端 ©2017 浙ICP备17042562号
        </Footer>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps)(Profile);
