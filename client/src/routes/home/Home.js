import React from 'react';
import HomeLayout from 'components/HomeLayout';
import { Layout, Breadcrumb } from 'antd';

const { Content } = Layout;

export default function Home(props) {
  return (
    <HomeLayout {...props}>
      <Layout style={{ padding: '0 24px 24px' }}>
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>个人中心</Breadcrumb.Item>
          <Breadcrumb.Item>编辑信息</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{ background: '#fff', padding: 24, margin: 0 }}>
          注册会员功能暂未上线
        </Content>
      </Layout>
    </HomeLayout>
  );
}
