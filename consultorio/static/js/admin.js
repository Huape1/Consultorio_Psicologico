// ==================== //
// Data / Datos         //
// ==================== //

const psicologos = [
    {
        id: 1,
        nombre: "Dra. Ana López",
        email: "ana.lopez@fymconsultorio.com",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
        especialidad: "Psicología Clínica",
        badgeColor: "teal",
        dias: "Lunes a Viernes",
        horario: "09:00 - 14:00, 16:00 - 19:00",
        telefono: "+52 664 238 1145",
        pacientes: 8
    },
    {
        id: 2,
        nombre: "Dr. Roberto Torres",
        email: "roberto.torres@fymconsultorio.com",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        especialidad: "Terapia de Pareja",
        badgeColor: "green",
        dias: "Martes a Sábado",
        horario: "10:00 - 18:00",
        telefono: "+52 664 345 6789",
        pacientes: 5
    },
    {
        id: 3,
        nombre: "Dra. Sofía Ramírez",
        email: "sofia.ramirez@fymconsultorio.com",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        especialidad: "Psicología Infantil",
        badgeColor: "teal",
        dias: "Lunes, Miércoles, Viernes",
        horario: "08:00 - 15:00",
        telefono: "+52 664 456 7890",
        pacientes: 12
    },
    {
        id: 4,
        nombre: "Dr. Luis Méndez",
        email: "luis.mendez@fymconsultorio.com",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        especialidad: "Psiquiatría",
        badgeColor: "blue",
        dias: "Lunes a Jueves",
        horario: "12:00 - 20:00",
        telefono: "+52 664 567 8901",
        pacientes: 6
    }
];

const administradores = [
    {
        id: 1,
        nombre: "Carlos Martínez",
        email: "carlos.martinez@fymconsultorio.com",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        rol: "Administrador Principal",
        rolColor: "teal",
        estado: "Activo",
        telefono: "+52 664 987 6543"
    },
    {
        id: 2,
        nombre: "Elena Vázquez",
        email: "elena.vazquez@fymconsultorio.com",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
        rol: "Operador",
        rolColor: "green",
        estado: "Activo",
        telefono: "+52 664 876 5432"
    },
    {
        id: 3,
        nombre: "Miguel Hernández",
        email: "miguel.h@fymconsultorio.com",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        rol: "Operador",
        rolColor: "green",
        estado: "Activo",
        telefono: "+52 664 765 4321"
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

const horariosPredeterminados = [
    { id: 1, dias: "Lunes a Viernes", horario: "09:00 - 14:00, 16:00 - 19:00" },
    { id: 2, dias: "Martes a Sábado", horario: "10:00 - 18:00" },
    { id: 3, dias: "Lunes, Miércoles, Viernes", horario: "08:00 - 15:00" },
    { id: 4, dias: "Lunes a Jueves", horario: "12:00 - 20:00" }
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

function renderAddPsychologistModal() {
    return `
        <div class="modal-overlay" id="addPsychologistModal" onclick="closeModal('addPsychologistModal', event)">
            <div class="modal-container modal-md" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h2 class="modal-title-teal">Agregar Psicólogo</h2>
                    <button class="modal-close-btn" onclick="closeModal('addPsychologistModal')">${icons.x}</button>
                </div>
                <div class="modal-divider"></div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="form-label">Nombre completo</label>
                        <input type="text" class="form-input" placeholder="Ej. Dr. Roberto Torres">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Género</label>
                            <div class="form-select-wrapper">
                                <select class="form-select">
                                    <option>Seleccionar género</option>
                                    <option>Masculino</option>
                                    <option>Femenino</option>
                                    <option>Otro</option>
                                </select>
                                ${icons.chevronDown}
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Cédula Profesional</label>
                            <input type="text" class="form-input" placeholder="Ej. 12345678">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Correo electrónico</label>
                            <input type="email" class="form-input" placeholder="ejemplo@fym.com">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Teléfono</label>
                            <input type="tel" class="form-input" placeholder="Ej. 55 1234 5678">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Contraseña temporal</label>
                        <div class="form-input-icon">
                            <input type="password" class="form-input" value="********">
                            <button class="input-icon-btn">${icons.eye}</button>
                        </div>
                    </div>
                </div>
                <div class="modal-divider"></div>
                <div class="modal-footer">
                    <button class="btn-cancel" onclick="closeModal('addPsychologistModal')">Cancelar</button>
                    <button class="btn-primary-modal">Agregar Psicólogo</button>
                </div>
            </div>
        </div>
    `;
}

function renderDeletePsychologistModal(psicologo) {
    return `
        <div class="modal-overlay" id="deletePsychologistModal" onclick="closeModal('deletePsychologistModal', event)">
            <div class="modal-container modal-md" onclick="event.stopPropagation()">
                <div class="modal-header-delete">
                    <span class="badge-warning">Acción permanente</span>
                    <button class="modal-close-btn-square" onclick="closeModal('deletePsychologistModal')">${icons.x}</button>
                </div>
                <div class="modal-body">
                    <h2 class="modal-title-dark">Eliminar psicólogo</h2>
                    <p class="modal-description">Confirma si deseas dar de baja a este psicólogo del consultorio FYM. Esta acción retirará su acceso al sistema administrativo.</p>
                    
                    <div class="user-card-highlight">
                        <img src="${psicologo.avatar}" alt="${psicologo.nombre}" class="user-card-avatar">
                        <div class="user-card-info">
                            <h4 class="user-card-name">${psicologo.nombre}</h4>
                            <p class="user-card-detail">${psicologo.especialidad} · Terapia Individual</p>
                            <p class="user-card-detail">${psicologo.dias} · 9:00 AM - 5:00 PM</p>
                        </div>
                    </div>

                    <div class="warning-box">
                        <h4 class="warning-title">Antes de continuar</h4>
                        <p class="warning-text">Las citas futuras asignadas a este psicólogo deberán ser reasignadas manualmente y su perfil dejará de aparecer en los módulos internos.</p>
                    </div>

                    <div class="info-row">
                        <span class="info-label-light">Especialidad</span>
                        <span class="info-value-dark">Terapia individual y ansiedad</span>
                    </div>
                    <div class="divider-light"></div>
                    <div class="info-row">
                        <span class="info-label-light">Correo</span>
                        <span class="info-value-dark">${psicologo.email}</span>
                    </div>
                    <div class="divider-light"></div>
                    <div class="info-row">
                        <span class="info-label-light">Estado actual</span>
                        <span class="info-value-dark">Activo con ${psicologo.pacientes} pacientes asignados</span>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-cancel" onclick="closeModal('deletePsychologistModal')">Cancelar</button>
                    <button class="btn-danger">Eliminar psicólogo</button>
                </div>
            </div>
        </div>
    `;
}

function renderEditScheduleModal(psicologo) {
    const especialidades = [
        "Psicología Clínica",
        "Terapia de Pareja", 
        "Psicología Infantil",
        "Terapia Familiar",
        "Psicooncología",
        "Psicopatología",
        "Psiquiatría"
    ];
    
    return `
        <div class="modal-overlay" id="editScheduleModal" onclick="closeModal('editScheduleModal', event)">
            <div class="modal-container modal-lg" onclick="event.stopPropagation()">
                <div class="modal-header-edit">
                    <div>
                        <h2 class="modal-title-dark">Editar información del psicólogo</h2>
                        <p class="modal-subtitle">Actualiza el horario asignado y los datos principales desde una sola ventana.</p>
                    </div>
                    <button class="modal-close-btn" onclick="closeModal('editScheduleModal')">${icons.x}</button>
                </div>
                <div class="modal-divider"></div>
                <div class="modal-body-split">
                    <!-- Left Column - Schedule -->
                    <div class="modal-column">
                        <div class="user-card-light">
                            <img src="${psicologo.avatar}" alt="${psicologo.nombre}" class="user-card-avatar">
                            <div class="user-card-info">
                                <h4 class="user-card-name-dark">${psicologo.nombre}</h4>
                                <span class="badge-outline-teal">${psicologo.especialidad}</span>
                            </div>
                        </div>
                        
                        <h3 class="section-title">Modificar horario</h3>
                        <p class="section-subtitle">Seleccione uno de los horarios predeterminados del consultorio para actualizar la disponibilidad de atención.</p>
                        
                        <div class="schedule-options">
                            ${horariosPredeterminados.map((h, i) => `
                                <label class="schedule-option ${i === 0 ? 'active' : ''}">
                                    <input type="radio" name="schedule" ${i === 0 ? 'checked' : ''}>
                                    <div class="schedule-option-content">
                                        <span class="schedule-option-days">${h.dias}</span>
                                        <span class="schedule-option-time">${icons.clock} ${h.horario}</span>
                                    </div>
                                </label>
                            `).join('')}
                        </div>
                        
                        <button class="btn-outline">Restablecer</button>
                    </div>
                    
                    <!-- Right Column - Data (Editable) -->
                    <div class="modal-column modal-column-bg">
                        <h3 class="section-title">Modificar datos</h3>
                        <p class="section-subtitle">Edite la información del contacto profesional y la especialidad asignada del psicólogo.</p>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label-sm">Teléfono</label>
                                <input type="tel" class="form-input-light" value="${psicologo.telefono}">
                            </div>
                            <div class="form-group">
                                <label class="form-label-sm">Especialidad</label>
                                <div class="form-select-wrapper-light">
                                    <select class="form-select-light">
                                        ${especialidades.map(esp => `
                                            <option ${esp === psicologo.especialidad ? 'selected' : ''}>${esp}</option>
                                        `).join('')}
                                    </select>
                                    ${icons.chevronDown}
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label-sm">Correo electrónico</label>
                            <input type="email" class="form-input-light" value="${psicologo.email}">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label-sm">Contraseña</label>
                            <div class="form-input-icon-light">
                                <input type="password" class="form-input-light" value="••••••••••••">
                                <button class="input-icon-btn-light">${icons.eye}</button>
                            </div>
                        </div>
                        
                        <button class="btn-outline-right">Cancelar cambios</button>
                    </div>
                </div>
                <div class="modal-footer-split">
                    <p class="footer-note">Los cambios se aplicarán al perfil del psicólogo dentro del consultorio FYM.</p>
                    <div class="footer-buttons">
                        <button class="btn-cancel" onclick="closeModal('editScheduleModal')">Cancelar</button>
                        <button class="btn-primary-modal">Guardar cambios</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderEditAdminModal(admin) {
    return `
        <div class="modal-overlay" id="editAdminModal" onclick="closeModal('editAdminModal', event)">
            <div class="modal-container modal-md" onclick="event.stopPropagation()">
                <div class="modal-header-simple">
                    <div>
                        <h2 class="modal-title-dark">Editar Administrador</h2>
                        <p class="modal-subtitle">Actualice los datos de contacto y acceso del administrador.</p>
                    </div>
                </div>
                <div class="modal-divider"></div>
                <div class="modal-body">
                    <div class="user-card-highlight">
                        <img src="${admin.avatar}" alt="${admin.nombre}" class="user-card-avatar">
                        <div class="user-card-info">
                            <h4 class="user-card-name">${admin.nombre}</h4>
                            <span class="badge-outline-teal">${admin.rol}</span>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Número de teléfono</label>
                        <input type="tel" class="form-input" value="${admin.telefono}">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Correo electrónico</label>
                        <input type="email" class="form-input" value="${admin.email}">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Contraseña</label>
                        <input type="password" class="form-input" value="••••••••••••">
                    </div>
                </div>
                <div class="modal-divider"></div>
                <div class="modal-footer">
                    <button class="btn-outline" onclick="closeModal('editAdminModal')">Cancelar</button>
                    <button class="btn-primary-modal">Guardar cambios</button>
                </div>
            </div>
        </div>
    `;
}

function renderAddAdminModal() {
    return `
        <div class="modal-overlay" id="addAdminModal" onclick="closeModal('addAdminModal', event)">
            <div class="modal-container modal-md" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h2 class="modal-title-teal">Agregar Administrador</h2>
                </div>
                <div class="modal-divider"></div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="form-label">Nombre completo</label>
                        <input type="text" class="form-input" placeholder="Ej. Carlos Ruiz">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Género</label>
                            <div class="form-select-wrapper">
                                <select class="form-select">
                                    <option>Seleccionar género</option>
                                    <option>Masculino</option>
                                    <option>Femenino</option>
                                    <option>Otro</option>
                                </select>
                                ${icons.chevronDown}
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Teléfono</label>
                            <input type="tel" class="form-input" placeholder="Ej. 55 1234 5678">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Correo electrónico</label>
                        <input type="email" class="form-input" placeholder="carlos.ruiz@fym.com">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Contraseña temporal</label>
                        <input type="password" class="form-input" value="********">
                    </div>
                </div>
                <div class="modal-divider"></div>
                <div class="modal-footer">
                    <button class="btn-cancel" onclick="closeModal('addAdminModal')">Cancelar</button>
                    <button class="btn-primary-modal">Agregar Administrador</button>
                </div>
            </div>
        </div>
    `;
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
                    <h2 class="modal-title-dark">Eliminar administrador</h2>
                    <p class="modal-description">Confirma si deseas eliminar a este administrador del sistema FYM. Esta acción retirará su acceso al panel administrativo de forma permanente.</p>
                    
                    <div class="user-card-highlight">
                        <img src="${admin.avatar}" alt="${admin.nombre}" class="user-card-avatar">
                        <div class="user-card-info">
                            <h4 class="user-card-name">${admin.nombre}</h4>
                            <p class="user-card-detail">${admin.rol}</p>
                            <p class="user-card-detail">${admin.email}</p>
                        </div>
                    </div>

                    <div class="warning-box">
                        <h4 class="warning-title">Antes de continuar</h4>
                        <p class="warning-text">Al eliminar este administrador, perderá acceso inmediato al sistema. Si es necesario, podrás volver a crear su cuenta posteriormente.</p>
                    </div>

                    <div class="info-row">
                        <span class="info-label-light">Rol asignado</span>
                        <span class="info-value-dark">${admin.rol}</span>
                    </div>
                    <div class="divider-light"></div>
                    <div class="info-row">
                        <span class="info-label-light">Correo</span>
                        <span class="info-value-dark">${admin.email}</span>
                    </div>
                    <div class="divider-light"></div>
                    <div class="info-row">
                        <span class="info-label-light">Estado actual</span>
                        <span class="info-value-dark">${admin.estado}</span>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-cancel" onclick="closeModal('deleteAdminModal')">Cancelar</button>
                    <button class="btn-danger">Eliminar administrador</button>
                </div>
            </div>
        </div>
    `;
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
        case 'deletePsychologistModal':
            modalHtml = renderDeletePsychologistModal(data);
            break;
        case 'editScheduleModal':
            modalHtml = renderEditScheduleModal(data);
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
    
    // Setup schedule options if applicable
    if (modalId === 'editScheduleModal') {
        setupScheduleOptions();
    }
}

function closeModal(modalId, event = null) {
    if (event && event.target !== event.currentTarget) return;
    
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
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
                <button class="btn-primary" style="width: 100%; margin-top: 1rem; justify-content: center;" onclick="openModal('addAdminModal')">
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
                <button class="btn-primary" onclick="openModal('addPsychologistModal')">
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
                                    <button class="action-btn edit" title="Editar" onclick="openModal('editScheduleModal', psicologos.find(p => p.id === ${psi.id}))">${icons.edit}</button>
                                    <button class="action-btn delete" title="Eliminar" onclick="openModal('deletePsychologistModal', psicologos.find(p => p.id === ${psi.id}))">${icons.trash}</button>
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
                <button class="btn-primary" onclick="openModal('addAdminModal')">
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
                                    <button class="action-btn edit" title="Editar" onclick="openModal('editAdminModal', administradores.find(a => a.id === ${admin.id}))">${icons.edit}</button>
                                    <button class="action-btn delete" title="Eliminar" onclick="openModal('deleteAdminModal', administradores.find(a => a.id === ${admin.id}))">${icons.trash}</button>
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
