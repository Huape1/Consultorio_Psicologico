from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.contrib.auth import authenticate, login as auth_login
from ..models import Usuario, TipoUsuario, Paciente, Telefono
from django.contrib.auth.hashers import make_password
from django.contrib import messages


def index(request):
    return render(request, 'index.html')

def login(request):
    if request.method == 'POST':
        correo_login = request.POST.get('correo')
        password_login = request.POST.get('password')

        # 1. Autenticamos
        user = authenticate(request, username=correo_login, password=password_login)

        if user is not None:
            # 2. VALIDACIÓN DE CUENTA ACTIVA
            # Verificamos si el estadoCuenta NO es 'Activo'
            # (Ajusta 'nombre' si estadoCuenta es una FK o quítalo si es CharField)
            estado = getattr(user.estadoCuenta, 'nombre', user.estadoCuenta)
            
            if str(estado).lower() != 'activo':
                messages.error(request, "Tu cuenta está inactiva. Contacta al administrador.")
                return render(request, 'login.html')

            # 3. Si está activa, logueamos
            auth_login(request, user)
            request.session['usuario_id'] = user.numero 
            
            # 4. Redirección por tipo
            tipo = user.tipoUsuario_id

            if tipo == 1:
                return redirect('paciente')
            elif tipo == 2:
                return redirect('/panel_psicologos/')
            elif tipo == 3:
                return redirect('admin')
            else:
                return redirect('/')
        else:
            # 5. Si authenticate falló
            messages.error(request, "Credenciales inválidas. Revisa tu correo y contraseña.")
            # Tip: Revisa en tu terminal si el usuario existe: 
            # print(Usuario.objects.filter(correo=correo_login).exists())
    
    return render(request, 'login.html')

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
                password=make_password(password),
                fotoPerfil=request.FILES.get('foto_perfil'),
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

@login_required
def cerrar_sesion(request):
    logout(request)
    return redirect('/')

def especialidades(request):
    return render(request, 'especialidades.html')