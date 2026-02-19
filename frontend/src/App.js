import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import OfertasList from './components/OfertasList';

const menuBase = [
  {
    category: "Configuración",
    links: [
      { url: "/ayuda", icon: "fas fa-question-circle", label: "Ayuda" },
      { url: "/logout", icon: "fas fa-sign-out-alt", label: "Cerrar Sesión" }
    ]
  }
];

// Menús específicos por rol
const menusEspecificos = {
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

// Función para combinar menús específicos + base
const obtenerMenuCompleto = (rol) => {
  const especifico = menusEspecificos[rol] || menusEspecificos.Instructor;
  return [...especifico, ...menuBase];
};

// ===== DATOS DEL USUARIO (quemados por ahora) =====
const usuarioData = {
  first_name: 'Wendy',
  last_name: 'García',
  rol: 'Instructor'  // Cambia aquí para probar: 'SuperAdmin', 'Instructor', 'Funcionario', 'Coordinador'
};

function App() {
  // Obtener el menú completo según el rol del usuario
  const menuCompleto = obtenerMenuCompleto(usuarioData.rol);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
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
            <h2>Crear Oferta</h2>
          </MainLayout>
        }/>

        <Route path="/solicitudes" element={
          <MainLayout 
            user={usuarioData} 
            grupoNombre={usuarioData.rol}
            sidebarMenus={menuCompleto}
          >
            <h2>Solicitudes</h2>
          </MainLayout>
        }/>

        <Route path="/usuarios" element={
          <MainLayout 
            user={usuarioData} 
            grupoNombre={usuarioData.rol}
            sidebarMenus={menuCompleto}
          >
            <h2>Usuarios</h2>
          </MainLayout>
        }/>

        <Route path="/programas" element={
          <MainLayout 
            user={usuarioData} 
            grupoNombre={usuarioData.rol}
            sidebarMenus={menuCompleto}
          >
            <h2>Programas</h2>
          </MainLayout>
        }/>

        <Route path="/reportes" element={
          <MainLayout 
            user={usuarioData} 
            grupoNombre={usuarioData.rol}
            sidebarMenus={menuCompleto}
          >
            <h2>Reportes</h2>
          </MainLayout>
        }/>

        <Route path="/instructores" element={
          <MainLayout 
            user={usuarioData} 
            grupoNombre={usuarioData.rol}
            sidebarMenus={menuCompleto}
          >
            <h2>Instructores</h2>
          </MainLayout>
        }/>

        <Route path="/ayuda" element={
          <MainLayout 
            user={usuarioData} 
            grupoNombre={usuarioData.rol}
            sidebarMenus={menuCompleto}
          >
            <h2>Ayuda</h2>
          </MainLayout>
        }/>

        <Route path="/logout" element={
          <MainLayout 
            user={usuarioData} 
            grupoNombre={usuarioData.rol}
            sidebarMenus={menuCompleto}
          >
            <h2>Cerrando sesión...</h2>
          </MainLayout>
        }/>
      </Routes>
    </Router>
  );
}

export default App;