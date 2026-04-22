let psicologoSeleccionadoId = null;


// Agregamos 'event' como parámetro
async function seleccionarChatPsicologo(id, nombreCompleto, event) {
    psicologoSeleccionadoId = id;

    const item = event.currentTarget;
    if (item) item.classList.remove('unread');

    // Ajuste de título dinámico
    const prefijo = (id === 'SOPORTE') ? '' : 'Psicól. ';
    document.getElementById('chat-header').innerHTML = `${prefijo}${nombreCompleto}`;
    
    document.getElementById('receptor_id').value = id;
    document.getElementById('form-chat-paciente').style.display = 'block';

    document.querySelectorAll('#lista-psicologos-chat li').forEach(el => el.style.background = 'transparent');
    if (event && event.currentTarget) {
        event.currentTarget.style.background = '#e0f4ff';
    }

    actualizarMensajesPaciente();
}

// Modificación en el setInterval para actualizar también la lista lateral
async function refrescarListaLateral() {
    // Aquí podrías hacer un fetch pequeño a una vista que solo devuelva 
    // el estado de los últimos mensajes para actualizar la sidebar sin recargar.
    // Por ahora, actualizarMensajesPaciente() ya marca como leído en el servidor.
}

function seleccionarChatYIr(id, nombre) {
    // 1. Cambiamos a la sección de mensajes
    showSection('mensajes');
    
    // 2. Buscamos el elemento en la lista de la izquierda del chat para "hacerle clic"
    const chatItem = document.querySelector(`.chat-item[onclick*="'${id}'"]`);
    if (chatItem) {
        chatItem.click();
    } else {
        // Si por alguna razón no está en la lista visible, forzamos la selección
        seleccionarChatPsicologo(id, nombre);
    }
}

async function actualizarMensajesPaciente() {
    if (!psicologoSeleccionadoId) return;
    const contenedor = document.getElementById('chat-box-paciente');

    try {
        const response = await fetch(`/obtener_mensajes_paciente/?psicologo_id=${psicologoSeleccionadoId}`);
        const mensajes = await response.json();

        contenedor.innerHTML = ''; 
        let ultimaFecha = null;

        mensajes.forEach(msg => {
            // LÓGICA DEL SEPARADOR DE FECHA
            if (msg.fecha_completa !== ultimaFecha) {
                const divisor = document.createElement('div');
                divisor.className = 'chat-date-separator';
                
                // Configuración de fechas para comparación
                const fechaMensaje = new Date(msg.fecha_completa + "T00:00:00");
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);
                
                const ayer = new Date();
                ayer.setDate(ayer.getDate() - 1);
                ayer.setHours(0, 0, 0, 0);

                let textoFecha = msg.dia_str;

                // Comparación lógica
                if (fechaMensaje.getTime() === hoy.getTime()) {
                    textoFecha = "Hoy";
                } else if (fechaMensaje.getTime() === ayer.getTime()) {
                    textoFecha = "Ayer";
                }

                divisor.innerHTML = `<span>${textoFecha}</span>`;
                contenedor.appendChild(divisor);
                ultimaFecha = msg.fecha_completa;
            }

            // CREACIÓN DEL MENSAJE (Tu estructura actual mejorada)
            const div = document.createElement('div');
            div.className = `message ${msg.tipo}`;
            
            let statusHTML = '';
            if (msg.tipo === 'sent') {
                const color = msg.leido ? '#01EEFF' : '#ffffff';
                statusHTML = `<span style="color: ${color}; font-size: 13px; margin-left: 4px; line-height: 1;">
                                ${msg.leido ? '✓✓' : '✓'}
                              </span>`;
            }

            div.innerHTML = `
                <div style="display: flex; flex-direction: column;">
                    <div class="msg-text">${msg.texto}</div>
                    <div class="msg-meta" style="display: flex; align-items: center; justify-content: flex-end; gap: 2px; margin-top: 2px;">
                        <small style="font-size: 10px; opacity: 0.8;">${msg.hora}</small>
                        ${statusHTML}
                    </div>
                </div>
            `;
            contenedor.appendChild(div);
        });
        contenedor.scrollTop = contenedor.scrollHeight;
    } catch (e) { console.error(e); }
}

// Manejo del Envío
// Manejar el envío del formulario
const formChat = document.getElementById('form-chat-paciente');
if (formChat) {
    formChat.onsubmit = async (e) => {
        e.preventDefault();
        const input = document.getElementById('input-mensaje-paciente');
        const receptorId = document.getElementById('receptor_id').value;
        const texto = input.value.trim();
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        if (!texto || !receptorId) return;

        const formData = new FormData();
        formData.append('contenido', texto);
        formData.append('receptor_id', receptorId);
        formData.append('csrfmiddlewaretoken', csrfToken);

        try {
            const response = await fetch('/enviar_mensaje_paciente/', {
                method: 'POST',
                body: formData,
                headers: { 'X-CSRFToken': csrfToken }
            });

            if (response.ok) {
                input.value = '';
                actualizarMensajesPaciente(); // Refresca las burbujas
            }
        } catch (error) {
            console.error("Error al enviar:", error);
        }
    };
}

// Actualización automática cada 3 segundos
setInterval(actualizarMensajesPaciente, 3000);

function toggleMenu() {
const sidebar=document.getElementById("sidebar");
const content=document.querySelector(".content");

sidebar.classList.toggle("active");
content.classList.toggle("mover");
}


/* =======================
   USUARIO
======================= */

const savedUser = JSON.parse(localStorage.getItem("user"));

if(savedUser){

if(document.getElementById("bienvenida")){
document.getElementById("bienvenida").innerText="Bienvenido "+savedUser.name;
}

if(document.getElementById("perfilNombre")){
document.getElementById("perfilNombre").value=savedUser.name;
}

if(document.getElementById("perfilEmail")){
document.getElementById("perfilEmail").value=savedUser.email;
}

}


/* =======================
   SECCIONES
======================= */

function showSection(id){

    document.querySelectorAll(".section").forEach(sec=>{
        sec.classList.remove("active");
    });

    const section=document.getElementById(id);

    if(section){
        section.classList.add("active");
    }

}


/* =======================
   CITAS
======================= */

function confirmarCita(){

const doctor=document.getElementById("doctor").value;
const fecha=document.getElementById("fecha").value;
const hora=document.getElementById("hora").value;
const tipo=document.getElementById("tipo").value;

if(!fecha || !hora){
alert("Selecciona fecha y hora");
return;
}

const cita={doctor,fecha,hora,tipo};

let citas=JSON.parse(localStorage.getItem("citas")) || [];

citas.push(cita);

localStorage.setItem("citas",JSON.stringify(citas));

mostrarCitas();
actualizarInicio();

}

function validarPaso1() {
    const select = document.getElementById('step-servicio');
    const option = select.options[select.selectedIndex];
    const container2 = document.getElementById('container-paso2');
    const labelGrupal = document.getElementById('label-grupal');
    const costoDiv = document.getElementById('costo-servicio');

    if (select.value) {
        // Mostrar Costo
        const precio = option.dataset.precio;
        costoDiv.innerHTML = `Costo del servicio: $${precio} MXN`;

        container2.classList.remove('disabled-step');
        labelGrupal.style.display = (option.dataset.grupal === 'true') ? 'inline-block' : 'none';
        document.getElementById('cantidad_personas').max = option.dataset.max;
        document.getElementById('container-paso3').classList.remove('disabled-step');
    } else {
        costoDiv.innerHTML = "";
    }
}

function validarPaso2() {
    const cantidad = document.getElementById('cantidad_personas').value;
    const servicioSelect = document.getElementById('step-servicio');
    const maxPermitido = servicioSelect.options[servicioSelect.selectedIndex].dataset.max;

    if (parseInt(cantidad) > parseInt(maxPermitido)) {
        alert(`El máximo de personas para este servicio es ${maxPermitido}`);
        document.getElementById('cantidad_personas').value = maxPermitido;
    }
    // Si todo está bien, podemos habilitar el siguiente paso
    document.getElementById('container-paso3').classList.remove('disabled-step');
}

function toggleCantidad(show) {
    document.getElementById('input-cantidad-container').style.display = show ? 'block' : 'none';
}

function activarPaso5() {
    document.getElementById('container-paso5').classList.remove('disabled-step');
}

function validarHoraEnPunto() {
    const horaInput = document.getElementById('step-hora');
    const valor = horaInput.value; // Ejemplo: "13:57"

    if (valor) {
        const minutos = valor.split(':')[1];
        if (minutos !== "00") {
            Swal.fire({
                icon: 'warning',
                title: 'Hora inválida',
                text: 'Por favor, selecciona una hora en punto (ejemplo: 10:00, 11:00).',
                confirmButtonColor: '#0FA3B1'
            });
            horaInput.value = ""; // Limpiar el campo
            return;
        }
        // Si es válida, buscar psicólogos
        limpiarYBuscar();
    }
}

function limpiarYBuscar() {
    const lista = document.getElementById('lista-psicologos');
    const fechaInput = document.getElementById('step-fecha');

    if (!fechaInput.value) return;

    const fecha = new Date(fechaInput.value + 'T00:00:00');
    const diaSemana = fecha.getDay();

    // Alerta con SweetAlert para fines de semana
    if (diaSemana === 0 || diaSemana === 6) {
        Swal.fire({
            icon: 'info',
            title: 'Día no laboral',
            text: 'Lo sentimos, no contamos con consultas disponibles los fines de semana.',
            confirmButtonColor: '#0FA3B1'
        });
        fechaInput.value = "";
        lista.innerHTML = '<p class="text-muted">Selecciona una fecha válida...</p>';
        return;
    }

    // Si ya hay hora seleccionada, buscamos
    const hora = document.getElementById('step-hora').value;
    if (hora) {
        lista.innerHTML = '<p class="text-muted">Buscando psicólogos disponibles...</p>';
        fetchPsicologosDisponibles();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const fechaInput = document.getElementById('step-fecha');

    // Calcular mañana
    const hoy = new Date();
    const mañana = new Date(hoy);
    mañana.setDate(hoy.getDate() + 1);

    // Calcular fecha límite (6 meses adelante)
    const limite = new Date(hoy);
    limite.setMonth(hoy.getMonth() + 6);

    // Formatear a YYYY-MM-DD
    const minStr = mañana.toISOString().split('T')[0];
    const maxStr = limite.toISOString().split('T')[0];

    fechaInput.min = minStr;
    fechaInput.max = maxStr;

    // Bloquear escritura manual para obligar a usar el calendario
    fechaInput.onkeydown = (e) => e.preventDefault();
});

// En la función fetchPsicologosDisponibles, asegúrate de enviar los datos correctos:
function fetchPsicologosDisponibles() {
    const servicioId = document.getElementById('step-servicio').value;
    const fecha = document.getElementById('step-fecha').value;
    const hora = document.getElementById('step-hora').value;

    if (!servicioId || !fecha || !hora) return;

    fetch(`/api/psicologos-disponibles/?servicio=${servicioId}&fecha=${fecha}&hora=${hora}`)
        .then(res => {
            if (!res.ok) throw new Error('Error en el servidor');
            return res.json();
        })
        .then(data => {
            const container = document.getElementById('lista-psicologos');
            container.innerHTML = "";
            
            if (data.length === 0) {
                container.innerHTML = '<p class="error-msg">No hay doctores disponibles en este horario.</p>';
                return;
            }

            data.forEach(psi => {
                container.innerHTML += `
                <label class="psi-card-option">
                    <input type="radio" name="psicologo_id" value="${psi.id}" required onclick="activarPaso5()">
                    <div class="psi-info">
                        <img src="${psi.foto}" alt="Psicól. ${psi.nombre}">
                        <span>Psicól. ${psi.nombre}</span>
                    </div>
                </label>`;
            });
        })
        .catch(err => {
            console.error(err);
            document.getElementById('lista-psicologos').innerHTML = '<p class="error-msg">Ocurrió un error al buscar psicólogos.</p>';
        });
}

function mostrarCitas(){

let citas=JSON.parse(localStorage.getItem("citas")) || [];

const lista=document.getElementById("listaCitas");

if(!lista) return;

lista.innerHTML="";

citas.forEach(cita=>{
lista.innerHTML+=`<div class="box">${cita.fecha} - ${cita.hora} - ${cita.doctor}</div>`;
});

}

function confirmarCancelacion(citaId) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer y la cita quedará como cancelada.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff4757', // Rojo para cancelar
        cancelButtonColor: '#adb5bd', // Gris para arrepentirse
        confirmButtonText: 'Sí, cancelar cita',
        cancelButtonText: 'No, mantenerla',
        reverseButtons: true, // Pone el botón de "No" a la izquierda
        background: '#fff',
        backdrop: `rgba(0,0,0,0.4)`
    }).then((result) => {
        if (result.isConfirmed) {
            // Buscamos el formulario específico y lo enviamos
            document.getElementById(`form-cancelar-${citaId}`).submit();
        }
    })
}

function filtrarCitas() {
    const fechaSeleccionada = document.getElementById('filtroFecha').value;
    const filas = document.querySelectorAll('.cita-row');

    filas.forEach(fila => {
        const fechaCita = fila.getAttribute('data-fecha');
        if (!fechaSeleccionada || fechaCita === fechaSeleccionada) {
            fila.style.display = "";
        } else {
            fila.style.display = "none";
        }
    });
}

function filtrarPorEstado(estado, btn) {
    // Cambiar clase activa en botones
    document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filas = document.querySelectorAll('.cita-row');
    filas.forEach(fila => {
        const estadoCita = fila.getAttribute('data-estado');
        if (estado === 'Todas' || estadoCita === estado) {
            fila.style.display = "";
        } else {
            fila.style.display = "none";
        }
    });
}


/* =======================
   MENSAJES
======================= */

async function enviarMensaje() {
    // Intentamos obtener el ID del input según el HTML que tengas
    const input = document.getElementById("mensajeTexto") || document.getElementById("input-mensaje");
    const texto = input.value;

    if (texto.trim() == "") return;

    // Si existe 'contenedor-mensajes', estamos en el panel de psicólogo
    const contenedorMsg = document.getElementById('contenedor-mensajes');
    if (contenedorMsg && contenedorMsg.dataset.pacienteId) {
        const pacienteId = contenedorMsg.dataset.pacienteId;
        const formData = new FormData();
        formData.append('usuario_id', pacienteId);
        formData.append('contenido', texto);
        formData.append('csrfmiddlewaretoken', document.querySelector('[name=csrfmiddlewaretoken]').value);

        try {
            const response = await fetch('/enviar_mensaje_chat/', { method: 'POST', body: formData });
            if (response.ok) {
                input.value = "";
                actualizarMensajes(pacienteId); // Función nueva para refrescar chat
            }
        } catch (e) { console.error("Error al enviar:", e); }
    } else {
        // Lógica original de localStorage para el paciente (opcional mantenerla)
        let mensajes = JSON.parse(localStorage.getItem("mensajes")) || [];
        mensajes.push(texto);
        localStorage.setItem("mensajes", JSON.stringify(mensajes));
        input.value = "";
        cargarMensajes();
        actualizarInicio();
    }
}


function cargarMensajes(){

let mensajes=JSON.parse(localStorage.getItem("mensajes")) || [];

const lista=document.getElementById("listaMensajes");

if(!lista) return;

lista.innerHTML="";

mensajes.forEach(msg=>{
lista.innerHTML+=`<div class="box">${msg}</div>`;
});

}

function filtrarPsicologos() {
    const input = document.getElementById('buscarPsicologo');
    const filtro = input.value.toLowerCase();
    const lista = document.getElementById('lista-psicologos-chat');
    const items = lista.getElementsByClassName('chat-item');

    for (let i = 0; i < items.length; i++) {
        const nombre = items[i].querySelector('.chat-name').innerText.toLowerCase();
        if (nombre.includes(filtro)) {
            items[i].style.display = "flex";
        } else {
            items[i].style.display = "none";
        }
    }
}


/* =======================
   PANEL INICIO
======================= */

function actualizarInicio(){

let citas=JSON.parse(localStorage.getItem("citas")) || [];
let mensajes=JSON.parse(localStorage.getItem("mensajes")) || [];

if(citas.length>0 && document.getElementById("proximaCita")){
document.getElementById("proximaCita").innerText=citas[citas.length-1].fecha;
}

if(document.getElementById("sesiones")){
document.getElementById("sesiones").innerText=citas.length;
}

if(document.getElementById("contadorMensajes")){
document.getElementById("contadorMensajes").innerText=mensajes.length;
}

}


/* =======================
   FOTO PERFIL
======================= */

function subirFotoPerfil() {
    const input = document.getElementById('input-foto');
    if (input.files && input.files[0]) {
        // Opcional: Mostrar una alerta de "Cargando..."
        document.getElementById('form-cambiar-foto').submit();
    }
}


/* =======================
   PERFIL
======================= */

function guardarCambios(){

const nombre=document.getElementById("perfilNombre").value;
const email=document.getElementById("perfilEmail").value;

const nuevo={name:nombre,email:email};

localStorage.setItem("user",JSON.stringify(nuevo));

alert("Perfil actualizado");

}

function abrirModalEditar() {
    document.getElementById('modalPerfil').style.display = 'flex';
}

function cerrarModalPerfil() {
    document.getElementById('modalPerfil').style.display = 'none';
}

// Cerrar si el usuario hace clic fuera del contenido blanco
window.onclick = function (event) {
    let modal = document.getElementById('modalPerfil');
    if (event.target == modal) {
        cerrarModalPerfil();
    }
}


/* =======================
   MODAL
======================= */

function openModal(){
document.getElementById("logoutModal").classList.add("active");
}

function closeModal(){
document.getElementById("logoutModal").classList.remove("active");
}


/* =======================
   CERRAR SESION
======================= */

function cerrarSesion(){

localStorage.removeItem("user");
localStorage.removeItem("citas");
localStorage.removeItem("mensajes");

window.location.href = "/";   // redirige al login

}

/* =======================
   LIMPIAR DATOS
======================= */

function limpiarDatos(){

localStorage.clear();

alert("Datos eliminados");

window.location.href="/";

}


/* =======================
   CARGA INICIAL
======================= */
if (document.getElementById("listaCitas")) mostrarCitas();
if (document.getElementById("listaMensajes")) cargarMensajes();
if (document.getElementById("bienvenida")) actualizarInicio();

// Nueva carga para psicólogo
if (document.getElementById("lista-usuarios-chat")) {
    cargarListaPacientes();
    // Auto-refresco de mensajes cada 5 segundos
    setInterval(() => {
        const pId = document.getElementById('contenedor-mensajes')?.dataset.pacienteId;
        if(pId) actualizarMensajes(pId);
    }, 5000);
}

/* =======================
   FUNCIONES ESPECÍFICAS PSICÓLOGO
======================= */

async function cargarListaPacientes() {
    const listaUl = document.getElementById('lista-usuarios-chat');
    if (!listaUl) return;

    const response = await fetch('/api_lista_usuarios_chat/');
    const usuarios = await response.json();
    listaUl.innerHTML = '';
    usuarios.forEach(user => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${user.nombre}</span>`;
        li.onclick = () => seleccionarChat(user.id, user.nombre);
        listaUl.appendChild(li);
    });
}

async function seleccionarChat(pacienteId, nombre) {
    const header = document.getElementById('chat-header-nombre');
    const contenedor = document.getElementById('contenedor-mensajes');
    if(header) header.textContent = `Chat con ${nombre}`;
    if(contenedor) {
        contenedor.dataset.pacienteId = pacienteId;
        actualizarMensajes(pacienteId);
    }
}

async function actualizarMensajes(pacienteId) {
    const contenedor = document.getElementById('contenedor-mensajes');
    if(!contenedor) return;
    const response = await fetch(`/obtener_mensajes/${pacienteId}/`);
    const mensajes = await response.json();
    contenedor.innerHTML = '';
    mensajes.forEach(msg => {
        const div = document.createElement('div');
        div.className = `message ${msg.tipo}`;
        div.innerHTML = `<p>${msg.texto}</p><small>${msg.hora}</small>`;
        contenedor.appendChild(div);
    });
    contenedor.scrollTop = contenedor.scrollHeight;
}

async function actualizarTelefonoPsicologo() {
    const tel = document.querySelector('input[placeholder="Teléfono"]').value;
    const formData = new FormData();
    formData.append('id', PROFESIONAL_ID); // PROFESIONAL_ID debe venir del HTML
    formData.append('telefono', tel);
    formData.append('csrfmiddlewaretoken', document.querySelector('[name=csrfmiddlewaretoken]').value);

    const response = await fetch('/editar_admin/', { method: 'POST', body: formData });
    const data = await response.json();
    if(data.success) alert("Teléfono actualizado");
}

/* =======================
   ATENDER CITAS
======================= */

function abrirModalConsulta(citaId, pacienteNombre) {
    // Usamos prompts sencillos por ahora para capturar la info
    const notas = prompt(`Notas médicas para la sesión de: ${pacienteNombre}`);
    if (notas === null) return; // Cancelado

    const diagnostico = prompt(`Diagnóstico clínico para: ${pacienteNombre}`);
    if (diagnostico === null) return; // Cancelado

    if (notas.trim() === "" || diagnostico.trim() === "") {
        alert("Ambos campos son obligatorios para cerrar la sesión.");
        return;
    }

    registrarConsulta(citaId, notas, diagnostico);
}

async function registrarConsulta(citaId, notas, diagnostico) {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const formData = new FormData();
    formData.append('cita_id', citaId);
    formData.append('notas', notas);
    formData.append('diagnostico', diagnostico);
    formData.append('csrfmiddlewaretoken', csrfToken);

    try {
        const response = await fetch('/registrar_consulta_api/', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        if (data.success) {
            alert("¡Consulta registrada y cita finalizada con éxito!");
            location.reload(); // Recargamos para que desaparezca de "Citas hoy"
        } else {
            alert("Error al guardar: " + data.error);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}