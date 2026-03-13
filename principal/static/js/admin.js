// ==================== //
// Data / Datos         //
// ==================== //

const psicologos = [
    {
        id: 1,
        nombre: "Dra. Ana López",
        email: "ana.lopez@psicosalud.com",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
        especialidad: "Psicología Clínica",
        badgeColor: "teal",
        dias: "Lunes a Viernes",
        horario: "09:00 - 14:00, 16:00 - 19:00"
    },
    {
        id: 2,
        nombre: "Dr. Roberto Torres",
        email: "roberto.torres@psicosalud.com",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        especialidad: "Terapia de Pareja",
        badgeColor: "green",
        dias: "Martes a Sábado",
        horario: "10:00 - 18:00"
    },
    {
        id: 3,
        nombre: "Dra. Sofía Ramírez",
        email: "sofia.ramirez@psicosalud.com",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        especialidad: "Psicología Infantil",
        badgeColor: "teal",
        dias: "Lunes, Miércoles, Viernes",
        horario: "08:00 - 15:00"
    },
    {
        id: 4,
        nombre: "Dr. Luis Méndez",
        email: "luis.mendez@psicosalud.com",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        especialidad: "Psiquiatría",
        badgeColor: "blue",
        dias: "Lunes a Jueves",
        horario: "12:00 - 20:00"
    }
];

const administradores = [
    {
        id: 1,
        nombre: "Carlos Ruiz",
        email: "carlos.ruiz@fym.com",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        rol: "Admin. General",
        rolColor: "teal",
        estado: "Activo"
    },
    {
        id: 2,
        nombre: "Elena Vázquez",
        email: "elena.vazquez@fym.com",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
        rol: "Operador",
        rolColor: "green",
        estado: "Activo"
    },
    {
        id: 3,
        nombre: "Miguel Hernández",
        email: "miguel.h@fym.com",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        rol: "Operador",
        rolColor: "green",
        estado: "Activo"
    }
];

const chatUsers = [
    { id: 1, nombre: "@maria.g", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
    { id: 2, nombre: "@juanp", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
    { id: 3, nombre: "@laura.ps", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
    { id: 4, nombre: "@carlos_87", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
    { id: 5, nombre: "@ana.l", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face" }
];

const chatMessages = [
    { tipo: "incoming", texto: "Hola, tengo un problema para agendar mi cita de la próxima semana.", hora: "Hoy · 10:12" },
    { tipo: "outgoing", texto: "Hola María, con gusto te apoyo. ¿Te aparece algún mensaje de error al intentar agendar?", hora: "Hoy · 10:15 · Tú" },
    { tipo: "incoming", texto: "Sí, me indica que no hay horarios disponibles con mi psicóloga.", hora: "Hoy · 10:17" }
];

const actividades = [
    {
        tipo: "reporte",
        titulo: "Nuevo reporte de sistema: Lucía P.",
        descripcion: "Problema con el agendamiento de cita en Psicología Infantil.",
        tiempo: "Hace 2 hrs",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face"
    },
    {
        tipo: "psicologo",
        titulo: "Nuevo psicólogo registrado",
        descripcion: "Dr. Roberto Gómez asignado a Terapia Familiar.",
        tiempo: "Hoy, 09:30 AM",
        icono: true
    },
    {
        tipo: "soporte",
        titulo: "Mensaje de soporte: Carlos M.",
        descripcion: "Consulta sobre facturación mensual de citas.",
        tiempo: "Ayer",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
        tipo: "actualizacion",
        titulo: "Actualización de especialidad",
        descripcion: 'Se modificaron los detalles en "Psicooncología".',
        tiempo: "Ayer",
        icono: true
    }
];

const adminListSidebar = [
    { nombre: "Admin Principal", rol: "Super Administrador", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", activo: true },
    { nombre: "Sofía Reyes", rol: "Soporte Técnico", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", activo: true },
    { nombre: "Hugo Valencia", rol: "Gestión de Personal", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", activo: false }
];

// ==================== //
// SVG Icons            //
// ==================== //
const icons = {
    users: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    heart: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
    file: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    brain: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/></svg>',
    calendar: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',
    clock: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    edit: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>',
    trash: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',
    plus: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>',
    search: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>',
    chevronLeft: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
    chevronRight: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
    check: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    paperclip: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>',
    send: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
    userPlus: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>',
    settings: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>'
};

// ==================== //
// Page Templates       //
// ==================== //

function renderInicio() {
    return `
        <!-- Stats Grid -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Psicólogos Activos</span>
                    <div class="stat-icon teal">${icons.users}</div>
                </div>
                <div class="stat-value">24</div>
                <span class="stat-change positive">+2 este mes</span>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Pacientes Registra...</span>
                    <div class="stat-icon green">${icons.heart}</div>
                </div>
                <div class="stat-value">845</div>
                <span class="stat-change positive">+15% vs mes anterior</span>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Reportes Pendientes</span>
                    <div class="stat-icon blue">${icons.file}</div>
                </div>
                <div class="stat-value">12</div>
                <span class="stat-change neutral">Requieren atención</span>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Especialidades</span>
                    <div class="stat-icon pink">${icons.brain}</div>
                </div>
                <div class="stat-value">6</div>
                <span class="stat-change neutral">Servicios ofrecidos</span>
            </div>
        </div>

        <!-- Content Grid -->
        <div class="content-grid">
            <!-- Activity Section -->
            <div class="content-card">
                <div class="card-header">
                    <h3 class="card-title">Actividad Reciente y Reportes</h3>
                    <a href="#" class="card-link">Ver todos</a>
                </div>
                <div class="activity-list">
                    ${actividades.map(act => `
                        <div class="activity-item">
                            ${act.avatar ? 
                                `<img src="${act.avatar}" alt="" class="activity-avatar">` :
                                `<div class="activity-icon">${icons.users}</div>`
                            }
                            <div class="activity-content">
                                <div class="activity-title">${act.titulo}</div>
                                <div class="activity-description">${act.descripcion}</div>
                            </div>
                            <span class="activity-time">${act.tiempo}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Admins Section -->
            <div class="content-card">
                <div class="card-header">
                    <h3 class="card-title">Administradores</h3>
                </div>
                <div class="admin-list">
                    ${adminListSidebar.map(admin => `
                        <div class="admin-item">
                            <img src="${admin.avatar}" alt="${admin.nombre}" class="admin-avatar">
                            <div class="admin-info">
                                <div class="admin-name">${admin.nombre}</div>
                                <div class="admin-role">${admin.rol}</div>
                            </div>
                            <span class="admin-status">${admin.activo ? icons.check : ''}</span>
                        </div>
                    `).join('')}
                </div>
                <button class="btn-primary" style="width: 100%; margin-top: 1rem; justify-content: center;">
                    ${icons.plus} Nuevo Administrador
                </button>
            </div>
        </div>
    `;
}

function renderPsicologos() {
    return `
        <p class="page-description">Gestiona el directorio de especialistas, sus perfiles y horarios de atención.</p>
        
        <div class="table-container">
            <div class="table-header">
                <div class="search-box">
                    ${icons.search}
                    <input type="text" placeholder="Buscar por nombre o especialidad...">
                </div>
                <button class="btn-primary">
                    ${icons.plus} Agregar Psicólogo
                </button>
            </div>
            
            <table class="data-table">
                <thead>
                    <tr>
                        <th>PSICÓLOGO</th>
                        <th>ESPECIALIDAD</th>
                        <th>HORARIO DE ATENCIÓN</th>
                        <th>ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    ${psicologos.map(psi => `
                        <tr>
                            <td>
                                <div class="table-user">
                                    <img src="${psi.avatar}" alt="${psi.nombre}" class="table-avatar">
                                    <div class="table-user-info">
                                        <span class="table-user-name">${psi.nombre}</span>
                                        <span class="table-user-email">${psi.email}</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="badge badge-${psi.badgeColor}">${psi.especialidad}</span>
                            </td>
                            <td>
                                <div class="table-schedule">
                                    <span class="schedule-days">${icons.calendar} ${psi.dias}</span>
                                    <span class="schedule-time">${icons.clock} ${psi.horario}</span>
                                </div>
                            </td>
                            <td>
                                <div class="table-actions">
                                    <button class="action-btn edit" title="Editar">${icons.edit}</button>
                                    <button class="action-btn delete" title="Eliminar">${icons.trash}</button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="table-footer">
                <span class="table-info">Mostrando 1 a ${psicologos.length} de ${psicologos.length} psicólogos</span>
                <div class="pagination">
                    <button class="pagination-btn">${icons.chevronLeft}</button>
                    <button class="pagination-btn">${icons.chevronRight}</button>
                </div>
            </div>
        </div>
    `;
}

function renderReportes() {
    return `
        <p class="page-description">Revisa los mensajes de los usuarios y responde desde el chat integrado.</p>
        
        <div class="chat-container">
            <!-- Chat Sidebar -->
            <div class="chat-sidebar">
                <div class="chat-sidebar-header">
                    <div class="chat-sidebar-title">
                        <h3>Usuarios</h3>
                        <span>${chatUsers.length} usuarios</span>
                    </div>
                    <div class="chat-search">
                        ${icons.search} Buscar por usuario
                    </div>
                </div>
                <div class="chat-users">
                    ${chatUsers.map((user, index) => `
                        <div class="chat-user ${index === 0 ? 'active' : ''}" data-user="${user.id}">
                            <img src="${user.avatar}" alt="${user.nombre}" class="chat-user-avatar">
                            <span class="chat-user-name">${user.nombre}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Chat Main -->
            <div class="chat-main">
                <div class="chat-header">
                    <img src="${chatUsers[0].avatar}" alt="" class="chat-header-avatar">
                    <div class="chat-header-info">
                        <span class="chat-header-name">${chatUsers[0].nombre}</span>
                        <span class="chat-header-status">Último mensaje hace 5 minutos</span>
                    </div>
                </div>
                
                <div class="chat-messages">
                    ${chatMessages.map(msg => `
                        <div class="message ${msg.tipo}">
                            <div class="message-bubble">${msg.texto}</div>
                            <span class="message-time">${msg.hora}</span>
                        </div>
                    `).join('')}
                </div>

                <div class="chat-input-container">
                    <input type="text" class="chat-input" placeholder="Escribe un mensaje...">
                    <button class="chat-attach-btn">${icons.paperclip}</button>
                    <button class="chat-send-btn">${icons.send} Enviar</button>
                </div>
            </div>
        </div>
    `;
}

function renderAdministrador() {
    return `
        <p class="page-description">Gestiona los usuarios con acceso al panel de administración, roles y permisos dentro del sistema.</p>
        
        <div class="table-container">
            <div class="table-header">
                <div class="search-box">
                    ${icons.search}
                    <input type="text" placeholder="Buscar por nombre o correo...">
                </div>
                <button class="btn-primary">
                    ${icons.plus} Agregar Administrador
                </button>
            </div>
            
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ADMINISTRADOR</th>
                        <th>ROL</th>
                        <th>ESTADO</th>
                        <th>ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    ${administradores.map(admin => `
                        <tr>
                            <td>
                                <div class="table-user">
                                    <img src="${admin.avatar}" alt="${admin.nombre}" class="table-avatar">
                                    <div class="table-user-info">
                                        <span class="table-user-name">${admin.nombre}</span>
                                        <span class="table-user-email">${admin.email}</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="badge badge-${admin.rolColor}">${admin.rol}</span>
                            </td>
                            <td>
                                <span class="badge badge-green">${admin.estado}</span>
                            </td>
                            <td>
                                <div class="table-actions">
                                    <button class="action-btn edit" title="Editar">${icons.edit}</button>
                                    <button class="action-btn delete" title="Eliminar">${icons.trash}</button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="table-footer">
                <span class="table-info">Mostrando 1 a ${administradores.length} de ${administradores.length} administradores</span>
                <div class="pagination">
                    <button class="pagination-btn">${icons.chevronLeft}</button>
                    <button class="pagination-btn">${icons.chevronRight}</button>
                </div>
            </div>
        </div>
    `;
}

// ==================== //
// Navigation           //
// ==================== //

const pageTitles = {
    inicio: 'Resumen General',
    psicologos: 'Psicólogos',
    reportes: 'Reportes',
    administrador: 'Administradores'
};

const pageRenderers = {
    inicio: renderInicio,
    psicologos: renderPsicologos,
    reportes: renderReportes,
    administrador: renderAdministrador
};

function navigateTo(page) {
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === page) {
            item.classList.add('active');
        }
    });

    // Update page title
    document.getElementById('pageTitle').textContent = pageTitles[page] || 'Panel';

    // Render page content
    const pageContent = document.getElementById('pageContent');
    pageContent.style.opacity = '0';
    
    setTimeout(() => {
        pageContent.innerHTML = pageRenderers[page]();
        pageContent.style.opacity = '1';
        
        // Add chat user click handlers if on reportes page
        if (page === 'reportes') {
            setupChatHandlers();
        }
    }, 150);
}

function setupChatHandlers() {
    document.querySelectorAll('.chat-user').forEach(user => {
        user.addEventListener('click', function() {
            document.querySelectorAll('.chat-user').forEach(u => u.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// ==================== //
// Initialization       //
// ==================== //

document.addEventListener('DOMContentLoaded', function() {
    // Add transition to page content
    const pageContent = document.getElementById('pageContent');
    pageContent.style.transition = 'opacity 0.15s ease';

    // Setup navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            navigateTo(this.dataset.page);
        });
    });

    // Load initial page
    navigateTo('inicio');
});
