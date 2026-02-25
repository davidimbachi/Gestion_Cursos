// components/admin/admin.jsx
import MainLayout from '../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
const Admin = ({ user, grupoNombre, sidebarMenus }) => {
  return (
    <MainLayout
      user={user}
      grupoNombre={grupoNombre}
      sidebarMenus={sidebarMenus} // ← recíbelo y pásalo
    >
      <h1>Panel de Administración</h1>
    </MainLayout>
  );
};
export default Admin;