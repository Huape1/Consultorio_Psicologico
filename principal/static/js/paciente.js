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

function enviarMensaje(){

const texto=document.getElementById("mensajeTexto").value;

if(texto.trim()=="") return;

let mensajes=JSON.parse(localStorage.getItem("mensajes")) || [];

mensajes.push(texto);

localStorage.setItem("mensajes",JSON.stringify(mensajes));

document.getElementById("mensajeTexto").value="";

cargarMensajes();
actualizarInicio();

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

mostrarCitas();
cargarMensajes();
actualizarInicio();

