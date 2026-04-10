// ==================== //
// Data / Datos         //
// ==================== //

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
    x: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    eye: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    chevronDown: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>'
};

// ==================== //
// Modal Templates      //
// ==================== //

function renderSuccessModal(mensaje, titulo = "¡Todo listo!") {
    const existing = document.getElementById('successModal');
    if (existing) existing.remove();

    const modalHTML = `
        <div id="successModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 999999;">
            <div style="text-align: center; padding: 40px; max-width: 400px; width: 90%; background: white; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2); animation: scaleUp 0.3s ease-out;">
                <div style="background: #f0fdfa; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                    <span style="font-size: 40px;">✅</span>
                </div>
                <h2 style="color: #0d9488; margin-bottom: 10px; font-family: 'Playfair Display', serif; font-size: 24px;">${titulo}</h2>
                <p style="color: #64748b; margin-bottom: 25px; font-family: 'Work Sans', sans-serif;">
                    ${mensaje}
                </p>
                <button class="btn-primary-modal" style="width: 100%; padding: 12px; cursor: pointer; background: #2dd4bf; color: white; border: none; border-radius: 8px; font-weight: 600;" onclick="location.reload()">
                    Entendido
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function togglePassword(id) {
    const input = document.getElementById(id);
    input.type = input.type === 'password' ? 'text' : 'password';
}


// ==================== //
// Modal Functions      //
// ==================== //

function openModal(modalId, data = null) {
    let modalHtml = '';
    
    switch(modalId) {
        case 'addPsychologistModal':
            modalHtml = renderAddPsychologistModal();
            break;
        case 'editAdminModal':
            modalHtml = renderEditAdminModal(data);
            break;
        case 'addAdminModal':
            modalHtml = renderAddAdminModal();
            break;
        case 'deleteAdminModal':
            modalHtml = renderDeleteAdminModal(data);
            break;
    }
    
    // Remove existing modal if any
    const existingModal = document.getElementById(modalId);
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Animate in
    setTimeout(() => {
        document.getElementById(modalId).classList.add('active');
    }, 10);
    
    document.body.style.overflow = 'hidden';
    
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        
        modal.remove();
        
        document.body.style.overflow = 'auto';
    }
}

function setupScheduleOptions() {
    document.querySelectorAll('.schedule-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.schedule-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal-overlay.active');
        modals.forEach(modal => {
            closeModal(modal.id);
        });
    }
});

// ==================== //
// Page Templates       //
// ==================== //

async function cargarDatosDashboard() {
    const response = await fetch('/api/dashboard/stats/');
    const data = await response.json();
    
    // Guardamos para que renderInicio() tenga qué mostrar
    window.dashboardStats = data.stats;
    window.actividades = data.actividades;

    // Inyectamos el HTML manualmente ya que estamos dentro de una promesa
    const pageContent = document.getElementById('pageContent');
    if (pageContent) {
        pageContent.innerHTML = renderInicio();
    }
}

function renderInicio() {
    const stats = window.dashboardStats || { psis_activos: 0, admins_total: 0, pacientes_total: 0, reportes_pendientes: 0, especialidades_total: 0 };
    const admins = window.listaAdministradores || [];
    const listaActividades = window.actividades || [];

    return `
        <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Psicólogos Activos</span>
                    <div class="stat-icon teal">${icons.users}</div>
                </div>
                <div class="stat-value">${stats.psis_activos}</div>
                <span class="stat-change positive">En línea</span>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Pacientes</span>
                    <div class="stat-icon blue">${icons.users}</div>
                </div>
                <div class="stat-value">${stats.pacientes_total}</div>
                <span class="stat-change">Registrados</span>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Reportes</span>
                    <div class="stat-icon red">${icons.heart}</div>
                </div>
                <div class="stat-value">${stats.reportes_pendientes}</div>
                <span class="stat-change negative">Pendientes</span>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Especialidades</span>
                    <div class="stat-icon green">${icons.check}</div>
                </div>
                <div class="stat-value">${stats.especialidades_total}</div>
                <span class="stat-change">Disponibles</span>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Administradores</span>
                    <div class="stat-icon green">${icons.heart}</div>
                </div>
                <div class="stat-value">${stats.admins_total}</div>
                <span class="stat-change positive">Staff total</span>
            </div>
        </div>

        <div class="content-grid">
            <div class="content-card">
                <div class="card-header">
                    <h3 class="card-title">Actividad Reciente y Reportes</h3>
                    <a href="#" class="card-link" onclick="navigateTo('chat')">Ir al Chat</a>
                </div>
                <div class="activity-list">
                    ${listaActividades.length > 0 ? listaActividades.map(act => `
                        <div class="activity-item">
                            <img src="${act.avatar || '/media/perfiles/default.png'}" class="activity-avatar" onerror="this.src='/media/perfiles/default.png'">
                            <div class="activity-content">
                                <div class="activity-title">${act.titulo}</div>
                                <div class="activity-description">${act.descripcion}</div>
                            </div>
                            <span class="activity-time">${act.tiempo}</span>
                        </div>
                    `).join('') : '<p style="padding:20px; color:#999;">No hay actividad reciente.</p>'}
                </div>
            </div>

            <div class="content-card">
                <div class="card-header">
                    <h3 class="card-title">Equipo Administrativo</h3>
                </div>
                <div class="admin-list">
                    ${admins.slice(0, 5).map(admin => `
                        <div class="admin-item">
                            <img src="${admin.avatar}" alt="${admin.nombre}" class="admin-avatar" onerror="this.src='/media/perfiles/default.png'">
                            <div class="admin-info">
                                <div class="admin-name">${admin.nombre}</div>
                                <div class="admin-role">${admin.rol}</div>
                            </div>
                            <span class="admin-status">${admin.estado === 'Activo' ? icons.check : ''}</span>
                        </div>
                    `).join('')}
                </div>
                <button class="btn-primary" style="width: 100%; margin-top: 1rem; justify-content: center;" onclick="navigateTo('administrador')">
                    Gestionar Personal
                </button>
            </div>
        </div>
    `;
}

// ==== PSICOLOGOS ==== //

function renderPsicologos() {
    const lista = window.psicologos || [];

    return `
        <div class="table-container">
            <div class="table-header" style="flex-direction: column; align-items: stretch; gap: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div class="search-box">
                        ${icons.search}
                        <input type="text" id="searchPsi" placeholder="Buscar psicólogo por nombre..." onkeyup="filterPsi()">
                    </div>
                    <button class="btn-primary" onclick="renderFormularioPsicologo()">
                        ${icons.plus} Agregar Psicólogo
                    </button>
                </div>
                
                <div style="display: flex; gap: 15px; align-items: center; background: #f8f9fc; padding: 10px; border-radius: 8px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <label style="font-size: 13px; font-weight: bold; color: #4e73df;">Especialidad:</label>
                        <select id="filterEspecialidad" onchange="filterPsi()" style="padding: 5px; border-radius: 5px; border: 1px solid #ddd;">
                            <option value="">Todas</option>
                            ${(window.especialidades || []).map(e => `<option value="${e.nombre}">${e.nombre}</option>`).join('')}
                        </select>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" id="filterActivos" onchange="filterPsi()">
                        <label for="filterActivos" style="font-size: 13px; font-weight: bold; color: #1cc88a;">Solo Activos</label>
                    </div>
                </div>
            </div>
            
            <table class="data-table">
                <thead>
                    <tr>
                        <th>PSICÓLOGO</th>
                        <th>ESPECIALIDAD</th>
                        <th>HORARIO</th>
                        <th>ESTADO</th>
                        <th>ACCIONES</th>
                    </tr>
                </thead>
                <tbody id="psiTableBody">
                    ${lista.map(psi => `
                        <tr data-nombre="${psi.nombre.toLowerCase()}" 
                            data-especialidad="${psi.especialidad}" 
                            data-estado="${psi.estado_cuenta}">
                            <td>
                                <div class="table-user">
                                    <img src="${psi.avatar}" class="table-avatar" onerror="this.src='/media/perfiles/default.png'">
                                    <div class="table-user-info">
                                        <span class="table-user-name">${psi.nombre}</span>
                                        <span class="table-user-email">${psi.email}</span>
                                    </div>
                                </div>
                            </td>
                            <td><span class="badge badge-blue">${psi.especialidad}</span></td>
                            <td>
                                <div class="table-schedule">
                                    <span>${icons.calendar} ${psi.dias}</span>
                                    <small>${icons.clock} ${psi.horario}</small>
                                </div>
                            </td>
                            <td>
                                <span class="badge ${psi.estado_cuenta === 'Activo' ? 'badge-green' : 'badge-red'}">
                                    ${psi.estado_cuenta}
                                </span>
                            </td>
                            <td>
                                <div class="table-actions">
                                    <button class="action-btn edit" onclick="renderFormularioPsicologo(${psi.id})">${icons.edit}</button>
                                    <button class="action-btn delete" onclick="eliminarPsicologo(${psi.id})">${icons.trash}</button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function filterPsi() {
    const query = document.getElementById('searchPsi').value.toLowerCase();
    const espFilter = document.getElementById('filterEspecialidad').value;
    const activosOnly = document.getElementById('filterActivos').checked;
    const rows = document.querySelectorAll('#psiTableBody tr');

    rows.forEach(row => {
        const nombre = row.getAttribute('data-nombre');
        const especialidad = row.getAttribute('data-especialidad');
        const estado = row.getAttribute('data-estado');

        const matchesSearch = nombre.includes(query);
        const matchesEsp = espFilter === "" || especialidad === espFilter;
        const matchesActivos = !activosOnly || estado === 'Activo';

        row.style.display = (matchesSearch && matchesEsp && matchesActivos) ? '' : 'none';
    });
}

function renderFormularioPsicologo(id = null) {
    const psicologosArr = window.psicologos || [];
    const horariosArr = window.horarios || [];
    const especialidadesArr = window.especialidades || [];
    
    const psi = id ? psicologosArr.find(p => p.id == id) : null;
    const titulo = psi ? 'Editar Información del psicólogo' : 'Nuevo Psicólogo';
    const partesNombre = (psi && psi.nombre) ? psi.nombre.split(' ') : ['', '', ''];

    const modalHtml = `
        <div id="modalPsicologo" style="position: fixed !important; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 99999;">
            <div style="background: white !important; width: 90vw !important; max-width: 1200px !important; height: 85vh !important; border-radius: 12px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 50px rgba(0,0,0,0.4); position: relative;">
                
                <button onclick="document.getElementById('modalPsicologo').remove()" style="position: absolute; top: 20px; right: 20px; background: none; border: none; font-size: 30px; cursor: pointer; color: #bbb; z-index: 10;">&times;</button>

                <div style="padding: 25px 40px; border-bottom: 1px solid #eee; flex-shrink: 0;">
                    <h2 style="margin: 0; font-size: 1.5rem; color: #333;">${titulo}</h2>
                    <p style="margin: 5px 0 0; color: #777; font-size: 0.9rem;">Actualiza el horario y los datos principales del especialista.</p>
                </div>

                <div style="display: flex !important; flex: 1; overflow: hidden; width: 100%;">
                    
                    <div style="width: 55%; padding: 30px; overflow-y: auto; background: white; border-right: 1px solid #eee;">
                        <div style="display: flex; align-items: center; background: #e3f2fd; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
                            <div style="position: relative;">
                                <img src="${psi && psi.avatar ? psi.avatar : '/media/perfiles/default.png'}" id="preview-psi" style="width: 70px; height: 70px; border-radius: 50%; object-fit: cover; border: 3px solid white;">
                                <label for="foto-psi" style="position: absolute; bottom: 0; right: 0; background: #00acc1; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 2px solid white; font-size: 12px;">✎</label>
                            </div>
                            <input type="file" id="foto-psi" name="foto" form="formPsi" hidden onchange="document.getElementById('preview-psi').src = window.URL.createObjectURL(this.files[0])">
                            <div style="margin-left: 20px;">
                                <h4 style="margin: 0; color: #1a365d;">${psi ? psi.nombre : 'Nuevo Especialista'}</h4>
                                <span style="color: #00acc1; font-weight: bold; font-size: 0.8rem;">Psicólogo del Consultorio</span>
                            </div>
                        </div>

                        <h3 style="font-size: 1rem; color: #333; margin-bottom: 15px;">Modificar horario</h3>
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            ${horariosArr.map(h => `
                                <label style="display: block; border: 2px solid ${psi && psi.horario_id == h.numero ? '#00acc1' : '#f0f0f0'}; padding: 15px; border-radius: 10px; cursor: pointer; background: white;">
                                    <input type="radio" name="horario_id" value="${h.numero}" form="formPsi" ${psi && psi.horario_id == h.numero ? 'checked' : ''} style="float: left; margin-right: 15px; margin-top: 5px;">
                                    <div style="font-weight: bold; color: #333;">${h.nombre}</div>
                                    <div style="font-size: 0.85rem; color: #777;">${h.dias} | ${h.horas}</div>
                                </label>
                            `).join('')}
                        </div>
                    </div>

                    <div style="width: 45%; padding: 30px; background: #b3e5fc; overflow-y: auto;">
                        <h3 style="font-size: 1.1rem; color: #1a365d; margin-bottom: 20px;">Modificar datos</h3>
                        
                        <form id="formPsi" onsubmit="guardarPsicologo(event)" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                            <input type="hidden" name="id" value="${psi ? psi.id : ''}">
                            
                            <div style="grid-column: span 2; background: white; padding: 12px; border-radius: 8px;">
                                <label style="display: block; font-size: 0.7rem; font-weight: bold; color: #666;">Nombre(s)</label>
                                <input type="text" name="nombre" value="${partesNombre[0] || ''}" required style="width: 100%; border: none; outline: none; padding-top: 5px;">
                            </div>

                            <div style="grid-column: span 1; background: white; padding: 12px; border-radius: 8px;">
                                <label style="display: block; font-size: 0.7rem; font-weight: bold; color: #666;">Apellido Paterno</label>
                                <input type="text" name="apellido1" value="${partesNombre[1] || ''}" required style="width: 100%; border: none; outline: none; padding-top: 5px;">
                            </div>
                            <div style="grid-column: span 1; background: white; padding: 12px; border-radius: 8px;">
                                <label style="display: block; font-size: 0.7rem; font-weight: bold; color: #666;">Apellido Materno</label>
                                <input type="text" name="apellido2" value="${partesNombre[2] || ''}" style="width: 100%; border: none; outline: none; padding-top: 5px;">
                            </div>

                            <div style="grid-column: span 1; background: white; padding: 12px; border-radius: 8px;">
                                <label style="display: block; font-size: 0.7rem; font-weight: bold; color: #666;">Género</label>
                                <select name="genero" style="width: 100%; border: none; outline: none; background: white;">
                                    <option value="M" ${psi && psi.genero == 'M' ? 'selected' : ''}>Masculino</option>
                                    <option value="F" ${psi && psi.genero == 'F' ? 'selected' : ''}>Femenino</option>
                                    <option value="O" ${psi && psi.genero == 'O' ? 'selected' : ''}>Otro</option>
                                </select>
                            </div>
                            <div style="grid-column: span 1; background: white; padding: 12px; border-radius: 8px;">
                                <label style="display: block; font-size: 0.7rem; font-weight: bold; color: #666;">Teléfono</label>
                                <input type="text" name="telefono" value="${psi ? psi.telefono : ''}" required style="width: 100%; border: none; outline: none; padding-top: 5px;">
                            </div>

                            <div style="grid-column: span 2; background: white; padding: 12px; border-radius: 8px;">
                                <label style="display: block; font-size: 0.7rem; font-weight: bold; color: #666;">Cédula Profesional</label>
                                <input type="text" name="cedula" value="${psi ? (psi.cedula || '') : ''}" required placeholder="Ingrese la clave de cédula" style="width: 100%; border: none; outline: none; padding-top: 5px;">
                            </div>

                            <div style="grid-column: span 2; background: white; padding: 12px; border-radius: 8px;">
                                <label style="display: block; font-size: 0.7rem; font-weight: bold; color: #666;">Especialidad</label>
                                <select name="especialidad_id" style="width: 100%; border: none; outline: none; background: white;">
                                    ${especialidadesArr.map(e => `<option value="${e.clave}" ${psi && psi.especialidad_clave == e.clave ? 'selected' : ''}>${e.nombre}</option>`).join('')}
                                </select>
                            </div>
                            <div style="grid-column: span 2; background: white; padding: 12px; border-radius: 8px;">
                                <label style="display: block; font-size: 0.7rem; font-weight: bold; color: #666;">Correo electrónico</label>
                                <input type="email" name="correo" value="${psi ? psi.email : ''}" required style="width: 100%; border: none; outline: none; padding-top: 5px;">
                            </div>
                            <div style="grid-column: span 2; background: white; padding: 12px; border-radius: 8px;">
                                <label style="display: block; font-size: 0.7rem; font-weight: bold; color: #666;">Contraseña</label>
                                <input type="password" name="contrasena" placeholder="${psi ? psi.password || '••••••••' : 'Requerida'}" ${psi ? psi.password ? '' : 'required' : 'required'} style="width: 100%; border: none; outline: none; padding-top: 5px;">
                            </div>
                            <div style="grid-column: span 2; background: white; padding: 12px; border-radius: 8px;">
                                <label style="display: block; font-size: 0.7rem; font-weight: bold; color: #666;">Estado de la Cuenta</label>
                                <select name="estado_cuenta" style="width: 100%; border: none; outline: none; background: white; padding-top: 5px; font-weight: bold; color: ${psi && psi.estado_cuenta === 'Inactivo' ? '#e53935' : '#43a047'};" onchange="this.style.color = this.value === 'Inactivo' ? '#e53935' : '#43a047'">
                                    <option value="Activo" ${psi && psi.estado_cuenta === 'Activo' ? 'selected' : ''}>● Activo</option>
                                    <option value="Inactivo" ${psi && psi.estado_cuenta === 'Inactivo' ? 'selected' : ''}>○ Inactivo</option>
                                </select>
                            </div>
                            <div style="grid-column: span 2; display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px;">
                                <button type="button" onclick="document.getElementById('modalPsicologo').remove()" style="padding: 10px 20px; background: white; border: none; border-radius: 6px; color: #666; cursor: pointer;">Cancelar</button>
                                <button type="submit" style="padding: 10px 20px; background: #00acc1; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">Guardar cambios</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const viejo = document.getElementById('modalPsicologo');
    if(viejo) viejo.remove();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

async function eliminarPsicologo(id) {
    const confirmacion = await Swal.fire({
        title: '¿Estás seguro?',
        text: "El psicólogo será dado de baja del sistema.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, dar de baja',
        cancelButtonText: 'Cancelar'
    });

    if (confirmacion.isConfirmed) {
        try {
            const response = await fetch(`/dar_de_baja_psicologo/${id}/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const data = await response.json();
            if (data.success) {
                Swal.fire('¡Dado de baja!', data.message, 'success').then(() => {
                    location.reload();
                });
            } else {
                Swal.fire('Error', data.error, 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'No se pudo completar la acción', 'error');
        }
    }
}

async function guardarPsicologo(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
        // !!! USA LA URL QUE TENGAS EN URLS.PY PARA ESTA FUNCIÓN !!!
        const response = await fetch('/crear_o_editar_psicologo/', { 
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        const result = await response.json();
        if (result.success) {
            Swal.fire('¡Listo!', 'Psicólogo guardado correctamente', 'success').then(() => location.reload());
        } else {
            // Aquí capturamos el error que envías desde el exception de Python
            Swal.fire('Error en Base de Datos', result.error, 'error');
        }
    } catch (error) {
        console.error(error);
        Swal.fire('Error de Conexión', 'No se pudo contactar con el servidor. Revisa la URL.', 'error');
    }
}

// ===== REPORTES Y CHAT ===== //

// Variables globales de estado
window.chatUsers = []; 
let usuarioActivoId = null;
let chatInterval = null; // Para refrescar mensajes automáticamente

async function inicializarChat() {
    const mainContainer = document.getElementById('pageContent'); 
    if (!mainContainer) return;

    try {
        mainContainer.innerHTML = '<div style="padding:20px; text-align:center;">Cargando chat...</div>';

        const response = await fetch('/api/chat/usuarios/');
        const data = await response.json();
        
        window.chatUsers = data; 

        // Pintamos el diseño base
        mainContainer.innerHTML = renderReportes();

        // Si hay usuarios, seleccionamos el primero por defecto
        if (window.chatUsers.length > 0) {
            seleccionarUsuarioChat(window.chatUsers[0].id);
        }

    } catch (e) {
        console.error("Error al inicializar:", e);
        mainContainer.innerHTML = `<p>Error al cargar el chat: ${e.message}</p>`;
    }
}

function irAReportes() {

    const main = document.getElementById('main-content'); // o como se llame tu contenedor

   

    // 2. Cargamos los usuarios (esto llenará window.chatUsers)

    inicializarChat();

}

function renderReportes() {
    const usuarios = window.chatUsers || [];
    const usuarioActual = usuarios.find(u => u.id == usuarioActivoId) || 
                         { nombre: 'Seleccione un chat', avatar: '/media/perfiles/default.png' };

    return `
        <div class="chat-container" style="display: flex; height: 75vh; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 1px solid #eee;">
            
            <div style="width: 30%; border-right: 1px solid #eee; display: flex; flex-direction: column;">
                <div style="padding: 15px; background: #f8f9fa; border-bottom: 1px solid #eee;">
                    <h3 style="margin:0 0 10px 0; font-size: 1.1rem;">Mensajes</h3>
                    <input type="text" placeholder="Buscar contacto..." onkeyup="filtrarUsuarios(this.value)"
                           style="width: 100%; padding: 8px 12px; border-radius: 20px; border: 1px solid #ddd; outline: none; font-size: 0.85rem;">
                </div>
                <div style="flex: 1; overflow-y: auto;">
                    ${usuarios.map(user => `
                        <div class="chat-user" data-nombre="${user.nombre}" onclick="seleccionarUsuarioChat(${user.id})"
                             style="display: flex; align-items: center; padding: 12px; cursor: pointer; border-bottom: 1px solid #f9f9f9; ${user.id == usuarioActivoId ? 'background: #e3f2fd;' : ''}">
                            <img src="${user.avatar}" style="width: 35px; height: 35px; border-radius: 50%; margin-right: 10px;">
                            <div style="flex: 1;">
                                <div style="font-weight: 600; font-size: 0.85rem;">${user.nombre}</div>
                                <small style="color: #888;">${user.ultimo_tiempo || ''}</small>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div style="width: 70%; display: flex; flex-direction: column; height: 100%; position: relative;">
                
                <div style="padding: 12px 20px; border-bottom: 1px solid #eee; background: white; flex-shrink: 0;">
                    <span style="font-weight: bold;">${usuarioActual.nombre}</span>
                </div>
                
                <div id="chat-messages-container" style="
                    flex: 1; 
                    overflow-y: auto; 
                    padding: 20px; 
                    background: #f0f2f5; 
                    display: flex; 
                    flex-direction: column; 
                    gap: 10px;
                    min-height: 0; /* CRÍTICO: Permite que el flex colapse y active el scroll */
                ">
                    </div>

                <div style="padding: 15px; background: white; border-top: 1px solid #eee; flex-shrink: 0; display: flex; gap: 10px;">
                    <input type="text" id="chat-input-field" placeholder="Escribe un mensaje..." 
                           style="flex: 1; padding: 10px 15px; border: 1px solid #ddd; border-radius: 25px; outline: none;"
                           onkeypress="if(event.key === 'Enter') enviarMensajeChat()">
                    <button onclick="enviarMensajeChat()" 
                            style="background: #00acc1; color: white; border: none; padding: 0 20px; border-radius: 25px; cursor: pointer;">
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    `;
}

function filtrarUsuarios(query) {
    const term = query.toLowerCase();
    const items = document.querySelectorAll('.chat-user');
    items.forEach(item => {
        const nombre = item.getAttribute('data-nombre').toLowerCase();
        item.style.display = nombre.includes(term) ? 'flex' : 'none';
    });
}

async function seleccionarUsuarioChat(userId) {
    usuarioActivoId = userId;
    
    // 1. Redibujar la estructura (Sidebar activo y Header)
    const mainContainer = document.getElementById('pageContent');
    mainContainer.innerHTML = renderReportes();
    
    // 2. Cargar los mensajes en el nuevo contenedor que acabamos de crear
    await cargarMensajes(userId);
    
    // 3. Reiniciar el intervalo de actualización
    if (window.chatInterval) clearInterval(window.chatInterval);
    window.chatInterval = setInterval(() => {
        cargarMensajes(userId, true);    // Actualiza burbujas
        actualizarListaUsuarios();       // Actualiza tiempos en el sidebar
    }, 5000);
}

async function cargarMensajes(userId, isSilent = false) {
    const container = document.getElementById('chat-messages-container');
    if (!container) return;

    try {
        const response = await fetch(`/api/chat/mensajes/${userId}/`);
        let mensajes = await response.json();

        // PROTECCIÓN: Si el servidor mandó un error o algo que no es lista
        if (!Array.isArray(mensajes)) {
            console.error("Se esperaba un Array pero se recibió:", mensajes);
            mensajes = []; // Forzamos que sea lista para que no explote el .map
        }

        const mensajesHtml = mensajes.map(msg => `
            <div style="align-self: ${msg.tipo === 'sent' ? 'flex-end' : 'flex-start'}; 
                        max-width: 70%; padding: 10px 15px; border-radius: 15px; 
                        background: ${msg.tipo === 'sent' ? '#00acc1' : 'white'}; 
                        color: ${msg.tipo === 'sent' ? 'white' : '#333'};
                        box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                <div style="font-size: 0.95rem;">${msg.texto}</div>
                <div style="font-size: 0.7rem; text-align: right; margin-top: 4px; opacity: 0.8;">${msg.hora}</div>
            </div>
        `).join('');

        if (container.innerHTML !== mensajesHtml) {
            container.innerHTML = mensajesHtml || '<p style="text-align:center; color:#999;">No hay mensajes aún.</p>';
            container.scrollTop = container.scrollHeight;
        }

    } catch (e) {
        if (!isSilent) console.error("Error al procesar mensajes:", e);
    }
}

async function enviarMensajeChat() {
    const input = document.getElementById('chat-input-field');
    const texto = input.value.trim();
    
    if (!texto || !usuarioActivoId) return;

    // --- MEJORA: Actualización visual inmediata ---
    // Buscamos el elemento del tiempo en el sidebar del usuario actual
    const sidebarUser = document.querySelector(`.chat-user[onclick="seleccionarUsuarioChat(${usuarioActivoId})"] small`);
    if (sidebarUser) sidebarUser.innerText = 'ahora';
    // ----------------------------------------------

    const formData = new FormData();
    formData.append('usuario_id', usuarioActivoId);
    formData.append('contenido', texto);

    input.value = '';

    try {
        const response = await fetch('/api/chat/enviar/', {
            method: 'POST',
            body: formData,
            headers: { 'X-CSRFToken': getCookie('csrftoken') }
        });

        const data = await response.json();

        if (data.status === 'ok') {
            await cargarMensajes(usuarioActivoId);
            // Esto traerá el tiempo real calculado por el servidor
            await actualizarListaUsuarios(); 
        }
    } catch (e) {
        console.error("Error al enviar:", e);
    }
}

async function actualizarListaUsuarios() {
    try {
        // Agregamos ?t=Date.now() para evitar el caché del navegador
        const response = await fetch(`/api/chat/usuarios/?t=${Date.now()}`);
        const data = await response.json();
        
        window.chatUsers = data;

        const sidebarContainer = document.querySelector('.chat-users');
        if (!sidebarContainer) return;

        // Mapeamos de nuevo la lista
        sidebarContainer.innerHTML = data.map(user => `
            <div class="chat-user ${user.id == usuarioActivoId ? 'active' : ''}" 
                 data-nombre="${user.nombre}"
                 onclick="seleccionarUsuarioChat(${user.id})"
                 style="display: flex; align-items: center; padding: 12px 15px; cursor: pointer; border-bottom: 1px solid #f9f9f9; ${user.id == usuarioActivoId ? 'background: #e3f2fd; border-left: 4px solid #00acc1;' : ''}">
                <img src="${user.avatar}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; margin-right: 12px;" onerror="this.src='https://ui-avatars.com/api/?name=${user.nombre}'">
                <div style="flex: 1; overflow: hidden;">
                    <div style="font-weight: 600; font-size: 0.9rem;">${user.nombre}</div>
                    <small style="color: #888; font-size: 0.75rem;">${user.ultimo_tiempo || ''}</small>
                </div>
            </div>
        `).join('');

    } catch (e) {
        console.error("Error al actualizar sidebar:", e);
    }
}

// === ADMINISTRADOR === //

function renderAdministrador() {
    const administradores = window.listaAdministradores || [];

    return `
        <div class="table-container">
            <div class="table-header" style="flex-direction: column; align-items: stretch; gap: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div class="search-box">
                        ${icons.search}
                        <input type="text" id="searchAdmin" placeholder="Buscar administrador por nombre..." onkeyup="filterAdmins()">
                    </div>
                    <button class="btn-primary" onclick="openModal('addAdminModal')">
                        ${icons.plus} Agregar Administrador
                    </button>
                </div>
                
                <div style="display: flex; gap: 15px; align-items: center; background: #f8f9fc; padding: 10px; border-radius: 8px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" id="filterAdminActivos" onchange="filterAdmins()">
                        <label for="filterAdminActivos" style="font-size: 13px; font-weight: bold; color: #1cc88a; cursor: pointer;">Solo Activos</label>
                    </div>
                </div>
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
                <tbody id="adminTableBody">
                    ${administradores.map(admin => `
                        <tr data-nombre="${(admin.nombre || "").toLowerCase()}" 
                            data-estado="${admin.estado}">
                            <td>
                                <div class="table-user">
                                    <img src="${admin.avatar}" class="table-avatar" onerror="this.src='/media/perfiles/default.png'">
                                    <div class="table-user-info">
                                        <span class="table-user-name">${admin.nombre}</span>
                                        <span class="table-user-email">${admin.email}</span>
                                    </div>
                                </div>
                            </td>
                            <td><span class="badge badge-blue">${admin.rol}</span></td>
                            <td>
                                <span class="badge ${admin.estado === 'Activo' ? 'badge-green' : 'badge-red'}">
                                    ${admin.estado}
                                </span>
                            </td>
                            <td>
                                <div class="table-actions">
                                    <button class="action-btn edit" onclick="editarAdmin(${admin.id || admin.numero})">${icons.edit}</button>
                                    <button class="action-btn delete" onclick="eliminarAdmin(${admin.id || admin.numero})">${icons.trash}</button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderAddAdminModal() {
    return `
        <div class="modal-overlay" id="addAdminModal" onclick="closeModal('addAdminModal', event)">
            <div class="modal-container modal-md" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h2 class="modal-title-teal">Agregar Administrador</h2>
                    <button class="modal-close-btn" onclick="closeModal('addAdminModal')">${icons.x}</button>
                </div>
                <div class="modal-divider"></div>
                <form id="formAddAdmin" onsubmit="guardarNuevoAdmin(event)">
                    <div class="modal-body">
                        <div class="form-group">
                            <label class="form-label">Nombre(s)</label>
                            <input type="text" id="admin_nombre" class="form-input" required placeholder="Ej. Roberto">
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Primer Apellido</label>
                                <input type="text" id="admin_apellido1" class="form-input" required placeholder="Ej. Torres">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Segundo Apellido</label>
                                <input type="text" id="admin_apellido2" class="form-input" placeholder="Ej. García">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Género</label>
                                <div class="form-select-wrapper">
                                    <select id="admin_genero" class="form-select" required>
                                        <option value="">Seleccionar</option>
                                        <option value="M">Masculino</option>
                                        <option value="F">Femenino</option>
                                        <option value="O">Otro</option>
                                    </select>
                                    ${icons.chevronDown}
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Teléfono</label>
                                <input type="tel" id="admin_telefono" class="form-input" required placeholder="10 dígitos">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Correo electrónico</label>
                            <input type="email" id="admin_correo" class="form-input" required placeholder="ejemplo@fym.com">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Contraseña</label>
                            <div class="form-input-icon">
                                <input type="password" id="admin_password" class="form-input" required placeholder="Mínimo 8 caracteres">
                                <button type="button" class="input-icon-btn" onclick="togglePassword('admin_password')">${icons.eye}</button>
                            </div>
                        </div>
                    </div>
                    <div class="modal-divider"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn-cancel" onclick="closeModal('addAdminModal')">Cancelar</button>
                        <button type="submit" class="btn-primary-modal">Guardar Administrador</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function filterAdmins() {
    // 1. Obtenemos los elementos (usando los IDs que definiste en tu render)
    const searchInput = document.getElementById('searchAdmin');
    const activeCheckbox = document.getElementById('filterAdminActivos');
    const tableBody = document.getElementById('adminTableBody');

    // Seguridad: Si no encuentra los elementos en el DOM, sale de la función
    if (!searchInput || !tableBody) return;

    // 2. Valores de los filtros
    const query = searchInput.value.toLowerCase().trim();
    const activosOnly = activeCheckbox ? activeCheckbox.checked : false;
    
    // 3. Obtenemos todas las filas
    const rows = tableBody.querySelectorAll('tr');

    rows.forEach(row => {
        // Leemos solo el atributo data-nombre (evita buscar en el email o rol)
        const nombre = (row.getAttribute('data-nombre') || "").toLowerCase();
        const estado = row.getAttribute('data-estado') || "";

        // Lógica de validación
        const matchesSearch = nombre.includes(query);
        const matchesActivos = !activosOnly || estado === 'Activo';

        // Aplicamos el display: Se muestra solo si cumple AMBAS condiciones
        row.style.display = (matchesSearch && matchesActivos) ? '' : 'none';
    });
}

async function guardarNuevoAdmin(event) {
    event.preventDefault();
    const btn = event.submitter; // El botón que disparó el submit
    btn.disabled = true;
    btn.innerText = 'Guardando...';

    const nombreVal = document.getElementById('admin_nombre').value;

    const data = {
        nombre: nombreVal,
        primer_apellido: document.getElementById('admin_apellido1').value,
        segundo_apellido: document.getElementById('admin_apellido2').value,
        genero: document.getElementById('admin_genero').value,
        correo: document.getElementById('admin_correo').value,
        password: document.getElementById('admin_password').value,
        telefono: document.getElementById('admin_telefono').value 
    };

    try {
        const response = await fetch('/crear-admin/', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') 
            },
            body: JSON.stringify(data)
        });

        console.log("Status de respuesta:", response.status);

       if (response.ok) {
            renderSuccessModal(`El administrador <b>${nombreVal}</b> ha sido registrado correctamente.`);
        } else {
            const result = await response.json();
            alert('Error: ' + (result.error || 'No se pudo crear'));
            btn.disabled = false;
            btn.innerText = 'Guardar Administrador';
        }
    } catch (error) {
        btn.disabled = false;
        btn.innerText = 'Guardar Administrador';
    }
}

function renderEditAdminModal(admin) {
    // IMPORTANTE: Usamos 'admin.estado' que es lo que viene de tu listaAdministradores
    const statusSelect = `
        <div class="form-group">
            <label class="form-label">Estado de la cuenta</label>
            <select id="edit_admin_estado" class="form-select">
                <option value="Activo" ${admin.estado === 'Activo' ? 'selected' : ''}>Activo</option>
                <option value="Inactivo" ${admin.estado === 'Inactivo' ? 'selected' : ''}>Inactivo</option>
            </select>
        </div>
    `;
    console.log("Datos recibidos en el modal:", admin);
    // Mapeamos los nombres de las variables según lo que tienes en window.listaAdministradores
    return `
        <div class="modal-overlay" id="editAdminModal" onclick="closeModal('editAdminModal', event)">
            <div class="modal-container modal-md" onclick="event.stopPropagation()">
                <div class="modal-header-simple">
                    <h2 class="modal-title-dark">Editar Administrador</h2>
                </div>
                <div class="modal-body">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="${admin.avatar}" id="img_preview" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid #2dd4bf;">
                        <div class="form-group" style="margin-top: 10px;">
                            <label class="btn-outline" style="cursor: pointer; padding: 5px 10px; font-size: 12px;">
                                Cambiar Foto
                                <input type="file" id="edit_admin_foto" hidden accept="image/*" onchange="document.getElementById('img_preview').src = window.URL.createObjectURL(this.files[0])">
                            </label>
                        </div>
                    </div>

                    <input type="hidden" id="edit_admin_id" value="${admin.id}">

                    <div class="form-group">
                        <label class="form-label">Nombre(s)</label>
                        <input type="text" id="edit_admin_nombre" class="form-input" value="${admin.nombrePila}">
                    </div>

                    <div style="display: flex; gap: 15px;">
                        <div class="form-group" style="flex: 1;">
                            <label class="form-label">Primer Apellido</label>
                            <input type="text" id="edit_admin_apellido1" class="form-input" value="${admin.primerApellido}">
                        </div>

                        <div class="form-group" style="flex: 1;">
                            <label class="form-label">Segundo Apellido</label>
                            <input type="text" id="edit_admin_apellido2" class="form-input" value="${admin.segundoApellido}">
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Número de teléfono</label>
                        <input type="tel" id="edit_admin_telefono" class="form-input" value="${admin.telefono || ''}">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Correo electrónico</label>
                        <input type="email" id="edit_admin_correo" class="form-input" value="${admin.correo}">
                    </div>

                    ${statusSelect}

                    <div class="form-group">
                        <label class="form-label" style="color: #ef4444; font-weight: 600;">Nueva Contraseña</label>
                        <input type="password" id="edit_admin_password" class="form-input" placeholder="•••••••• (vacío para no cambiar)">
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-outline" onclick="closeModal('editAdminModal')">Cancelar</button>
                    <button class="btn-primary-modal" onclick="actualizarAdmin()">Guardar cambios</button>
                </div>
            </div>
        </div>
    `;
}

async function actualizarAdmin() {
    const formData = new FormData();
    const fotoInput = document.getElementById('edit_admin_foto');

    formData.append('id', document.getElementById('edit_admin_id').value);
    formData.append('nombre', document.getElementById('edit_admin_nombre').value);
    formData.append('primer_apellido', document.getElementById('edit_admin_apellido1').value);
    formData.append('segundo_apellido', document.getElementById('edit_admin_apellido2').value);
    formData.append('correo', document.getElementById('edit_admin_correo').value);
    formData.append('telefono', document.getElementById('edit_admin_telefono').value);
    formData.append('estado', document.getElementById('edit_admin_estado').value);
    
    const pass = document.getElementById('edit_admin_password').value;
    if (pass) formData.append('password', pass);

    if (fotoInput.files[0]) {
        formData.append('foto', fotoInput.files[0]);
    }

    try {
        const response = await fetch('/editar-admin/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
                // Nota: NO pongas 'Content-Type' cuando envíes FormData
            },
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            location.reload(); // Recargamos para ver los cambios
        } else {
            alert("Error: " + result.error);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

function renderDeleteAdminModal(admin) {
    return `
        <div class="modal-overlay" id="deleteAdminModal" onclick="closeModal('deleteAdminModal', event)">
            <div class="modal-container modal-md" onclick="event.stopPropagation()">
                <div class="modal-header-delete">
                    <span class="badge-warning">Acción permanente</span>
                    <button class="modal-close-btn-square" onclick="closeModal('deleteAdminModal')">${icons.x}</button>
                </div>
                <div class="modal-body">
                    <h2 class="modal-title-dark">Desactivar administrador</h2>
                    <p class="modal-description">Confirma si deseas cambiar el estado de este administrador a <b>Inactivo</b>. Perderá acceso al sistema inmediatamente.</p>
                    
                    <div class="user-card-highlight">
                        <img src="${admin.avatar}" alt="${admin.nombre}" class="user-card-avatar">
                        <div class="user-card-info">
                            <h4 class="user-card-name">${admin.nombre}</h4>
                            <p class="user-card-detail">${admin.rol}</p>
                            <p class="user-card-detail">${admin.email}</p>
                        </div>
                    </div>

                    <div class="info-row">
                        <span class="info-label-light">Estado actual</span>
                        <span class="info-value-dark">${admin.estado}</span>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-cancel" style="padding: 10px 20px; cursor:pointer;" onclick="closeModal('deleteAdminModal')">Cancelar</button>
                    <button class="btn-danger" style="background: #ef4444; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor:pointer;" onclick="confirmarEliminarAdmin(${admin.id})">
                        Confirmar Desactivación
                    </button>
                </div>
            </div>
        </div>
    `;
}

async function confirmarEliminarAdmin(adminId) {
    try {
        const response = await fetch('/desactivar-admin/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ id: adminId })
        });

        const result = await response.json();

        if (response.ok) {
            renderSuccessModal(`La cuenta del administrador ha sido cambiada a estado <b>Inactivo</b>.`, "Cuenta Desactivada");
        }else {
            alert("Error: " + result.error);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Ocurrió un error al intentar desactivar la cuenta.");
    }
}

function editarAdmin(id) {
    const adminEncontrado = window.listaAdministradores.find(a => (a.id == id || a.numero == id));
    
    if (adminEncontrado) {
        // Mapeo corregido según tu captura de consola
        const datosParaModal = {
            id: adminEncontrado.id || adminEncontrado.numero,
            nombrePila: adminEncontrado.nombrePila,
            
            // CAMBIO AQUÍ: Usamos las llaves que vimos en tu tabla (apellido1 y apellido2)
            primerApellido: adminEncontrado.apellido1 || '', 
            segundoApellido: adminEncontrado.apellido2 || '',
            
            // CAMBIO AQUÍ: Tu captura dice 'email', no 'correo'
            correo: adminEncontrado.email || '', 
            
            telefono: adminEncontrado.telefono || '',
            estado: adminEncontrado.estado || 'Inactivo',
            
            // CAMBIO AQUÍ: Tu captura dice 'avatar'
            avatar: adminEncontrado.avatar || '/static/img/default.png'
        };
        
        console.log("Datos mapeados correctamente:", datosParaModal);

        const modalHtml = renderEditAdminModal(datosParaModal);
        const modalViejo = document.getElementById('editAdminModal');
        if (modalViejo) modalViejo.remove();

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        document.getElementById('editAdminModal').style.display = 'flex';
    }
}

function eliminarAdmin(id) {
    const admin = window.listaAdministradores.find(a => a.id === id);
    openModal('deleteAdminModal', admin);
}

// === ESPECIALIDADES === //

function renderEspecialidades() {
    // Tomamos los datos que inyectamos desde Django
    const lista = window.especialidades || [];

    // Título y botón de agregar (Parte superior de tu imagen)
    let html = `
        <div class="page-header-flex">
            <div>
                <p class="page-description">Administra las especialidades disponibles y su estado en la plataforma.</p>
            </div>
            <div class="header-actions">
                <div class="search-box">
                    ${icons.search}
                    <input type="text" id="especialidadSearch" placeholder="Buscar especialidad..." oninput="filtrarEspecialidades()">
                </div>
                <button class="btn-primary" onclick="renderFormEspecialidad()">
                    + Agregar especialidad
                </button>
            </div>
        </div>

        <div class="specialties-grid">
    `;

    // Generar las tarjetas (Cards)
    if (lista.length === 0) {
        html += `<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">No hay especialidades registradas aún.</p>`;
    } else {
        lista.forEach(esp => {
            html += `
                <div class="specialty-card">
                    <div class="card-top">
                        <div class="specialty-icon-container">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.04-2.44V4.5A2.5 2.5 0 0 1 7.5 2zM14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.04-2.44V4.5A2.5 2.5 0 0 0 16.5 2z"/></svg>
                        </div>
                        <div class="specialty-title-group">
                            <h4>${esp.nombre}</h4>
                            <span class="status-badge ${esp.activo ? 'active' : 'inactive'}">
                                ${esp.activo ? 'Activo' : 'Inactivo'}
                            </span>
                        </div>
                    </div>
                    
                    <div class="general-desc-box">
                        <strong>Descripción General</strong>
                        <p>${esp.descripcion || 'Sin descripción detallada.'}</p>
                    </div>

                    <div class="card-actions-row">
                        <button class="btn-edit-light" onclick="renderFormEspecialidad(${esp.clave})">
                            Editar
                        </button>
                        <button class="btn-delete-light" onclick="eliminar_especialidad(${esp.clave})">
                            Eliminar
                        </button>
                    </div>
                </div>
            `;
        });
    }

    html += `</div>`;
    return html;
}

function renderFormEspecialidad(clave = null) {
    // Buscamos por 'clave' en lugar de 'id'
    const esp = clave ? window.especialidades.find(e => e.clave == clave) : null;
    const titulo = esp ? 'Editar Especialidad' : 'Nueva Especialidad';

    const modalHtml = `
        <div id="modalEspecialidad" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999;">
            <div style="background: white; padding: 30px; border-radius: 15px; width: 450px; max-width: 90%;">
                <h3 style="margin-bottom: 20px; font-family: 'Playfair Display', serif;">${titulo}</h3>
                <form onsubmit="guardarEspecialidad(event)">
                    <input type="hidden" name="clave" value="${esp ? esp.clave : ''}">
                    
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Nombre</label>
                        <input type="text" name="nombre" value="${esp ? esp.nombre : ''}" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px;">
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Descripción</label>
                        <textarea name="descripcion" rows="4" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; resize: none;">${esp ? esp.descripcion : ''}</textarea>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Estado</label>
                        <select name="activo" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px;">
                            <option value="true" ${esp && esp.activo ? 'selected' : ''}>Activo</option>
                            <option value="false" ${esp && !esp.activo ? 'selected' : ''}>Inactivo</option>
                        </select>
                    </div>

                    <div style="display: flex; justify-content: flex-end; gap: 10px;">
                        <button type="button" onclick="document.getElementById('modalEspecialidad').remove()" style="padding: 10px 20px; border: none; background: #eee; border-radius: 8px; cursor: pointer;">Cancelar</button>
                        <button type="submit" style="padding: 10px 20px; border: none; background: #008080; color: white; border-radius: 8px; cursor: pointer;">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function filtrarEspecialidades() {
    // 1. Obtenemos el texto de búsqueda
    const query = document.getElementById('especialidadSearch').value.toLowerCase();
    
    // 2. Seleccionamos todas las tarjetas de especialidad
    const cards = document.querySelectorAll('.specialty-card');
    
    // 3. Recorremos cada tarjeta
    cards.forEach(card => {
        // Obtenemos todo el texto dentro de la tarjeta (Nombre + Descripción)
        const text = card.innerText.toLowerCase();
        
        // Si el texto incluye la búsqueda, se muestra ('' es el display por defecto), si no, se oculta
        card.style.display = text.includes(query) ? '' : 'none';
    });
}

async function guardarEspecialidad(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
        const response = await fetch('/guardar_especialidad/', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': getCookie('csrftoken') // Asegúrate de tener esta función para el CSRF
            }
        });

        const data = await response.json();
        // Dentro de guardarEspecialidad, cuando data.success sea true:
        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: '¡Guardado!',
                text: 'La especialidad se actualizó correctamente',
                timer: 1500,
                showConfirmButton: false,
                zIndex: 10000
            }).then(() => {
                window.location.reload(); 
            });
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error de conexión con el servidor");
    }
}

async function eliminar_especialidad(clave) {
    // 1. Modal de confirmación estilizado
    const resultado = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción eliminará la especialidad de forma permanente.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#008080', // El color verde de tu proyecto
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    });

    // 2. Si el usuario confirmó la acción
    if (resultado.isConfirmed) {
        const formData = new FormData();
        formData.append('clave', clave);

        try {
            const response = await fetch('/eliminar_especialidad/', {
                method: 'POST',
                body: formData,
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });

            const data = await response.json();

            if (data.success) {
                // Notificación de éxito
                Swal.fire({
                    title: '¡Eliminado!',
                    text: 'La especialidad ha sido borrada.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });

                // Actualizar la lista local y la interfaz
                window.especialidades = window.especialidades.filter(e => e.clave != clave);
                const pageContent = document.getElementById('pageContent');
                pageContent.innerHTML = renderEspecialidades();
            } else {
                Swal.fire('Error', data.error, 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Hubo un fallo en la conexión con el servidor', 'error');
        }
    }
}

// === HORARIOS DE ATENCIÓN === //

function renderHorarios() {
    // Usamos la variable global que llenamos en el paso anterior
    const lista = window.horarios || [];
    
    let html = `
        <div class="page-header-flex">
            <div>
                <p>Gestiona los turnos de atención.</p>
            </div>
            <div class="header-actions">
                <div class="search-box">
                    <input type="text" id="horarioSearch" placeholder="Buscar..." onkeyup="filterHorarios()">
                </div>
                <button class="btn-primary" onclick="renderFormHorario()">+ Agregar horario</button>
            </div>
        </div>
        <div class="schedules-grid">
    `;

    if (lista.length === 0) {
        html += `<p style="grid-column: 1/-1; text-align: center; padding: 50px; color: #888;">
                    No hay horarios registrados. ¡Agrega el primero!
                 </p>`;
    }

    lista.forEach(h => {
        html += `
            <div class="schedule-card">
                <div class="card-top">
                    <div class="specialty-icon-container">
                        ${getIconSvg(h.icono)} 
                    </div>
                    <div class="specialty-title-group">
                        <h4>${h.nombre}</h4>
                        <span class="status-badge ${h.activo ? 'active' : 'inactive'}">
                            ${h.activo ? 'Activo' : 'Inactivo'}
                        </span>
                    </div>
                </div>
                <div class="info-box">
                    <div class="info-item"><strong>Días:</strong> ${h.dias}</div>
                    <div class="info-item"><strong>Horas:</strong> ${h.horas}</div>
                </div>
                <div class="card-actions-row">
                    <button class="btn-edit-light" onclick="renderFormHorario(${h.numero})">Editar</button>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    return html;
}

function filterHorarios() {
    const query = document.getElementById('horarioSearch').value.toLowerCase();
    document.querySelectorAll('.schedule-card').forEach(card => {
        card.style.display = card.innerText.toLowerCase().includes(query) ? '' : 'none';
    });
}

function getIconSvg(iconName) {
    const icons = {
        'sun': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>',
        'sunset': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 18a5 5 0 0 0-10 0"></path><line x1="12" y1="2" x2="12" y2="9"></line><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line><line x1="1" y1="18" x2="3" y2="18"></line><line x1="21" y1="18" x2="23" y2="18"></line><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line><line x1="23" y1="22" x2="1" y2="22"></line><polyline points="8 6 12 2 16 6"></polyline></svg>',
        'briefcase': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>',
        'tent': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 20L12 4L5 20"></path><path d="M12 4v16"></path><path d="M7 20h10"></path></svg>',
        'git-branch': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>'
    };
    return icons[iconName] || icons['sun'];
}

function renderFormHorario(numero = null) {
    console.log("Iniciando renderFormHorario con numero:", numero);

    // 1. Buscamos el horario solo si el número existe
    const hor = numero ? (window.horarios ? window.horarios.find(h => h.numero == numero) : null) : null;

    // 2. Definimos variables seguras (si hor es null, usa el valor por defecto)
    const nombreVal = hor ? hor.nombre : '';
    const diasSeleccionados = hor && hor.dias ? hor.dias.split(', ') : [];
    const iconoSel = hor ? hor.icono : 'sun';
    const esActivo = hor ? hor.activo : true;

    // Horas con valores por defecto
    let hInicio = "08:00";
    let hFin = "16:00";
    if (hor && hor.horas && hor.horas.includes(' - ')) {
        const partes = hor.horas.split(' - ');
        hInicio = partes[0];
        hFin = partes[1];
    }

    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    // 3. Construimos el HTML cuidando que no haya variables nulas
    const modalHtml = `
        <div id="modalHorario" class="modal-overlay">
            <div class="modal-content">
                <h3 style="margin-top:0">${hor ? 'Editar' : 'Nuevo'} Horario</h3>
                <form id="formHorario" onsubmit="guardarHorarioPro(event)">
                    <input type="hidden" name="numero" value="${hor ? hor.numero : ''}">
                    
                    <div class="form-group">
                        <label>Nombre del Turno</label>
                        <input type="text" name="nombre" value="${nombreVal}" required placeholder="Ej. Turno Matutino">
                    </div>

                    <div class="form-group">
                        <label>Días laborables</label>
                        <div class="days-selector">
                            ${diasSemana.map(dia => `
                                <label class="day-chip">
                                    <input type="checkbox" name="dias_check" value="${dia}" 
                                    ${diasSeleccionados.includes(dia) ? 'checked' : ''}>
                                    <span>${dia.charAt(0)}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Rango de Horas</label>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <input type="time" name="hora_inicio" value="${hInicio}" required>
                            <span>a</span>
                            <input type="time" name="hora_fin" value="${hFin}" required>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                        <div class="form-group">
                            <label>Icono</label>
                            <select name="icono">
                                <option value="sun" ${iconoSel === 'sun' ? 'selected' : ''}>☀️ Sol</option>
                                <option value="sunset" ${iconoSel === 'sunset' ? 'selected' : ''}>🌅 Tarde</option>
                                <option value="briefcase" ${iconoSel === 'briefcase' ? 'selected' : ''}>💼 Oficina</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Estado</label>
                            <select name="activo">
                                <option value="true" ${esActivo ? 'selected' : ''}>Activo</option>
                                <option value="false" ${!esActivo ? 'selected' : ''}>Inactivo</option>
                            </select>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: flex-end; gap: 10px;">
                        <button type="button" class="btn-delete-light" onclick="document.getElementById('modalHorario').remove()">Cancelar</button>
                        <button type="submit" class="btn-primary">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    // 4. Inserción final
    try {
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        console.log("¡Modal insertado con éxito!");
    } catch (err) {
        console.error("Error al insertar el HTML:", err);
    }
}

function showSection(section) {
    const mainContent = document.getElementById('main-content'); // O el ID de tu contenedor
    
    if (section === 'horarios') {
        // Ejecutamos la función que me pasaste arriba y metemos el HTML al DOM
        mainContent.innerHTML = renderHorarios();
    }
    // ... otros casos (especialidades, etc)
}

async function guardarHorarioPro(event) {
    event.preventDefault();
    const form = event.target;
    // DEFINIMOS EL MODAL AQUÍ PARA PODER BORRARLO LUEGO
    const modalElement = document.getElementById('modalHorario'); 
    
    const diasSeleccionados = Array.from(form.querySelectorAll('input[name="dias_check"]:checked'))
                                   .map(cb => cb.value)
                                   .join(', ');

    if (!diasSeleccionados) {
        Swal.fire({ icon: 'warning', title: 'Atención', text: 'Selecciona al menos un día', target: 'body' });
        return;
    }

    const hInicio = form.querySelector('input[name="hora_inicio"]').value;
    const hFin = form.querySelector('input[name="hora_fin"]').value;
    
    const formData = new FormData();
    formData.append('numero', form.querySelector('input[name="numero"]').value);
    formData.append('nombre', form.querySelector('input[name="nombre"]').value);
    formData.append('dias', diasSeleccionados);
    formData.append('horas', `${hInicio} - ${hFin}`);
    formData.append('icono', form.querySelector('select[name="icono"]').value);
    formData.append('activo', form.querySelector('select[name="activo"]').value);

    try {
        const response = await fetch('/guardar_horario/', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': getCookie('csrftoken')
            }
        });

        const data = await response.json();

        if (data.success) {
            // 1. Quitamos el modal ANTES de la alerta para que no haya conflictos de Z-index
            if (modalElement) modalElement.remove();

            // 2. Mostramos la alerta de éxito
            await Swal.fire({
                icon: 'success',
                title: '¡Guardado!',
                text: 'Los datos se actualizaron correctamente.',
                confirmButtonColor: '#3085d6'
            });

            window.location.reload();
        } else {
            Swal.fire('Error', data.error || 'Error en el servidor', 'error');
        }
    } catch (error) {
        console.error("Error en JS:", error);
        // Si el modal seguía ahí y hubo un error de código, el catch lo atrapa
        Swal.fire('Error', 'Hubo un problema en el sistema', 'error');
    }
}

// ==== PERFIL DE ADMINISTRADOR ==== //

function renderPerfilAdmin() {
    const user = window.userConfig;

    return `
        <div class="profile-page-wrapper">
            <div class="profile-card-container">
                <div class="profile-header-section">
                    <div class="profile-avatar-wrapper">
                        <img src="${user.foto}" class="profile-img-large" onerror="this.src='/static/img/default.png'">
                    </div>
                    <div class="profile-header-text">
                        <h2>Mi Perfil</h2>
                        <p>Gestiona tu información personal</p>
                    </div>
                </div>

                <div class="profile-form">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Nombre(s)</label>
                            <input type="text" value="${user.nombre}" readonly class="input-view-only">
                        </div>
                        <div class="form-group">
                            <label>Primer Apellido</label>
                            <input type="text" value="${user.apellido1}" readonly class="input-view-only">
                        </div>
                        <div class="form-group">
                            <label>Segundo Apellido</label>
                            <input type="text" value="${user.apellido2 || 'No asignado'}" readonly class="input-view-only">
                        </div>
                        <div class="form-group">
                            <label>Teléfono</label>
                            <input type="text" value="${user.telefono || 'Sin registrar'}" readonly class="input-view-only">
                        </div>
                        <div class="form-group full-width">
                            <label>Correo Electrónico</label>
                            <input type="email" value="${user.correo}" readonly class="input-view-only">
                        </div>
                    </div>

                    <div class="profile-form-footer">
                        <button type="button" class="btn-save-profile" onclick="habilitarEdicion()">
                            Editar mi información
                        </button>
                        <button type="button" class="btn-logout-profile" onclick="handleLogout()">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function habilitarEdicion() {
    const user = window.userConfig;
    
    // Mapeamos userConfig al formato que el modal de edición espera
    const miInformacion = {
        id: user.id,
        nombrePila: user.nombre,
        primerApellido: user.apellido1,
        segundoApellido: user.apellido2,
        telefono: user.telefono,
        correo: user.correo,
        avatar: user.foto,
        rol: user.rol
    };

    // Reutilizamos el modal de administración que ya tienes configurado
    openModal('editAdminModal', miInformacion);
}

// ==== LOGOUT ==== //

function handleLogout() {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
        // Redirigir a la ruta de Django que destruye la sesión
        window.location.href = '/logout/'; 
    }
}

// === COKIES === //

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// ==================== //
// Navigation           //
// ==================== //

const pageTitles = {
    inicio: 'Resumen General',
    psicologos: 'Psicólogos',
    reportes: 'Reportes',
    administrador: 'Administradores',
    perfil: 'Mi Perfil',
    especialidades: 'Especialidades',
    horarios: 'Horarios'
};

const pageRenderers = {
    inicio: renderInicio,
    psicologos: renderPsicologos,
    reportes: renderReportes, 
    administrador: renderAdministrador,
    perfil: renderPerfilAdmin,
    especialidades: renderEspecialidades,
    horarios: renderHorarios
};

async function navigateTo(page) {
    // 1. Actualizar estado visual de los botones
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === page) item.classList.add('active');
    });

    // 2. Actualizar título
    document.getElementById('pageTitle').textContent = pageTitles[page] || 'Panel';

    const pageContent = document.getElementById('pageContent');
    pageContent.style.opacity = '0';

    // 3. Lógica de carga según la página
    setTimeout(async () => {
        try {
            if (page === 'inicio') {
                // Primero llamamos a la API y esperamos los datos
                await cargarDatosDashboard(); 
                // cargarDatosDashboard ya debe insertar el HTML de renderInicio()
            } 
            else if (page === 'reportes') {
                // Insertamos la estructura del chat
                pageContent.innerHTML = renderReportes();
                // Cargamos usuarios y mensajes
                await inicializarChat();
            } 
            else if (pageRenderers[page]) {
                // Caso normal para páginas estáticas
                pageContent.innerHTML = pageRenderers[page]();
            }

            pageContent.style.opacity = '1';
        } catch (error) {
            console.error("Error al navegar a " + page, error);
            pageContent.innerHTML = `<p style="padding:20px; color:red;">Error al cargar la página.</p>`;
            pageContent.style.opacity = '1';
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

document.getElementById('viewProfile').addEventListener('click', function(e) {
    e.preventDefault();
    loadProfilePage();
});

function loadProfilePage() {
    const pageTitle = document.getElementById('pageTitle');
    const pageContent = document.getElementById('pageContent');

    pageTitle.innerText = "Mi Perfil";
    
    // Aquí defines la estructura de la imagen que enviaste
    pageContent.innerHTML = `
        <div class="profile-container">
            <div class="profile-header-actions">
                <p>Consulta y administra tu información personal y de acceso.</p>
                <button class="btn-edit">Editar Información</button>
            </div>

            <div class="profile-cards">
                <div class="profile-side-card">
                    <div class="avatar-large">
                        <img src="${document.querySelector('.user-avatar').src}" alt="Foto">
                    </div>
                    <h2>${document.querySelector('.user-name').innerText}</h2>
                    <p>${document.querySelector('.user-role').innerText}</p>
                </div>

                <div class="profile-main-card">
                    <h3>Información Personal</h3>
                    <div class="form-row">
                        <div class="field">
                            <label>Nombres</label>
                            <input type="text" value="${document.querySelector('.user-name').innerText.split(' ')[0]}" readonly>
                        </div>
                        <div class="field">
                            <label>Primer apellido</label>
                            <input type="text" value="${document.querySelector('.user-name').innerText.split(' ')[1] || ''}" readonly>
                        </div>
                    </div>
                    
                    <h3>Credenciales de Acceso</h3>
                    <div class="form-row">
                        <div class="field">
                            <label>Correo electrónico</label>
                            <input type="text" value="carlos.martinez@fym.com" readonly>
                        </div>
                        <div class="field">
                            <label>Contraseña</label>
                            <input type="password" value="**********" readonly>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Esperar a que el DOM cargue
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar la página inicial
    navigateTo('inicio');

    // 2. Configurar los clics para todos los nav-items
    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Evita que la página recargue con el '#'
            const page = link.getAttribute('data-page');
            if (page) {
                navigateTo(page);
            }
        });
    });
});
