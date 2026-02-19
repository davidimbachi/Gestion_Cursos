import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

// Importar estilos desde src/styles/
import '../../styles/variables.css';
import '../../styles/layout/style.css';

const MainLayout = ({ children, user = null, grupoNombre = '', sidebarMenus = [] }) => {
  const location = useLocation();
  const [notificaciones, setNotificaciones] = useState([]);

  // Función para mostrar notificaciones
  const mostrarNotificacion = (tipo, mensaje) => {
    const colores = {
      'success': '#10b981',
      'error': '#dc2626',
      'warning': '#f59e0b',
      'info': '#0a3274'
    };

    const iconos = {
      'success': 'fa-check-circle',
      'error': 'fa-exclamation-circle',
      'warning': 'fa-exclamation-triangle',
      'info': 'fa-info-circle'
    };

    const nuevaNotificacion = {
      id: Date.now(),
      tipo,
      mensaje,
      color: colores[tipo] || colores.info,
      icono: iconos[tipo] || iconos.info
    };

    setNotificaciones(prev => [...prev, nuevaNotificacion]);

    setTimeout(() => {
      setNotificaciones(prev => prev.filter(n => n.id !== nuevaNotificacion.id));
    }, 4000);
  };

  // Hacer disponible globalmente
  useEffect(() => {
    window.mostrarNotificacion = mostrarNotificacion;
    window.showAlert = mostrarNotificacion;

    return () => {
      delete window.mostrarNotificacion;
      delete window.showAlert;
    };
  }, []);

  // Obtener iniciales del usuario
  const getInitials = () => {
    if (!user) return 'U';
    const first = user.first_name?.charAt(0) || '';
    const last = user.last_name?.charAt(0) || '';
    return first + last || 'U';
  };

  // Menús por defecto
  const defaultMenus = [
    {
      category: 'Principal',
      links: [
        { url: '/', label: 'Inicio', icon: 'fas fa-home' }
      ]
    },
    {
      category: 'Configuración',
      links: [
        { url: '/ajustes', label: 'Ajustes', icon: 'fas fa-users' },
        { url: '/ayuda', label: 'Ayuda', icon: 'fas fa-book' },
        { url: '/logout', label: 'Cerrar Sesión', icon: 'fas fa-sign-out-alt' }
      ]
    }
  ];

  const menus = sidebarMenus.length > 0 ? sidebarMenus : defaultMenus;

  return (
    <>
      {/* Estilos externos */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/themes/material_blue.css" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
      
      <body className="body">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar__logo">
            <img src="/img/logo_sena.png" alt="Logo Sena" className="sidebar__logo-img" />
            <p className="sidebar__role"></p>
          </div>
          
          <nav className="sidebar__nav">
            {menus.map((menu, index) => (
              <React.Fragment key={index}>
                <div className="menu-category">{menu.category}</div>
                {menu.links.map((link, linkIndex) => (
                  <Link
                    key={linkIndex}
                    to={link.url}
                    className={`sidebar__link ${location.pathname === link.url ? 'sidebar__link--active' : ''}`}
                  >
                    <i className={link.icon}></i>
                    {link.label}
                  </Link>
                ))}
              </React.Fragment>
            ))}
          </nav>
        </aside>

        {/* Header - FUERA del dashboard */}
        <div className="header">
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Buscar" />
          </div>
          
          <div className="user-menu">
            <div className="user-info">
              <div className="user-name">
                {user?.first_name || 'Usuario'} {user?.last_name || ''}
              </div>
              <div className="user-role">{grupoNombre || 'Instructor'}</div>
            </div>
            <div className="user-avatar">
              {getInitials()}
            </div>
          </div>
        </div>

        {/* Dashboard (sin header) */}
        <div className="dashboard">
          {/* Contenido principal */}
          {children}

          {/* Sistema de notificaciones */}
          <div 
            id="notification-container" 
            className="position-fixed bottom-0 end-0 p-3" 
            style={{ zIndex: 9999, maxWidth: '350px' }}
          >
            {notificaciones.map(notif => (
              <div key={notif.id} className="notification-item mb-2">
                <div 
                  className="toast align-items-center text-white border-0 show" 
                  role="alert" 
                  style={{ backgroundColor: notif.color }}
                >
                  <div className="d-flex">
                    <div className="toast-body d-flex align-items-center gap-2">
                      <i className={`fas ${notif.icono}`}></i>
                      <span>{notif.mensaje}</span>
                    </div>
                    <button 
                      type="button" 
                      className="btn-close btn-close-white me-2 m-auto"
                      onClick={() => setNotificaciones(prev => prev.filter(n => n.id !== notif.id))}
                    ></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scripts externos */}
        <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
        <script src="https://cdn.jsdelivr.net/npm/flatpickr/dist/l10n/es.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js"></script>
      </body>
    </>
  );
};

export default MainLayout;