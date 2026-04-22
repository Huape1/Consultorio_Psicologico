window.verExpediente = verExpediente;
// Al inicio del archivo
let currentPacienteId = null;

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

function seleccionarChatSoporte(event) {
    pacienteSeleccionadoId = 'SOPORTE'; // ID especial que Django entenderá
    
    // UI: Quitar activo de pacientes y ponerlo en soporte
    document.querySelectorAll('#lista-pacientes-chat li').forEach(li => li.classList.remove('active'));
    document.querySelectorAll('.soporte-chat-item').forEach(div => div.classList.add('active'));

    document.getElementById('chat-header-name').innerText = "Soporte Técnico (Administradores)";
    document.getElementById('receptor_paciente_id').value = 'SOPORTE';
    document.getElementById('form-chat-psicologo').style.display = 'flex';

    actualizarMensajesPsicologo();
}

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

// Variable global para guardar los pacientes y poder filtrar sin volver a llamar a la API
let todosLosPacientes = [];

async function cargarPacientesCards() {
    const response = await fetch('/api/pacientes-detallada/');
    const pacientes = await response.json();
    const grid = document.getElementById('patients-grid');
    
    grid.innerHTML = pacientes.map(p => `
        <div class="patient-card" onclick="verExpediente(${p.id})" style="cursor: pointer;">
            <img src="${p.foto}" onerror="this.src='/media/perfiles/default.png'">
            <h3>${p.nombre}</h3>
            <p>${p.fecha_nacimiento} • ${p.genero}</p>
            <p>${p.correo}</p>
        </div>
    `).join('');
}

async function verExpediente(pacienteId) {
    console.log("Cargando paciente ID:", pacienteId);
    currentPacienteId = pacienteId;
    
    try {
        const response = await fetch(`/api/detalle-paciente/${pacienteId}/`);
        const data = await response.json();

        expedienteActualId = data.id_expediente;

        // 1. Llenamos los datos básicos
        document.getElementById('exp-nombre').innerText = data.nombre || "Sin nombre";
        document.getElementById('exp-foto').src = data.foto;
        document.getElementById('exp-ocupacion').innerText = data.ocupacion || "N/A";
        document.getElementById('exp-civil').innerText = data.estado_civil || "N/A";
        document.getElementById('exp-nacimiento').innerText = data.fecha_nacimiento;
        document.getElementById('exp-creacion').innerText = data.fecha_creacion;

        // 2. Antecedentes (Verifica que el ID exista antes de asignar)
        const elTraumas = document.getElementById('exp-traumas');
        const elPers = document.getElementById('exp-pers');
        const elPsico = document.getElementById('exp-psico');
        const elFam = document.getElementById('exp-fam');

        if(elTraumas) elTraumas.innerText = data.antecedentes.traumas || "Ninguno";
        if(elPers) elPers.innerText = data.antecedentes.personales || "Ninguno";
        if(elPsico) elPsico.innerText = data.antecedentes.psicologicos || "Ninguno";
        if(elFam) elFam.innerText = data.antecedentes.familiares || "Ninguno";

        // 3. Llenar Evoluciones
        const divEvoluciones = document.getElementById('lista-evoluciones');
        if(divEvoluciones) {
            divEvoluciones.innerHTML = data.evoluciones.length > 0 
                ? data.evoluciones.map(ev => `
                    <div style="border-left: 2px solid #00bcd4; padding-left: 15px; margin-bottom: 20px; position: relative;">
                        <span style="font-size: 0.8rem; color: #888;">${ev.fecha}</span>
                        <p style="margin: 5px 0;">${ev.notas}</p>
                    </div>
                `).join('')
                : '<p style="color: #888; font-style: italic;">No hay notas de evolución registradas.</p>';
        }

        // Mostrar sección
        document.getElementById('pacientes').style.display = 'none';
        document.getElementById('expediente-detalle').style.display = 'block';

        // 4. Llenamos la tabla
        // ... dentro de verExpediente(pacienteId) en la parte de la tabla ...
        const tabla = document.getElementById('tabla-historial');
        if (tabla) {
            tabla.innerHTML = data.historial.map(h => {
                const btnBase = "padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 0.75rem; margin-right: 5px; color: white; display: inline-flex; align-items: center; gap: 4px; transition: 0.3s;";

                // 1. Botón VER CITA (Siempre activo)
                let botones = `
            <button style="${btnBase} background-color: #00bcd4;" onclick="verInfoCita(${h.id_cita})">
                <i class="fas fa-calendar"></i> Ver Cita
            </button>
        `;

                // 2. Botón VER CONSULTA (Color según existencia)
                if (h.tiene_consulta) {
                    botones += `
                <button style="${btnBase} background-color: #4caf50;" onclick="verDetalleConsulta(${h.id_consulta})">
                    <i class="fas fa-notes-medical"></i> Ver Consulta
                </button>
            `;
                } else {
                    botones += `
                <button style="${btnBase} background-color: #bdc3c7; cursor: not-allowed;" disabled>
                    <i class="fas fa-lock"></i> Ver Consulta
                </button>
            `;
                }

                return `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 8px;">${h.fecha}</td>
                <td>${h.hora}</td>
                <td><span class="badge badge-${h.estado.toLowerCase()}">${h.estado}</span></td>
                <td><div style="display: flex;">${botones}</div></td>
            </tr>
        `;
            }).join('');
        }

        // 4. CAMBIO DE PANTALLA
        document.getElementById('pacientes').style.setProperty('display', 'none', 'important');
        document.getElementById('expediente-detalle').style.setProperty('display', 'block', 'important');

    } catch (error) {
        console.error("Error crítico al cargar expediente:", error);
    }
}

async function verDetalleConsulta(consultaId) {
    try {
        const response = await fetch(`/api/detalle-consulta/${consultaId}/`);
        if (!response.ok) throw new Error("Error en la respuesta");

        const data = await response.json();

        // Llenar datos en el modal
        document.getElementById('det-diagnostico').innerText = data.diagnostico || "No registrado";
        document.getElementById('det-resumen').innerText = data.resumen || "No registrado";
        document.getElementById('det-conducta').innerText = data.conducta || "No registrado";
        document.getElementById('det-notas').innerText = data.notas || "Sin notas adicionales";

        // Mostrar el modal
        document.getElementById('modal-detalle-consulta').style.display = 'flex';

    } catch (error) {
        console.error("Error al obtener detalle:", error);
        alert("No se pudo cargar el detalle de la consulta. Verifica que la URL esté bien configurada.");
    }
}

async function verInfoCita(citaId) {
    console.log("Cargando información de cita:", citaId);
    try {
        const response = await fetch(`/api/info-cita/${citaId}/`);
        if (!response.ok) throw new Error("No se pudo obtener la información");

        const data = await response.json();

        // Llenar el modal de la cita
        document.getElementById('cita-servicio').innerText = data.servicio;
        document.getElementById('cita-modalidad').innerText = data.modalidad;
        document.getElementById('cita-psicologo').innerText = data.psicologo;
        document.getElementById('cita-motivo').innerText = data.motivo || "No especificado";

        // Mostrar el modal
        document.getElementById('modal-info-cita').style.display = 'flex';

    } catch (error) {
        console.error("Error:", error);
        alert("Error al cargar los datos de la cita.");
    }
}

function mostrarInputNota() {
    document.getElementById('nueva-nota-container').style.display = 'block';
}

async function guardarEvolucion() {
    const notasArea = document.getElementById('texto-nueva-nota');
    const notas = notasArea.value;
    
    if (!notas) return alert("Por favor, escribe una nota.");

    try {
        const response = await fetch('/api/guardar-evolucion/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                expediente_id: parseInt(expedienteActualId),
                notas: notas
            })
        });

        const result = await response.json();

        if (response.ok) {
            // Limpiar y ocultar input
            notasArea.value = '';
            document.getElementById('nueva-nota-container').style.display = 'none';

            // Insertar la nueva nota al principio de la lista visualmente
            const divEvoluciones = document.getElementById('lista-evoluciones');
            const nuevaNotaHTML = `
                <div style="border-left: 2px solid #00bcd4; padding-left: 15px; margin-bottom: 20px; background: white; padding: 10px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <span style="font-size: 0.8rem; color: #888;">${result.fecha} (Reciente)</span>
                    <p style="margin: 5px 0;">${result.notas}</p>
                </div>
            `;
            
            // Si decía "No hay notas", borramos ese mensaje primero
            if (divEvoluciones.innerText.includes("No hay notas")) {
                divEvoluciones.innerHTML = nuevaNotaHTML;
            } else {
                divEvoluciones.insertAdjacentHTML('afterbegin', nuevaNotaHTML);
            }
            
            alert("Evolución guardada correctamente.");
        }
    } catch (error) {
        console.error("Error al guardar:", error);
        alert("Hubo un error al conectar con el servidor.");
    }
}

// Función para volver atrás
function volverALista() {
    document.getElementById('expediente-detalle').style.display = 'none';
    document.getElementById('pacientes').style.display = 'block';
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

//
// CONSULTAS
//

// Actualizar reloj en tiempo real
function updateClock() {
    const now = new Date();
    document.getElementById('live-clock').innerText = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
}
setInterval(updateClock, 1000);
updateClock();


function showSection(sectionId, element) {
    // 1. Ocultar todas las secciones
    document.querySelectorAll('.section').forEach(sec => {
        sec.style.display = 'none';
        sec.classList.remove('active');
    });

    // 2. Mostrar la sección destino
    const target = document.getElementById(sectionId);
    if (target) {
        // Si es la sesión activa, usamos grid por tu diseño de sidebar
        target.style.display = (sectionId === 'seccion-sesion') ? 'grid' : 'block';
        target.classList.add('active');
    }

    // 3. Actualizar el menú lateral (estilos)
    document.querySelectorAll('.menu').forEach(m => m.classList.remove('active'));
    if (element) element.classList.add('active');

    // 4. Cargar datos específicos si es necesario
    if (sectionId === 'pacientes') cargarPacientesCards();
}


// 1. Declaramos las variables al inicio para que sean accesibles en todo el archivo
let labelsIniciales = [];
let valoresIniciales = [];
window.myChart = null; // Usamos window para asegurar que updateChart la vea

// 2. Función única para inicializar o refrescar el gráfico
function renderizarGrafico() {
    const canvas = document.getElementById('lineChart');
    if (!canvas) return;

    // Intentamos recuperar los datos iniciales (Semana) de los nuevos IDs
    try {
        labelsIniciales = JSON.parse(document.getElementById('labels-semana').textContent);
        valoresIniciales = JSON.parse(document.getElementById('data-semana').textContent);
    } catch (e) {
        console.warn("No se pudieron cargar los datos del gráfico. Verifica que los IDs coincidan con el HTML.");
        return; // Detenemos la ejecución si no hay datos
    }

    const ctx = canvas.getContext('2d');

    let chartExistente = Chart.getChart("lineChart");
    if (chartExistente) {
        chartExistente.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labelsIniciales,
            datasets: [{
                label: 'Consultas',
                data: valoresIniciales,
                borderColor: '#0fa3b1',
                backgroundColor: 'rgba(15, 163, 177, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1, color: '#94a3b8' } },
                x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
            }
        }
    });
}

// 3. Función para los botones de filtro
function updateChart(periodo) {
    if (!window.myChart) return;

    document.querySelectorAll('.btn-filter').forEach(btn => btn.classList.remove('active'));
    if (event) event.currentTarget.classList.add('active');

    let nuevasLabels, nuevosDatos;

    if (periodo === 'mes') {
        nuevasLabels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
        nuevosDatos = JSON.parse(document.getElementById('data-mes').textContent);
    } else if (periodo === 'año') {
        nuevasLabels = JSON.parse(document.getElementById('labels-anio').textContent);
        nuevosDatos = JSON.parse(document.getElementById('data-anio').textContent);
    } else {
        nuevasLabels = JSON.parse(document.getElementById('labels-semana').textContent);
        nuevosDatos = JSON.parse(document.getElementById('data-semana').textContent);
    }

    window.myChart.data.labels = nuevasLabels;
    window.myChart.data.datasets[0].data = nuevosDatos;
    window.myChart.update();
}

// 4. Disparador cuando la página carga
document.addEventListener('DOMContentLoaded', () => {
    if (typeof Chart !== 'undefined') {
        renderizarGrafico();
    } else {
        console.error("Chart.js no está cargado. Revisa el orden de tus scripts en el HTML.");
    }
});

//
//  SESIONES
//

let currentStep = 1;

function prepararConsulta(btn) {
    const nombre = btn.getAttribute('data-nombre');
    const fotoUrl = btn.getAttribute('data-foto');
    const pacienteId = btn.getAttribute('data-id');
    const citaId = btn.getAttribute('data-cita-id'); // <--- NECESITAS AÑADIR ESTO AL BOTÓN EN HTML
    
    const necesitaExpediente = btn.getAttribute('data-primera') === "1";

    if (necesitaExpediente) {
        abrirModalExpediente(nombre, pacienteId);
    } else {
        // Pasamos los 4 argumentos
        abrirSesion(nombre, fotoUrl, pacienteId, citaId);
    }
}

function gestionarInicioConsulta(nombre, fotoUrl, esPrimeraVez) {
    if (esPrimeraVez) {
        // 1. Si es primera vez, mostramos el Modal del Expediente
        console.log("Abriendo Expediente para:", nombre);
        abrirModalExpediente(nombre);
    } else {
        // 2. Si no es la primera, vamos directo a la sesión activa
        console.log("Abriendo Sesión para:", nombre);
        abrirSesion(nombre, fotoUrl);
    }
}

function abrirModalExpediente(nombre, pacienteId) { // Añade pacienteId
    const modal = document.getElementById('modal-expediente');
    if (modal) {
        modal.style.display = 'flex';
        modal.querySelector('.paciente-nombre-modal').innerText = nombre;
        // Guardamos el ID en un input oculto o atributo
        modal.setAttribute('data-paciente-id', pacienteId);
    }
}

// Función para cerrar el modal y limpiar el formulario
function cerrarModalExpediente() {
    const modal = document.getElementById('modal-expediente');
    const form = document.getElementById('form-nuevo-expediente');
    
    if (modal) {
        modal.style.display = 'none';
        if (form) form.reset(); // Limpia los campos para la próxima vez
    }
}

// Función que se ejecuta al enviar el formulario
document.getElementById('form-nuevo-expediente').addEventListener('submit', function(e) {
    e.preventDefault();

    const modal = document.getElementById('modal-expediente');
    const pacienteId = modal.getAttribute('data-paciente-id');
    const formData = new FormData(this);
    formData.append('paciente_id', pacienteId);

    // Ya no definimos la función aquí, solo la llamamos
    const csrftoken = getCookie('csrftoken'); 

    fetch('/guardar-expediente/', {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': csrftoken, // <--- Aquí se envía el token correctamente
        }
    })
    .then(response => {
        // Verificamos si la respuesta es JSON antes de procesarla
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(data => {
        if (data.status === 'success') {
            alert("Expediente guardado exitosamente");
            const nombre = document.querySelector('.paciente-nombre-modal').innerText;
            const foto = document.querySelector('.large-avatar').src;
            
            cerrarModalExpediente();
            abrirSesion(nombre, foto);
        }
    })
    .catch(error => {
        console.error('Error detallado:', error);
        alert("Error de seguridad o de servidor. Revisa la consola.");
    });
});

// Esta es tu función original, la mantenemos para cuando se guarde el expediente
async function abrirSesion(nombre, fotoUrl, pacienteId, citaId) {
    // 1. Navegación UI
    showSection('seccion-sesion');
    
    // 2. Llenar datos básicos estáticos de la sesión
    document.getElementById('side-name').innerText = nombre;
    document.getElementById('side-avatar').src = fotoUrl;
    document.getElementById('sesion-cita-id').value = citaId; // Guardar ID de cita para guardar luego

    // 3. Reiniciar formulario (Pasos y Ratings)
    currentStep = 1;
    showStep(1);
    document.getElementById('form-multistep-sesion').reset();
    document.querySelectorAll('.btn-rate').forEach(b => b.classList.remove('selected'));

    // 4. CARGAR DATOS REALES DEL EXPEDIENTE (AJAX)
    await cargarDatosExpedienteLateral(pacienteId);
}

// --- FUNCIÓN AJAX PARA OBTENER DATOS DEL EXPEDIENTE ---
async function cargarDatosExpedienteLateral(pacienteId) {
    const riesgosContainer = document.getElementById('side-riesgos-container');
    const riesgosTags = document.getElementById('side-riesgos-tags');
    const timeline = document.getElementById('side-evolucion-timeline');

    try {
        // Llamada a la API (necesitas crear esta vista en Django, ver paso 3)
        const response = await fetch(`/api/obtener-expediente-lateral/?paciente_id=${pacienteId}`);
        if (!response.ok) throw new Error("Error cargando expediente");
        
        const data = await response.json();

        // A. Llenar Info Básica y General
        document.getElementById('side-meta').innerText = `${data.edad} años • ${data.estado_civil || 'Sin dato'}`;
        document.getElementById('side-ocupacion').innerText = data.ocupacion || 'Ocupación no registrada';

        // B. Llenar Riesgos y Alertas
        riesgosTags.innerHTML = '';
        if (data.riesgos && data.riesgos.trim() !== "") {
            riesgosContainer.style.display = 'block';
            // Asumimos riesgos separados por comas
            data.riesgos.split(',').forEach(riesgo => {
                const span = document.createElement('span');
                span.className = 'tag red';
                span.innerText = riesgo.trim();
                riesgosTags.appendChild(span);
            });
        } else {
            riesgosContainer.style.display = 'none';
        }

        // C. Llenar Antecedentes
        document.getElementById('side-ant-personales').innerText = data.ant_personales || 'Sin registros.';
        document.getElementById('side-ant-familiares').innerText = data.ant_familiares || 'Sin registros.';
        document.getElementById('side-ant-psicologicos').innerText = data.ant_psicologicos || 'Sin registros.';
        document.getElementById('side-ant-traumas').innerText = data.traumas || 'Sin registros.';

        // D. Llenar Evolución (Timeline)
        timeline.innerHTML = '';
        if (data.evoluciones && data.evoluciones.length > 0) {
            data.evoluciones.forEach(evo => {
                const item = document.createElement('div');
                item.className = 'timeline-item';
                item.innerHTML = `
                    <div class="timeline-date">${evo.fecha}</div>
                    <div class="timeline-content">${evo.notas.substring(0, 100)}${evo.notas.length > 100 ? '...' : ''}</div>
                `;
                timeline.appendChild(item);
            });
        } else {
            timeline.innerHTML = '<p class="text-muted p-2">No hay notas de evolución previas.</p>';
        }

    } catch (error) {
        console.error("Error AJAX:", error);
        // Poner mensajes de error en la UI si gustas
    }
}

// --- LÓGICA DE RATINGS (BOTONES 1-10) ---
document.querySelectorAll('.rating-scale .btn-rate').forEach(button => {
    button.addEventListener('click', function() {
        const container = this.closest('.rating-scale');
        const inputOculto = container.querySelector('input[type="hidden"]');
        const valor = this.getAttribute('data-value');

        // Deseleccionar hermanos
        container.querySelectorAll('.btn-rate').forEach(btn => btn.classList.remove('selected'));

        // Seleccionar actual
        this.classList.add('selected');
        inputOculto.value = valor;
    });
});

// --- LÓGICA DE TABS DEL SIDEBAR (Antecedentes/Evolución) ---
function switchSidebarTab(btn, tabId) {
    const card = btn.closest('.sidebar-card');
    
    // Desactivar botones y panes
    card.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    card.querySelectorAll('.tab-pane').forEach(p => p.style.display = 'none');

    // Activar actual
    btn.classList.add('active');
    document.getElementById(tabId).style.display = 'block';
}

// Función para el botón "Guardar Expediente" dentro del modal/sección
function guardarExpedienteYContinuar() {
    // Aquí iría tu lógica AJAX para guardar en la DB
    alert("Expediente guardado exitosamente");
    
    // Cerramos modal y abrimos la sesión
    const modal = document.getElementById('modal-expediente');
    if(modal) modal.style.display = 'none';
    
    // Obtenemos los datos actuales para abrir la sesión
    const nombre = document.getElementById('side-name').innerText;
    const foto = document.getElementById('side-avatar').src;
    abrirSesion(nombre, foto);
}

function showStep(step) {
    // Ocultar todos los pasos
    document.querySelectorAll('.step-content').forEach(content => {
        content.style.display = 'none';
    });

    // Mostrar paso actual
    const activeStep = document.getElementById(`step-${step}`);
    if (activeStep) activeStep.style.display = 'block';

    // Actualizar barra de progreso (bar-1, bar-2, bar-3)
    for (let i = 1; i <= 3; i++) {
        const bar = document.getElementById(`bar-${i}`);
        if (bar) {
            if (i <= step) bar.classList.add('active');
            else bar.classList.remove('active');
        }
    }

    // Actualizar textos y botones
    const titles = ["Evaluación de la Sesión", "Registro de Sesión", "Plan de Trabajo"];
    document.getElementById('session-title').innerText = titles[step - 1];
    document.getElementById('step-indicator').innerText = `Paso ${step} de 3`;

    // Botón atrás
    const btnPrev = document.getElementById('btn-prev');
    if (btnPrev) btnPrev.style.visibility = (step === 1) ? 'hidden' : 'visible';

    // Botón siguiente/finalizar
    const btnNext = document.getElementById('btn-next');
    if (btnNext) {
        btnNext.innerText = (step === 3) ? 'Finalizar Sesión ✓' : 'Siguiente →';
    }
}

function changeStep(n) {
    const nuevoPaso = currentStep + n;
    
    if (nuevoPaso >= 1 && nuevoPaso <= 3) {
        currentStep = nuevoPaso;
        showStep(currentStep);
    } else if (nuevoPaso > 3) {
        // En lugar de solo el alert, llamamos a la función de guardado
        submitConsulta(); 
    }
}

function submitConsulta() {
    const form = document.getElementById('form-multistep-sesion');
    const formData = new FormData(form);
    
    // Función para obtener el CSRF token (puedes reutilizar la que ya tienes arriba)
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    fetch('/guardar-consulta/', { // Asegúrate de que esta URL coincida con tu urls.py
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': csrftoken,
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert("¡Consulta guardada con éxito!");
            window.location.reload(); // O redirige al panel
        } else {
            alert("Error: " + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Ocurrió un error al guardar la sesión.");
    });
}

window.volverALista = function() {
    document.getElementById('expediente-detalle').style.display = 'none';
    document.getElementById('pacientes').style.display = 'block';
}

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


function abrirEdicionAntecedentes() {
    if (!currentPacienteId) {
        alert("Selecciona un paciente primero");
        return;
    }

    // Ponemos el ID en el campo oculto
    document.getElementById('edit_paciente_id').value = currentPacienteId;

    // Extraemos el texto de la pantalla lateral y lo pasamos a los textareas del modal
    // Asegúrate de que los IDs 'exp-traumas', etc., sean los que usas en tu barra lateral
    document.getElementById('exp_traumas').value = document.getElementById('exp-traumas')?.innerText.trim() || "";
    document.getElementById('exp_personales').value = document.getElementById('exp-personales')?.innerText.trim() || "";
    document.getElementById('exp_familiares').value = document.getElementById('exp-familiares')?.innerText.trim() || "";
    document.getElementById('exp_psicologicos').value = document.getElementById('exp-psicologicos')?.innerText.trim() || "";

    // Mostramos el modal
    document.getElementById('modal-editar-ante').style.display = 'flex';
}

// 3. Manejar el envío del formulario
document.getElementById('form-editar-ante').addEventListener('submit', async (e) => {
    e.preventDefault();

    const pId = document.getElementById('edit_paciente_id').value;
    
    // Recolectamos lo que escribió el usuario en el modal
    const datosNuevos = {
        traumas: document.getElementById('exp_traumas').value,
        personales: document.getElementById('exp_personales').value,
        familiares: document.getElementById('exp_familiares').value,
        psicologicos: document.getElementById('exp_psicologicos').value
    };

    const formData = new FormData();
    formData.append('traumas', datosNuevos.traumas);
    formData.append('ant_personales', datosNuevos.personales);
    formData.append('ant_familiares', datosNuevos.familiares);
    formData.append('ant_psicologicos', datosNuevos.psicologicos);

    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    try {
        const response = await fetch(`/api/editar-paciente/${pId}/`, {
            method: 'POST',
            body: formData,
            headers: { 'X-CSRFToken': csrftoken }
        });

        const data = await response.json();

        if (response.ok && data.status === 'success') {
            // ACTUALIZACIÓN DE LA PANTALLA LATERAL (Donde el psicólogo lee)
            // IMPORTANTE: Estos IDs deben existir en tu panel derecho
            if(document.getElementById('exp-traumas')) 
                document.getElementById('exp-traumas').innerText = datosNuevos.traumas;
            if(document.getElementById('exp-personales')) 
                document.getElementById('exp-personales').innerText = datosNuevos.personales;
            if(document.getElementById('exp-familiares')) 
                document.getElementById('exp-familiares').innerText = datosNuevos.familiares;
            if(document.getElementById('exp-psicologicos')) 
                document.getElementById('exp-psicologicos').innerText = datosNuevos.psicologicos;

            cerrarEdicionAntecedentes();
            alert("¡Todo actualizado!");
        } else {
            alert("Error: " + (data.error || "No se pudo actualizar"));
        }
    } catch (error) {
        console.error("Error:", error);
    }
});

function cerrarEdicionAntecedentes() {
    document.getElementById('modal-editar-ante').style.display = 'none';
}

function guardarCambiosPaciente() {
    const pacienteId = document.getElementById('edit_paciente_id').value;

    // Verificamos que tengamos un ID válido antes de continuar
    if (!pacienteId) {
        console.error("No se encontró el ID del paciente para editar.");
        return;
    }

    const formData = new FormData();

    // --- DATOS PERSONALES (Usuario/Paciente) ---
    formData.append('nombrePila', document.getElementById('edit_nombre_pila').value);
    formData.append('primerApellido', document.getElementById('edit_primer_apellido').value);
    formData.append('correo', document.getElementById('edit_correo').value);
    formData.append('genero', document.getElementById('edit_genero').value);
    formData.append('fecha_nacimiento', document.getElementById('edit_fecha_nac').value);

    // Si tienes un input de tipo file para la foto:
    const fotoInput = document.getElementById('edit_foto_perfil');
    if (fotoInput && fotoInput.files[0]) {
        formData.append('fotoPerfil', fotoInput.files[0]);
    }

    // --- DATOS CLÍNICOS (Expediente) ---
    formData.append('ocupacion', document.getElementById('edit_ocupacion').value);
    formData.append('estado_civil', document.getElementById('edit_estado_civil').value);
    formData.append('traumas', document.getElementById('edit_traumas').value);
    formData.append('riesgos', document.getElementById('edit_riesgos').value);

    // --- ANTECEDENTES ---
    formData.append('ant_personales', document.getElementById('edit_ant_personales').value);
    formData.append('ant_psicologicos', document.getElementById('edit_ant_psicologicos').value);
    formData.append('ant_familiares', document.getElementById('edit_ant_familiares').value);

    // Ejecutar petición
    fetch(`/api/pacientes/editar/${pacienteId}/`, {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
        .then(response => {
            if (!response.ok) {
                // Manejo de errores de red o servidor (404, 500, etc)
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                // Usar una notificación más limpia si tienes una disponible
                alert("¡Éxito! Los datos de " + data.nombre_completo + " han sido actualizados.");
                location.reload();
            } else {
                alert("Error al guardar: " + data.error);
            }
        })
        .catch(error => {
            console.error('Error en la petición:', error);
            alert("Ocurrió un error inesperado al intentar guardar los cambios.");
        });
}

document.addEventListener('DOMContentLoaded', function () {
    const inputPaciente = document.getElementById('filter-paciente');
    const inputFecha = document.getElementById('filter-fecha');
    const pills = document.querySelectorAll('#estado-filters .btn-pill');
    const filas = document.querySelectorAll('.custom-table tbody tr');

    function filtrarTabla() {
        const busquedaPaciente = inputPaciente.value.toLowerCase();
        const busquedaFecha = inputFecha.value.toLowerCase();

        // Obtener el estado activo de las pills
        const pillActiva = document.querySelector('#estado-filters .btn-pill.active');
        const estadoFiltro = pillActiva.getAttribute('data-status').toLowerCase();

        filas.forEach(fila => {
            const nombrePaciente = fila.querySelector('.p-name').innerText.toLowerCase();
            const fechaCita = fila.querySelector('td:first-child').innerText.toLowerCase();
            const estadoCita = fila.querySelector('.status-badge').innerText.toLowerCase();

            const coincidePaciente = nombrePaciente.includes(busquedaPaciente);
            const coincideFecha = fechaCita.includes(busquedaFecha);
            const coincideEstado = (estadoFiltro === 'todas' || estadoCita === estadoFiltro);

            if (coincidePaciente && coincideFecha && coincideEstado) {
                fila.style.display = "";
            } else {
                fila.style.display = "none";
            }
        });
    }

    // Eventos para inputs
    inputPaciente.addEventListener('input', filtrarTabla);
    inputFecha.addEventListener('input', filtrarTabla);

    // Eventos para las pills (botones de estado)
    pills.forEach(pill => {
        pill.addEventListener('click', function () {
            pills.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            filtrarTabla();
        });
    });
});




function abrirModalEditarDatos() {
    if (!currentPacienteId) {
        console.error("No hay un ID de paciente seleccionado");
        return;
    }

    const ocupacionActual = document.getElementById('exp-ocupacion').innerText;
    const civilActual = document.getElementById('exp-civil').innerText;
    
    document.getElementById('edit-paciente-id').value = currentPacienteId;
    document.getElementById('edit-ocupacion').value = ocupacionActual;
    document.getElementById('edit-estado-civil').value = civilActual;
    

    document.getElementById('modal-editar-datos').style.display = 'flex';
}

function cerrarModalDatos() {
    document.getElementById('modal-editar-datos').style.display = 'none';
}

// Asegúrate de tener esta variable global al inicio de tu psicologo.js
// let currentPacienteId = null; 

document.getElementById('form-editar-datos').addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Recolectamos los valores de los inputs del modal
    const pId = document.getElementById('edit-paciente-id').value;
    const ocu = document.getElementById('edit-ocupacion').value;
    const civ = document.getElementById('edit-estado-civil').value;

    // Log para depuración en el navegador
    console.log("Datos a enviar:", { pId, ocu, civ });

    // 2. Preparamos el FormData
    const formData = new FormData();
    formData.append('paciente_id', pId);
    formData.append('ocupacion', ocu);
    formData.append('estado_civil', civ);

    // 3. Obtenemos el CSRF Token (necesario para Django)
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    try {
        // 4. Realizamos la petición al servidor
        const response = await fetch('/api/editar-datos-expediente/', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': csrftoken 
            }
        });

        // 5. Procesamos la respuesta JSON
        const data = await response.json();
        console.log("Respuesta completa del servidor:", data);

        if (response.ok && data.status === 'success') {
            // ÉXITO: Actualizamos la UI sin recargar
            document.getElementById('exp-ocupacion').innerText = ocu;
            document.getElementById('exp-civil').innerText = civ;
            
            // Cerramos el modal (asumiendo que tienes esta función)
            cerrarModalEditarDatos(); 
            
            alert("¡Datos actualizados correctamente!");
        } else {
            // ERROR: Mostramos el mensaje que viene de Django
            console.error("Error del servidor:", data.message);
            alert("Error: " + (data.message || "No se pudo actualizar el expediente"));
        }

    } catch (error) {
        // ERROR DE RED: No se pudo llegar al servidor
        console.error("Error de conexión:", error);
        alert("Fallo de conexión con el servidor.");
    }
});

// Función auxiliar para cerrar el modal (si no la tienes)
function cerrarModalEditarDatos() {
    document.getElementById('modal-editar-datos').style.display = 'none';
}








function enableEdit() {
    // Quitar el readonly de todos los inputs del perfil
    document.querySelectorAll('.profile-input').forEach(input => {
        input.removeAttribute('readonly');
        input.style.background = "#fff";
        input.style.border = "1px solid #0FA3B1";
    });

    // Alternar botones
    document.getElementById('btnEdit').style.display = 'none';
    document.getElementById('btnSave').style.display = 'block';
}

function previewImage(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profilePreview').src = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function habilitarEdicion() {
    // Desbloqueamos los inputs
    const inputs = document.querySelectorAll('.editable-input');
    inputs.forEach(input => {
        input.removeAttribute('readonly');
        input.style.backgroundColor = "white";
        input.style.border = "1px solid #0FA3B1";
    });

    // Cambiamos los botones
    document.getElementById('btn-editar-perfil').style.display = 'none';
    document.getElementById('btn-guardar-perfil').style.display = 'block';
}

function previsualizarFoto(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('img-perfil-preview').src = e.target.result;
            // Si el usuario cambia la foto, habilitamos el guardado automáticamente
            document.getElementById('btn-editar-perfil').style.display = 'none';
            document.getElementById('btn-guardar-perfil').style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    }
}