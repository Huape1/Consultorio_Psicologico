function toggleMenu(){
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


function mostrarCitas(){

let citas=JSON.parse(localStorage.getItem("citas")) || [];

const lista=document.getElementById("listaCitas");

if(!lista) return;

lista.innerHTML="";

citas.forEach(cita=>{
lista.innerHTML+=`<div class="box">${cita.fecha} - ${cita.hora} - ${cita.doctor}</div>`;
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

function mostrarImagen(event){

const archivo=event.target.files[0];

if(!archivo) return;

const reader=new FileReader();

reader.onload=function(e){

const preview=document.getElementById("preview");

if(preview){
preview.src=e.target.result;
}

localStorage.setItem("fotoPerfil",e.target.result);

}

reader.readAsDataURL(archivo);

}


const foto=localStorage.getItem("fotoPerfil");

if(foto && document.getElementById("preview")){
document.getElementById("preview").src=foto;
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