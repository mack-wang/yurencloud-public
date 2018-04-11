import React from 'react';
import ArticleList from 'components/ArticleList';
import AdminLayout from 'components/AdminLayout';

export default function AdminArticleList(props) {
  return (
    <AdminLayout {...props}>
      <ArticleList />
    </AdminLayout>
  );
}

