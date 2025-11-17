import React from 'react';
import Layout from './../components/layouts/Layout';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Layout>{children}</Layout>;
};

export default AdminLayout;