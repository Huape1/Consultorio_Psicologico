document.addEventListener('DOMContentLoaded', () => {
    // Asegúrate de que el nombre sea igual al de la función de abajo
    if (typeof cargarListaPacientes === 'function') {
        cargarListaPacientes(); 
    }
});

// ========================
// LÓGICA DEL CHAT
// ========================

async function cargarListaPacientes() {
    const listaUl = document.getElementById('lista-usuarios-chat');
    if (!listaUl) return; // Seguridad por si no estás en la pestaña de mensajes

    try {
        const response = await fetch('/api/pacientes-detallada/'); 
        const usuarios = await response.json();
        
        listaUl.innerHTML = '';
        usuarios.forEach(user => {
            const li = document.createElement('li');
            li.className = 'user-item'; // Para que le des estilo en CSS
            li.textContent = user.nombre;
            // Al hacer clic, cargamos el chat de ese paciente
            li.onclick = () => seleccionarChat(user.id, user.nombre);
            listaUl.appendChild(li);
        });
    } catch (error) {
        console.error("Error al cargar lista de pacientes para chat:", error);
    }
}

async function seleccionarChat(pacienteId, nombre) {
    document.getElementById('chat-header-nombre').textContent = `Chat con ${nombre}`;
    document.getElementById('contenedor-mensajes').dataset.pacienteId = pacienteId;
    
    await actualizarMensajes(pacienteId);
}

async function actualizarMensajes(pacienteId) {
    const contenedor = document.getElementById('contenedor-mensajes');
    try {
        const response = await fetch(`/api/chat/mensajes/${pacienteId}/`);
        const mensajes = await response.json();
        
        contenedor.innerHTML = '';
        mensajes.forEach(msg => {
            const div = document.createElement('div');
            // La clase 'sent' o 'received' controlará la posición y el color
            div.className = `message ${msg.tipo}`; 
            
            div.innerHTML = `
                <div class="message-content">
                    <span class="message-text">${msg.texto}</span>
                    <span class="message-time">${msg.hora || ''}</span>
                </div>
            `;
            contenedor.appendChild(div);
        });
        contenedor.scrollTop = contenedor.scrollHeight;
    } catch (error) {
        console.error("Error al obtener mensajes:", error);
    }
}

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

