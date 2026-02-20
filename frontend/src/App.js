import React from 'react';
import { BrowserRouter as Router, Routes, Route,Navigate  } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import OfertasList from './components/OfertasList';
import CrearOferta from './components/ofertas/CrearOferta';

// ── Auth ──────────────────────────────────────────
import Login          from './components/autentificacion/Login';
import Register       from './components/autentificacion/Register';
import ForgotPassword from './components/autentificacion/ForgotPassword';

const menusPorRol = {
  SuperAdmin: [
    {
      category: "Francisco",
      links: [
        { url: "/reportes", icon: "fas fa-chart-bar", label: "Reportes" }
      ]
    },
    {
      category: "Gestión",
      links: [
        { url: "/usuarios", icon: "fas fa-users", label: "Usuarios" },
        { url: "/programas", icon: "fas fa-book", label: "Programas de formación" },
        { url: "/ofertas", icon: "fas fa-tasks", label: "Ofertas" }
      ]
    }
  ],
  
  Instructor: [
    {
      category: "Gestión",
      links: [
        { url: "/ofertas/crear", icon: "fas fa-plus-circle", label: "Crear oferta" },
        { url: "/ofertas", icon: "fas fa-tasks", label: "Mis ofertas" },
        { url: "/solicitudes", icon: "fas fa-envelope-open-text", label: "Solicitudes" }
      ]
    }
  ],
  
  Funcionario: [
    {
      category: "Gestión",
      links: [
        { url: "/reportes", icon: "fas fa-chart-line", label: "Reportes" },
        { url: "/programas", icon: "fas fa-book-open", label: "Programas" },
        { url: "/solicitudes", icon: "fas fa-envelope-open-text", label: "Solicitudes" }
      ]
    }
  ],
  
  Coordinador: [
    {
      category: "Gestión",
      links: [
        { url: "/solicitudes", icon: "fas fa-inbox", label: "Solicitudes" },
        { url: "/instructores", icon: "fas fa-chalkboard-teacher", label: "Instructores" }
      ]
    }
  ]
};

const menuBase = [
  {
    category: "Configuración",
    links: [
      { url: "/ayuda", icon: "fas fa-question-circle", label: "Ayuda" },
      { url: "/logout", icon: "fas fa-sign-out-alt", label: "Cerrar Sesión" }
    ]
  }
];

const obtenerMenuCompleto = (rol) => {
  const especifico = menusPorRol[rol] || menusPorRol.Instructor;
  return [...especifico, ...menuBase];
};

const usuarioData = {
  first_name: 'Wendy',
  last_name: 'García',
  rol: 'Instructor'
};

function App() {
  const menuCompleto = obtenerMenuCompleto(usuarioData.rol);

  return (
    <Router>
      <Routes>
         {/* ── Rutas públicas (sin MainLayout) ── */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot"   element={<ForgotPassword />} />

        {/* Redirige la raíz al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ── Rutas privadas (con MainLayout) ── */}
        <Route path="/inicio" element={
          <MainLayout
            user={usuarioData}
            grupoNombre={usuarioData.rol}
            sidebarMenus={menuCompleto}
          >
            <h1>Bienvenido al Sistema</h1>
          </MainLayout>
        }/>
        
        <Route path="/ofertas" element={
          <MainLayout 
            user={usuarioData} 
            grupoNombre={usuarioData.rol}
            sidebarMenus={menuCompleto}
          >
            <OfertasList />
          </MainLayout>
        }/>

        <Route path="/ofertas/crear" element={
          <MainLayout 
            user={usuarioData} 
            grupoNombre={usuarioData.rol}
            sidebarMenus={menuCompleto}
          >
            <CrearOferta />
          </MainLayout>
        }/>
      </Routes>
    </Router>
  );
}

export default App;