import React from 'react';
import { BrowserRouter as Router, Routes, Route,Navigate  } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import OfertasList from './components/OfertasList';
import CrearOferta from './components/ofertas/CrearOferta';

// ── Auth ──────────────────────────────────────────
import Login          from './components/autentificacion/Login';
import Register       from './components/autentificacion/Register';
import ForgotPassword from './components/autentificacion/ForgotPassword';
import Admin          from './components/admin/admin';
import SolicitudesAdmin from './components/admin/solicitudesAdmin';
import { useState, useEffect } from "react";
import ResetPassword from "./components/autentificacion/ResetPassword";
import ConfirmarEmail from "./components/autentificacion/ConfirmarEmail";




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
  ],
  Administrador: [
  {
    category: "Gestión",
    links: [
      { url: "/solicitudesrol", icon: "fas fa-users-cog", label: "solicitudesrol" },    
    ]
  },
  // {
  //   category: "Usuarios",  // ← nueva categoría
  //   links: [
  //     { url: "/usuarios", icon: "fas fa-users", label: "Ver Usuarios" },
  //     { url: "/usuarios/crear", icon: "fas fa-user-plus", label: "Crear Usuario" },
  //   ]
  // },
],
};

const menuBase = [
  {
    category: "Configuración",
    links: [
      { url: "/ayuda", icon: "fas fa-question-circle", label: "Ayuda" },
      { url: "/Login", icon: "fas fa-sign-out-alt", label: "Cerrar Sesión" }
    ]
  }
];

const obtenerMenuCompleto = (rol) => {
  const especifico = menusPorRol[rol] || menusPorRol.Instructor;
  return [...especifico, ...menuBase];
};

function App() {
  //  Lee del localStorage reactivamente
  const [storedUser, setStoredUser] = useState(
    JSON.parse(localStorage.getItem("usuario") || "{}")
  );

  //  Escucha cambios del localStorage (cuando hace login)
  useEffect(() => {
  const sync = () => setStoredUser(JSON.parse(localStorage.getItem("usuario") || "{}"));
  
  window.addEventListener("localStorageUpdated", sync); // ← mismo nombre
  return () => window.removeEventListener("localStorageUpdated", sync);
}, []);

  const usuarioData = {
    first_name: storedUser.first_name || storedUser.username || "Usuario",
    last_name:  storedUser.last_name  || "",
    rol:        storedUser.rol        || "Invitado",
  };

  const menuCompleto = obtenerMenuCompleto(usuarioData.rol);

  return (
    <Router>
      <Routes>
        <Route path="/confirmar/:token" element={<ConfirmarEmail />} /> 
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/admin" element={<Admin user={usuarioData} 
          grupoNombre={usuarioData.rol}
          sidebarMenus={menuCompleto}  
        />} />
        <Route path="/solicitudesrol" element={
        <MainLayout
          user={usuarioData}
          grupoNombre={usuarioData.rol}
          sidebarMenus={menuCompleto}
        >
          <SolicitudesAdmin />
        </MainLayout>
      }/>
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