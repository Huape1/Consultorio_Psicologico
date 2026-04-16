document.addEventListener('DOMContentLoaded', () => {
    // Asegúrate de que el nombre sea igual al de la función de abajo
    if (typeof cargarListaPacientes === 'function') {
        cargarListaPacientes(); 
    }
});

// ========================
// LÓGICA DEL CHAT
// ========================

let pacienteSeleccionadoId = null;

// Función para cargar mensajes (La "buena" que ya te servía)
async function actualizarMensajesPsicologo() {
    if (!pacienteSeleccionadoId) return;
    const box = document.getElementById('chat-box-psicologo');

    try {
        const response = await fetch(`/obtener-mensajes-psicologo/?paciente_id=${pacienteSeleccionadoId}`);
        const data = await response.json();

        box.innerHTML = ''; 
        let ultimaFecha = null;

        data.forEach(msg => {
            // Lógica de fechas
            if (msg.fecha_completa && msg.fecha_completa !== ultimaFecha) {
                const divisor = document.createElement('div');
                divisor.className = 'chat-date-separator';
                divisor.innerHTML = `<span>${msg.dia_str || msg.fecha_completa}</span>`;
                box.appendChild(divisor);
                ultimaFecha = msg.fecha_completa;
            }

            const div = document.createElement('div');
            div.className = `message ${msg.tipo}`;

            let statusHTML = '';
            if (msg.tipo === 'sent') {
                const color = msg.leido ? '#01EEFF' : '#ffffff';
                statusHTML = `<span style="color: ${color}; font-size: 12px; margin-left: 5px;">
                                ${msg.leido ? '✓✓' : '✓'}
                              </span>`;
            }

            div.innerHTML = `
                <div style="display: flex; flex-direction: column;">
                    <div class="msg-text">${msg.texto}</div>
                    <div style="display: flex; justify-content: flex-end; align-items: center; margin-top: 2px;">
                        <small style="font-size: 10px; opacity: 0.7;">${msg.hora}</small>
                        ${statusHTML}
                    </div>
                </div>
            `;
            box.appendChild(div);
        });
        
        // Auto-scroll solo si el usuario no ha subido manualmente
        box.scrollTop = box.scrollHeight;
    } catch (e) { console.error("Error:", e); }
}

// Función al seleccionar paciente
function seleccionarChatPaciente(id, nombre, event) {
    pacienteSeleccionadoId = id;
    
    // UI Seleccionado
    document.querySelectorAll('#lista-pacientes-chat li').forEach(li => li.classList.remove('active'));
    const el = event.currentTarget;
    if (el) {
        el.classList.add('active');
        el.classList.remove('unread');
    }

    document.getElementById('chat-header-name').innerText = nombre;
    document.getElementById('receptor_paciente_id').value = id;
    document.getElementById('form-chat-psicologo').style.display = 'flex';

    // Cargar mensajes inmediatamente
    actualizarMensajesPsicologo();
}

// Envío de mensajes
document.getElementById('form-chat-psicologo').onsubmit = async (e) => {
    e.preventDefault();
    const input = document.getElementById('input-mensaje-psicologo');
    const receptorId = document.getElementById('receptor_paciente_id').value;
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    const textoParaSidebar = input.value; // Guardamos el texto antes de limpiar el input

    const formData = new FormData();
    formData.append('contenido', textoParaSidebar);
    formData.append('receptor_id', receptorId);

    const response = await fetch('/enviar_mensaje_paciente/', {
        method: 'POST',
        body: formData,
        headers: { 'X-CSRFToken': csrfToken }
    });

    const data = await response.json();

    if (response.ok && data.status === 'ok') {
        input.value = ''; // Limpiamos el input
        
        // 1. Refrescar la ventana de chat inmediatamente
        actualizarMensajesPsicologo();

        // 2. Actualizar la barra lateral (Sidebar) sin recargar
        // Buscamos el elemento activo en la lista
        const pacienteActivo = document.querySelector(`#lista-pacientes-chat li.active`);
        if (pacienteActivo) {
            // Actualizar el texto del último mensaje
            const msgContent = pacienteActivo.querySelector('.msg-content');
            if (msgContent) msgContent.innerText = data.contenido;

            // Actualizar la hora
            const msgTime = pacienteActivo.querySelector('.chat-time');
            if (msgTime) msgTime.innerText = data.hora;

            // Añadir el prefijo "Tú: "
            const lastMsgDiv = pacienteActivo.querySelector('.chat-last-msg');
            if (lastMsgDiv && !lastMsgDiv.querySelector('.tu-prefix')) {
                lastMsgDiv.insertAdjacentHTML('afterbegin', '<span class="tu-prefix">Tú: </span>');
            }
        }
    }
};

// BUSCADOR
function filtrarPacientes() {
    const busqueda = document.getElementById('buscarPaciente').value.toLowerCase();
    const items = document.querySelectorAll('#lista-pacientes-chat li');
    items.forEach(item => {
        const nombre = item.querySelector('.chat-name').innerText.toLowerCase();
        item.style.display = nombre.includes(busqueda) ? "flex" : "none";
    });
}

// AUTO-REFRESH cada 3 segundos
setInterval(actualizarMensajesPsicologo, 3000);

// ========================
// LÓGICA DE CUENTA
// ========================

async function actualizarTelefono() {
    const btn = document.querySelector('.btn-save');
    const telInput = document.querySelector('input[placeholder="Teléfono"]');
    
    const formData = new FormData();
    formData.append('id', PROFESIONAL_ID);
    formData.append('telefono', telInput.value);
    
    // Aquí puedes reutilizar tu lógica de editar_admin o crear una específica
    try {
        const response = await fetch('/editar_admin/', { // Usando tu vista de views.py para ahorrar código
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.success) {
            alert("Teléfono actualizado correctamente");
        }
    } catch (error) {
        alert("Error al actualizar");
    }
}

function showSection(sectionId, element) {
    // Ocultar todas las secciones
    document.querySelectorAll('.section').forEach(sec => {
        sec.style.display = 'none';
    });

    // Mostrar la sección seleccionada
    const target = document.getElementById(sectionId);
    if (target) {
        target.style.display = 'block';
        // Esto asegura que la pantalla suba al inicio al cambiar de pestaña
        window.scrollTo(0, 0); 
    }

    // Actualizar estado activo en el menú
    document.querySelectorAll('.menu').forEach(m => m.classList.remove('active'));
    if (element) element.classList.add('active');
}

// Variable global para guardar los pacientes y poder filtrar sin volver a llamar a la API
let todosLosPacientes = [];

async function cargarPacientesCards() {
    const response = await fetch('/api/pacientes-detallada/');
    const pacientes = await response.json();
    const grid = document.getElementById('patients-grid');
    grid.innerHTML = pacientes.map(p => `
        <div class="patient-card">
            <img src="${p.foto}" onerror="this.src='/media/perfiles/default.png'">
            <h3>${p.nombre}</h3>
            <p>${p.edad} años • ${p.genero}</p>
            <p>${p.correo}</p>
        </div>
    `).join('');
}

// Lógica de envío de mensajes (reutilizable)
async function enviarMensaje() {
    const input = document.getElementById('input-mensaje');
    const pacienteId = document.getElementById('contenedor-mensajes').dataset.pacienteId;
    if(!input.value || !pacienteId) return;

    const formData = new FormData();
    formData.append('usuario_id', pacienteId);
    formData.append('contenido', input.value);
    formData.append('csrfmiddlewaretoken', document.querySelector('[name=csrfmiddlewaretoken]').value);

    await fetch('/api/chat/enviar/', { method: 'POST', body: formData });
    input.value = '';
    actualizarMensajes(pacienteId);
}

function renderizarPacientes(lista) {
    const grid = document.getElementById('patients-grid');
    grid.innerHTML = '';

    lista.forEach(paciente => {
        // Usamos la URL que viene de la API
        const fotoUrl = paciente.foto; 
        
        const card = document.createElement('div');
        card.className = 'patient-card';
        card.innerHTML = `
            <img src="${fotoUrl}" 
                 class="patient-avatar" 
                 onerror="this.src='/media/perfiles/default.png'">
            <h3>${paciente.nombre}</h3>
            <p>${paciente.edad} años • ${paciente.genero}</p>
            <p style="font-size: 12px; opacity: 0.8;">${paciente.correo}</p>
            <p style="font-weight: bold; margin-top: 10px;">${paciente.telefono}</p>
        `;
        grid.appendChild(card);
    });
}

// Lógica de búsqueda en tiempo real
function filtrarPacientes() {
    const texto = document.getElementById('search-input').value.toLowerCase();
    const filtrados = todosLosPacientes.filter(p => 
        p.nombre.toLowerCase().includes(texto) || 
        p.correo.toLowerCase().includes(texto)
    );
    renderizarPacientes(filtrados);
}

// Modificamos showSection para que cargue los datos al entrar a la pestaña
const originalShowSection = showSection;
showSection = function(sectionId, element) {
    originalShowSection(sectionId, element);
    if (sectionId === 'pacientes') {
        cargarPacientesCards();
    }
}

function abrirModalConsulta(id, nombre) {
    document.getElementById('modalConsulta').style.display = 'block';
    document.getElementById('modal-titulo').textContent = `Atender a: ${nombre}`;
    document.getElementById('cita_id').value = id;
}

function cerrarModal() {
    document.getElementById('modalConsulta').style.display = 'none';
    document.getElementById('formConsulta').reset();
}

document.getElementById('formConsulta').onsubmit = async (e) => {
    e.preventDefault();
    
    // Mostramos un mensaje de "Cargando..."
    Swal.fire({
        title: 'Guardando consulta...',
        text: 'Por favor espera un momento',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    const data = {
        cita_id: document.getElementById('cita_id').value,
        notas: document.getElementById('notas').value,
        diagnostico: document.getElementById('diagnostico').value,
        observaciones: document.getElementById('observaciones').value,
        monto: parseFloat(document.getElementById('monto').value) || 0
    };

    try {
        const response = await fetch('/guardar_consulta/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            // MENSAJE DE ÉXITO CON SWAL
            Swal.fire({
                icon: 'success',
                title: '¡Consulta Finalizada!',
                text: 'La consulta, la sesión y el pago se han registrado correctamente.',
                confirmButtonColor: '#3b82f6',
                confirmButtonText: 'Entendido'
            }).then((result) => {
                if (result.isConfirmed) {
                    location.reload(); // Recarga la página al cerrar el mensaje
                }
            });
        } else {
            // MENSAJE DE ERROR CON SWAL
            Swal.fire({
                icon: 'error',
                title: 'Error en el servidor',
                text: result.message || 'No se pudo guardar la consulta',
                confirmButtonColor: '#d33'
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error de red',
            text: 'Hubo un problema al conectar con el servidor.'
        });
    }
};

