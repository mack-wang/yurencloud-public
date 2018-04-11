import React from 'react';
import CatalogList from 'components/CatalogList';
import AdminLayout from 'components/AdminLayout';

export default function AdminCatalogList(props) {

  return (
    <AdminLayout {...props}>
      <CatalogList />
    </AdminLayout>
  );
}

