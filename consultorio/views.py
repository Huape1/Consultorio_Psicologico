from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from .models import Usuario, TipoUsuario, Paciente, Telefono
from django.contrib.auth.hashers import make_password, check_password
from django.contrib import messages
from django.core.mail import send_mail

# Create your views here.
def index(request):
    return render(request, 'index.html')

def login(request):
    if request.method == 'GET':
        return render(request, 'login.html')

    correo = request.POST.get('email')
    password = request.POST.get('password')

    try:
        usuario = Usuario.objects.get(correo=correo)

        # 🔐 Verificar contraseña
        if check_password(password, usuario.contrasena):

            # ✅ Guardar sesión
            request.session['usuario_id'] = usuario.numero
            request.session['nombre'] = usuario.nombrePila

            # 🔀 Redirigir según tipo
            if usuario.tipoUsuario.clave == 1:  # paciente
                return redirect('/paciente')

            elif usuario.tipoUsuario.clave == 2:  # psicologo
                return redirect('/panel')

            elif usuario.tipoUsuario.clave == 3:  # admin
                return redirect('/admin')

        else:
            messages.error(request, 'Contraseña incorrecta')
            return redirect('/login')

    except Usuario.DoesNotExist:
        messages.error(request, 'El correo no existe')
        return redirect('/login')

def registro(request):
    if request.method == 'GET':
        return render(request, 'registro.html')

    else:
        password = request.POST.get('contraseña')
        confirm_password = request.POST.get('confirmar_contraseña')

        if password != confirm_password:
            messages.error(request, 'Las contraseñas no coinciden')
            return redirect('/registro')
        
        if Usuario.objects.filter(correo=request.POST.get('correo')).exists():
                messages.error(request, 'El correo ya está registrado')
                return redirect('/registro')
                
        if Telefono.objects.filter(numero=request.POST.get('telefono')).exists():
                messages.error(request, 'El número de teléfono ya está registrado')
                return redirect('/registro')

        try:
            tipo_usuario = TipoUsuario.objects.get(clave=1)  # paciente
            
            # 🔹 1. Crear usuario
            usuario = Usuario.objects.create(
                nombrePila=request.POST.get('nombre'),
                primerApellido=request.POST.get('primer_apellido'),
                segundoApellido=request.POST.get('segundo_apellido'),
                genero=request.POST.get('genero'),
                correo=request.POST.get('correo'),
                contrasena=make_password(password),
                tipoUsuario=tipo_usuario
            )

            # 🔹 2. Crear paciente (usando ese usuario)
            Paciente.objects.create(
                fechaNacimiento=request.POST.get('fechaNacimiento'),
                usuario=usuario
            )

            Telefono.objects.create(
                numTel=request.POST.get('telefono'),
                usuario=usuario
            )

            messages.success(request, 'Registro exitoso, ahora puedes iniciar sesión')
            return redirect('/login')

        except Exception as e:
            print(e)
            messages.error(request, 'Ocurrió un error al registrarse')
            return redirect('/registro')

def especialidades(request):
    return render(request, 'especialidades.html')

def esp(request):
    return render(request, 'esp.html')

#Pacientes
def paciente(request):
    return render(request, 'paciente/paciente.html')

#Psicologos
def panel(request):
    return render(request, 'psicologos/PANEL.html')

def mensajes(request):
    return render(request, 'psicologos/mensajes.html')

def cuenta(request):
    return render(request, 'psicologos/cuenta.html')

def agendas(request):
    return render(request, 'psicologos/agendas.html')

#Admin
def admin(request):
    return render(request, 'admin/admin.html')

#Inicio2
def login2(request):
    return render(request, 'login2.html')

def registro2(request):
    return render(request, 'registro2.html')