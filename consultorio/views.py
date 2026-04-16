from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from zoneinfo import ZoneInfo
import datetime  
from datetime import date, timedelta
from datetime import datetime as dt
from django.db import transaction
from django.contrib.auth import logout
from django.contrib.auth import authenticate, login as auth_login
from .models import Usuario, TipoUsuario, Paciente, Telefono, EdoCuenta, Sesion, Pago, Especialidad, Horario, Psicologo, HorPsicologo, Conversacion, Mensaje, ConvUsuario, Cita, Modalidad, EdoCita, Servicio, Consulta
from django.contrib.auth.hashers import make_password
from django.contrib import messages
from django.db.models import Q, Count
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
from django.http import JsonResponse
from django.contrib.auth import get_user_model
import locale
try:
    locale.setlocale(locale.LC_TIME, 'es_ES.UTF-8') # O 'es_ES' según tu server
except:
    pass
User = get_user_model()

# Create your views here.
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

def guardar_especialidad(request):
    if request.method == 'POST':
        try:
            clave = request.POST.get('clave')
            nombre = request.POST.get('nombre')
            descripcion = request.POST.get('descripcion')
            activo = request.POST.get('activo') == 'true'

            if clave: # Actualizar existente
                esp = Especialidad.objects.get(clave=clave)
                esp.nombre = nombre
                esp.descripcion = descripcion
                esp.activo = activo
                esp.save()
            else: # Crear nueva
                Especialidad.objects.create(
                    nombre=nombre,
                    descripcion=descripcion,
                    activo=activo
                )
            
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    
    return JsonResponse({'success': False, 'error': 'Método no permitido'})

@csrf_exempt # O usa el decorador de permisos que tengas
@require_POST
def eliminar_especialidad(request):
    try:
        clave = request.POST.get('clave')
        if clave:
            especialidad = Especialidad.objects.get(clave=clave)
            especialidad.delete()
            return JsonResponse({'success': True})
        return JsonResponse({'success': False, 'error': 'No se proporcionó la clave'})
    except Especialidad.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Especialidad no encontrada'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

def esp(request):
    return render(request, 'panel_psicologo')


#Psicologos
@transaction.atomic
def crear_o_editar_psicologo(request):
    if request.method == 'POST':
        try:
            # 1. CAPTURA DE CAMPOS
            psi_id = request.POST.get('id')
            nombre = request.POST.get('nombre')
            ape1 = request.POST.get('apellido1')
            ape2 = request.POST.get('apellido2', '')
            genero = request.POST.get('genero')
            contrasena = request.POST.get('contrasena')
            estado_nombre = request.POST.get('estado_cuenta') 
            cedula = request.POST.get('cedula')
            correo = request.POST.get('correo')
            tel = request.POST.get('telefono')
            esp_id = request.POST.get('especialidad_id')
            hor_id = request.POST.get('horario_id')
            foto = request.FILES.get('foto')

            # 2. CATALOGOS (Ajustado a tus modelos: EdoCuenta y TipoUsuario)
            tipo_psi, _ = TipoUsuario.objects.get_or_create(nombre='Psicólogo')
            
            if not estado_nombre:
                estado_nombre = 'Activo'
            # Asegúrate de que el modelo se llame EdoCuenta como pusiste arriba
            estado_obj = get_object_or_404(EdoCuenta, nombre=estado_nombre)

            # 3. PROCESAR USUARIO
            if psi_id and psi_id.strip():
                # Buscamos por 'numero' que es tu llave primaria
                usuario = get_object_or_404(Usuario, numero=psi_id)
                usuario.estadoCuenta = estado_obj
                
                # Solo actualizamos contraseña si el usuario escribió algo nuevo
                if contrasena and contrasena.strip() and contrasena != '••••••••':
                    usuario.password = make_password(contrasena) # Django usa 'password' por defecto
            else:
                # CREAR NUEVO
                usuario = Usuario(tipoUsuario=tipo_psi, estadoCuenta=estado_obj)
                usuario.password = make_password(contrasena)

            usuario.nombrePila = nombre
            usuario.primerApellido = ape1
            usuario.segundoApellido = ape2
            usuario.genero = genero
            usuario.correo = correo # Asegúrate que USERNAME_FIELD sea correo
            
            if foto:
                usuario.fotoPerfil = foto
            
            usuario.save()

            # 4. PROCESAR TABLAS RELACIONADAS
            # Teléfono
            Telefono.objects.update_or_create(usuario=usuario, defaults={'numTel': tel})
            
            # Psicólogo (Datos específicos)
            esp_obj = get_object_or_404(Especialidad, clave=esp_id)
            psicologo, _ = Psicologo.objects.update_or_create(
                usuario=usuario,
                defaults={'cedula': cedula, 'especialidad': esp_obj}
            )

            # Horario
            if hor_id:
                hor_obj = get_object_or_404(Horario, numero=hor_id)
                HorPsicologo.objects.filter(psicologo=psicologo).delete()
                HorPsicologo.objects.create(psicologo=psicologo, horario=hor_obj)

            return JsonResponse({'success': True})

        except Exception as e:
            # Imprime el error en la terminal para que puedas verlo mientras programas
            import traceback
            print(traceback.format_exc())
            return JsonResponse({'success': False, 'error': str(e)})

def lista_psicologos(request):
    # Capturar filtros del frontend
    search_query = request.GET.get('q', '')
    especialidad_id = request.GET.get('especialidad', '')
    solo_activos = request.GET.get('activos', 'false') == 'true'

    psicologos = Psicologo.objects.all()

    # Filtro por nombre o apellidos
    if search_query:
        psicologos = psicologos.filter(
            Q(usuario__nombrePila__icontains=search_query) | 
            Q(usuario__primerApellido__icontains=search_query)
        )

    # Filtro por especialidad
    if especialidad_id:
        psicologos = psicologos.filter(especialidad_id=especialidad_id)

    # Filtro por estado de cuenta
    if solo_activos:
        psicologos = psicologos.filter(usuario__estadoCuenta__nombre='Activo')

    # ... retornar a tu template ...

@transaction.atomic
def dar_de_baja_psicologo(request, id):
    if request.method == 'POST':
        try:
            # Buscamos al psicólogo cuyo USUARIO tenga ese ID
            psicologo = get_object_or_404(Psicologo, usuario__numero=id)
            
            estado_inactivo, _ = EdoCuenta.objects.get_or_create(
                nombre='Inactivo',
                defaults={'descripcion': 'Cuenta sin acceso al sistema'}
            )
            
            usuario = psicologo.usuario
            usuario.estadoCuenta = estado_inactivo
            usuario.save()
            
            return JsonResponse({
                'success': True, 
                'message': f'El psicólogo {usuario.nombrePila} ha sido dado de baja.'
            })
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
    return JsonResponse({'success': False, 'error': 'Método no permitido'}, status=405)
    

@login_required
def obtener_mensajes(request, usuario_id):
    try:
        # 1. Buscamos la conversación donde participan AMBOS (el logueado y el seleccionado)
        # Esto evita que los mensajes se mezclen con otros chats
        convs_usuario_actual = ConvUsuario.objects.filter(usuario=request.user).values_list('conversacion', flat=True)
        relacion = ConvUsuario.objects.filter(
            conversacion__in=convs_usuario_actual, 
            usuario_id=usuario_id
        ).first()
        
        if not relacion:
            return JsonResponse([], safe=False)

        # 2. Traemos los mensajes de esa conversación específica
        mensajes_qs = Mensaje.objects.filter(
            conversacion=relacion.conversacion
        ).select_related('usuario').order_by('fechaEnvio')
        
        tz_tijuana = ZoneInfo("America/Tijuana")
        mensajes_list = []
        
        for m in mensajes_qs:
            # Comparamos PKs para evitar conflictos entre 'id' y 'numero'
            es_mio = (m.usuario.pk == request.user.pk)
            hora_local = m.fechaEnvio.astimezone(tz_tijuana)
            
            mensajes_list.append({
                'texto': m.contenido,
                'hora': hora_local.strftime('%I:%M %p'),
                'tipo': 'sent' if es_mio else 'received'
            })
            
        return JsonResponse(mensajes_list, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500, safe=False)

def enviar_mensaje_chat(request):
    if request.method == 'POST':
        usuario_id = request.POST.get('usuario_id') # El ID del paciente/destinatario
        contenido = request.POST.get('contenido')
        
        try:
            # 1. Buscamos la conversación compartida entre los dos
            convs_usuario_actual = ConvUsuario.objects.filter(usuario=request.user).values_list('conversacion', flat=True)
            relacion = ConvUsuario.objects.filter(
                conversacion__in=convs_usuario_actual, 
                usuario_id=usuario_id
            ).first()

            # 2. Si no existe conversación entre ellos, la creamos (importante para el primer mensaje)
            if not relacion:
                nueva_conv = Conversacion.objects.create(fechaInicio=timezone.now())
                ConvUsuario.objects.create(conversacion=nueva_conv, usuario=request.user)
                ConvUsuario.objects.create(conversacion=nueva_conv, usuario_id=usuario_id)
                target_conv = nueva_conv
            else:
                target_conv = relacion.conversacion

            # 3. Guardamos el mensaje
            Mensaje.objects.create(
                conversacion=target_conv,
                usuario=request.user,
                contenido=contenido,
                fechaEnvio=timezone.now()
            )
            return JsonResponse({'status': 'ok'})
            
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'error'}, status=400)

def api_lista_usuarios_chat(request):
    usuarios_qs = Usuario.objects.exclude(tipoUsuario__nombre='Administrador')
    data = []
    ahora = timezone.now()

    for u in usuarios_qs:
        # Buscamos el último mensaje enviado o recibido por este usuario
        ultimo_msg = Mensaje.objects.filter(
            conversacion__convusuario__usuario=u
        ).order_by('-fechaEnvio').first()

        tiempo_txt = ""
        if ultimo_msg:
            diff = ahora - ultimo_msg.fechaEnvio
            if diff.days > 0:
                tiempo_txt = f"{diff.days}d"
            elif diff.seconds >= 3600:
                tiempo_txt = f"{diff.seconds // 3600}h"
            elif diff.seconds >= 60:
                tiempo_txt = f"{diff.seconds // 60}m"
            else:
                tiempo_txt = "ahora"

        data.append({
            'id': u.numero,
            'nombre': f"{u.nombrePila} {u.primerApellido}",
            'avatar': u.fotoPerfil.url if u.fotoPerfil else "/media/perfiles/default.png",
            'ultimo_tiempo': tiempo_txt
        })
    return JsonResponse(data, safe=False)

def cuenta(request):
    return render(request, 'psicologos/psicologo.html')

def agendas(request):
    return render(request, 'psicologos/psicologo.html')

#Admin
@login_required
def api_dashboard_stats(request):
    try:
        # 1. Conteos básicos
        # CAMBIO: Usamos 'estadoCuenta__nombre' (o el campo que corresponda a 'Activo')
        # Si 'estadoCuenta' es un campo directo de texto, quita el __nombre
        psis_activos = Usuario.objects.filter(
            tipoUsuario__nombre='Psicólogo', 
            estadoCuenta__nombre='Activo' 
        ).count()
        
        admins_total = Usuario.objects.filter(tipoUsuario__nombre='Administrador').count()
        pacientes_total = Usuario.objects.filter(tipoUsuario__nombre='Paciente').count()
        especialidades_total = Especialidad.objects.count()
        
        # 2. Reportes (Mensajes que no son del staff)
        reportes_pendientes = Mensaje.objects.exclude(
            usuario__tipoUsuario__nombre='Administrador'
        ).count()

        # 3. Actividades (Últimos 5 mensajes)
        actividades_qs = Mensaje.objects.select_related('usuario').order_by('-fechaEnvio')[:5]
        actividades = []
        
        ahora = timezone.now()
        for m in actividades_qs:
            diff = ahora - m.fechaEnvio
            if diff.days > 0: tiempo = f"hace {diff.days}d"
            elif diff.seconds >= 3600: tiempo = f"hace {diff.seconds // 3600}h"
            elif diff.seconds >= 60: tiempo = f"hace {diff.seconds // 60}m"
            else: tiempo = "ahora"

            actividades.append({
                "titulo": f"{m.usuario.nombrePila} {m.usuario.primerApellido}",
                "descripcion": m.contenido[:40] + "..." if len(m.contenido) > 40 else m.contenido,
                "tiempo": tiempo,
                "avatar": m.usuario.fotoPerfil.url if m.usuario.fotoPerfil else None
            })

        return JsonResponse({
            "status": "success",
            "stats": {
                "psis_activos": psis_activos,
                "admins_total": admins_total,
                "pacientes_total": pacientes_total,
                "reportes_pendientes": reportes_pendientes,
                "especialidades_total": especialidades_total
            },
            "actividades": actividades
        })

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return JsonResponse({"status": "error", "message": str(e)}, status=500)

@login_required
def admin(request):
    usuario_id = request.session.get('usuario_id')
    if not usuario_id:
        return redirect('/login')
        
    try:
        # 1. Usuario logeado
        usuario_actual = request.user
        
        # --- FILTROS PARA PSICÓLOGOS ---
        search_query = request.GET.get('q', '')
        especialidad_id = request.GET.get('especialidad', '')
        solo_activos = request.GET.get('activos') == 'on'

        # 2. Lista de Administradores (Se mantiene igual)
        admins_list = []
        admins_qs = Usuario.objects.filter(tipoUsuario__nombre='Administrador').select_related('tipoUsuario', 'estadoCuenta')
        for adm in admins_qs:
            tel_obj = Telefono.objects.filter(usuario=adm).first()
            admins_list.append({
                'numero': adm.numero,
                'nombrePila': adm.nombrePila,
                'primerApellido': adm.primerApellido,
                'segundoApellido': adm.segundoApellido or "",
                'correo': adm.correo,
                'telefono': tel_obj.numTel if tel_obj else "",
                'rol_nombre': adm.tipoUsuario.nombre,
                'estado_cuenta_nombre': adm.estadoCuenta.nombre if adm.estadoCuenta else "Inactivo",
                'foto_url': adm.fotoPerfil.url if adm.fotoPerfil else '/static/img/default.png',
            })

        # 3. Lista de Psicólogos con FILTROS y DATOS COMPLETOS
        psicologos_list = []
        psicologos_qs = Psicologo.objects.select_related('usuario', 'especialidad', 'usuario__estadoCuenta').all()

        # Aplicación de filtros de Django
        if search_query:
            psicologos_qs = psicologos_qs.filter(
                Q(usuario__nombrePila__icontains=search_query) | 
                Q(usuario__primerApellido__icontains=search_query) |
                Q(cedula__icontains=search_query)
            )
        if especialidad_id:
            psicologos_qs = psicologos_qs.filter(especialidad_id=especialidad_id)
        if solo_activos:
            psicologos_qs = psicologos_qs.filter(usuario__estadoCuenta__nombre='Activo')

        for p in psicologos_qs:
            tel_obj = Telefono.objects.filter(usuario=p.usuario).first()
            relacion_horario = HorPsicologo.objects.filter(psicologo=p).select_related('horario').first()
            
            psicologos_list.append({
                'id': p.usuario.numero,
                'nombre': f"{p.usuario.nombrePila} {p.usuario.primerApellido} {p.usuario.segundoApellido or ''}".strip(),
                'email': p.usuario.correo,
                'telefono': tel_obj.numTel if tel_obj else "",
                'genero': p.usuario.genero, # <--- IMPORTANTE para el modal
                'cedula': p.cedula,         # <--- IMPORTANTE para el modal
                'estado_cuenta': p.usuario.estadoCuenta.nombre if p.usuario.estadoCuenta else "Inactivo",
                'especialidad': p.especialidad.nombre,
                'especialidad_clave': p.especialidad.clave,
                'horario_id': relacion_horario.horario.numero if relacion_horario else None,
                'dias': relacion_horario.horario.dias if relacion_horario else "Sin asignar",
                'horario': relacion_horario.horario.horas if relacion_horario else "--:--",
                'avatar': p.usuario.fotoPerfil.url if p.usuario.fotoPerfil else '/static/img/default.png',
            })

        # 4. Lista de Especialidades (Simplificada)
        especialidades_list = list(Especialidad.objects.values('clave', 'nombre', 'descripcion', 'activo'))
        
        # 5. Lista de Horarios (Simplificada)
        horarios_list = list(Horario.objects.values('numero', 'nombre', 'dias', 'horas', 'icono', 'activo'))

        contexto = {
            'usuario': usuario_actual,
            'todos_los_administradores_json': admins_list,
            'psicologos_json': psicologos_list,
            'especialidades_json': especialidades_list,
            'horarios_json': horarios_list
        }

        return render(request, 'admin/admin.html', contexto)

    except Usuario.DoesNotExist:
        return redirect('/login')

@csrf_exempt
def crear_admin(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            # 1. Validaciones (Correo y Teléfono)
            if Usuario.objects.filter(correo=data['correo']).exists():
                return JsonResponse({'error': 'El correo ya está registrado'}, status=400)
            
            # 2. Obtener catálogos necesarios
            tipo_admin, _ = TipoUsuario.objects.get_or_create(nombre='Administrador')
            # BUSCAMOS EL ESTADO ACTIVO (Si no existe, se crea)
            estado_activo, _ = EdoCuenta.objects.get_or_create(nombre='Activo')

            # 3. Crear el Usuario con el estado 'Activo'
            nuevo_usuario = Usuario.objects.create(
                nombrePila=data['nombre'],
                primerApellido=data['primer_apellido'],
                segundoApellido=data.get('segundo_apellido', ''),
                genero=data['genero'],
                correo=data['correo'],
                password=make_password(data['password']),
                tipoUsuario=tipo_admin,
                estadoCuenta=estado_activo  # <--- ASIGNAMOS EL ESTADO AQUÍ
            )

            # 4. Crear Teléfono
            if data.get('telefono'):
                Telefono.objects.create(
                    numTel=data['telefono'],
                    usuario=nuevo_usuario
                )

            return JsonResponse({'success': 'Administrador creado y activo'})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def editar_admin(request):
    if request.method == 'POST':
        try:
            admin_id = request.POST.get('id')
            usuario = Usuario.objects.get(numero=admin_id)
            
            # 1. Actualizar Datos Básicos
            usuario.nombrePila = request.POST.get('nombre')
            usuario.primerApellido = request.POST.get('primer_apellido')
            usuario.segundoApellido = request.POST.get('segundo_apellido')
            usuario.correo = request.POST.get('correo')
            
            # 2. Actualizar Foto si viene
            if 'foto' in request.FILES:
                usuario.fotoPerfil = request.FILES['foto']
            
            # 3. Actualizar Password si no está vacío
            password = request.POST.get('password')
            if password and password.strip():
                usuario.password = make_password(password)
            
            # 4. Actualizar Estado de Cuenta
            estado_nombre = request.POST.get('estado') # 'Activo' o 'Inactivo'
            if estado_nombre:
                estado_obj = EdoCuenta.objects.get(nombre=estado_nombre)
                usuario.estadoCuenta = estado_obj
            
            usuario.save()

            # 5. Actualizar Teléfono
            tel_num = request.POST.get('telefono')
            if tel_num:
                tel_obj, _ = Telefono.objects.get_or_create(usuario=usuario)
                tel_obj.numTel = tel_num
                tel_obj.save()

            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt 
def desactivar_admin(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            admin_id = data.get('id')
            
            # 1. Buscamos al usuario por su número (el ID en tu tabla Usuario)
            usuario = Usuario.objects.get(numero=admin_id)
            
            # Evitar que el admin se desactive a sí mismo (Opcional pero recomendado)
            if request.user.is_authenticated and request.user.numero == int(admin_id):
                return JsonResponse({'error': 'No puedes desactivar tu propia cuenta mientras estás logueado.'}, status=400)
            
            # 2. Buscamos o creamos el objeto del estado "Inactivo"
            estado_inactivo, _ = EdoCuenta.objects.get_or_create(
                nombre='Inactivo',
                defaults={'descripcion': 'Cuenta sin acceso al sistema'}
            )
            
            # 3. Asignamos el estado y guardamos
            usuario.estadoCuenta = estado_inactivo
            usuario.save()
            
            return JsonResponse({'success': True})

        except Usuario.DoesNotExist:
            return JsonResponse({'error': 'El administrador no existe.'}, status=404)
        except Exception as e:
            print(f"Error en desactivar_admin: {e}")
            return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def guardar_horario(request):
    if request.method == 'POST':
        try:
            numero = request.POST.get('numero')
            nombre = request.POST.get('nombre')
            icono = request.POST.get('icono')
            dias = request.POST.get('dias')
            horas = request.POST.get('horas')
            activo = request.POST.get('activo') == 'true'

            if numero: # Editar
                h = Horario.objects.get(numero=numero)
                h.nombre = nombre
                h.icono = icono
                h.dias = dias
                h.horas = horas
                h.activo = activo
                h.save()
            else: # Crear
                Horario.objects.create(
                    nombre=nombre,
                    icono=icono,
                    dias=dias,
                    horas=horas,
                    activo=activo
                )
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

def tu_vista_admin(request):

    # 1. Traemos los datos de la base de datos
    horarios_qs = Horario.objects.all()
    
    # 2. Convertimos a lista de diccionarios (muy importante)
    horarios_list = list(horarios_qs.values('numero', 'nombre', 'dias', 'horas', 'icono', 'activo'))
    
    context = {
        'horarios_json': horarios_list, # Enviamos la lista al HTML
        # ... tus otros datos ...
    }
    return render(request, 'admin.html', context)

#flutter
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def api_login(request):
    if request.method == 'POST':
        # Flutter envía JSON, así que lo leemos así:
        try:
            data = json.loads(request.body)
            correo_login = data.get('correo')
            password_login = data.get('password')
        except:
            # Si mandas los datos como Form Data en lugar de JSON
            correo_login = request.POST.get('correo')
            password_login = request.POST.get('password')

        user = authenticate(request, username=correo_login, password=password_login)

        if user is not None:
            estado = getattr(user.estadoCuenta, 'nombre', user.estadoCuenta)
            
            if str(estado).lower() != 'activo':
                return JsonResponse({'error': 'Cuenta inactiva'}, status=403)

            # En lugar de auth_login (que es para sesiones de navegador), 
            # simplemente devolvemos los datos del usuario.
            return JsonResponse({
                'token': 'session_token_temporal', # Aquí luego pondremos un JWT real
                'user': {
                    'numero': user.numero,
                    'nombrePila': user.nombrePila,
                    'primerApellido': user.primerApellido,
                    'segundoApellido': user.segundoApellido,
                    'correo': user.correo,
                    'tipoUsuario': user.tipoUsuario_id,
                    'genero': user.genero,
                }
            }, status=200)
        else:
            return JsonResponse({'error': 'Credenciales inválidas'}, status=401)
            
    return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt
def api_registro_paciente(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Validación rápida de campos obligatorios
            if not data.get('fecha_nacimiento'):
                return JsonResponse({'error': 'La fecha de nacimiento es obligatoria'}, status=400)

            with transaction.atomic():
                # 1. Obtenemos las llaves foráneas necesarias
                # Asegúrate de que los nombres coincidan exactamente con tu BD
                tipo_paciente = TipoUsuario.objects.get(clave=1)
                estado_activo = EdoCuenta.objects.get(nombre__icontains='Activo') 
                
                # 2. Crear el Usuario
                usuario = Usuario.objects.create(
                    nombrePila=data.get('nombre'),
                    primerApellido=data.get('primer_apellido'),
                    segundoApellido=data.get('segundo_apellido', ''),
                    genero=data.get('genero'),
                    correo=data.get('correo'),
                    password=make_password(data.get('password')),
                    tipoUsuario=tipo_paciente,
                    estadoCuenta=estado_activo
                )

                # 3. Crear el registro de Paciente con la FECHA
                Paciente.objects.create(
                    usuario=usuario,
                    fechaNacimiento=data.get('fecha_nacimiento') # Formato YYYY-MM-DD
                )

                # 4. Crear el Teléfono
                telefono_data = data.get('telefono')
                if telefono_data:
                    Telefono.objects.create(
                        numTel=telefono_data,
                        usuario=usuario
                    )

            return JsonResponse({
                'status': 'success',
                'message': 'Registro exitoso y cuenta activa'
            }, status=201)

        except TipoUsuario.DoesNotExist:
            return JsonResponse({'error': 'Error de configuración: Tipo de usuario no encontrado'}, status=500)
        except EdoCuenta.DoesNotExist:
            return JsonResponse({'error': 'Error de configuración: Estado de cuenta "Activo" no encontrado'}, status=500)
        except Exception as e:
            # Imprime el error en la consola de Django para debuguear mejor
            print(f"Error en registro: {e}")
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt
@require_POST
@login_required
def registrar_consulta_api(request):
    try:
        cita_id = request.POST.get('cita_id')
        notas = request.POST.get('notas')
        diagnostico = request.POST.get('diagnostico')
        
        # 1. Buscamos la cita
        from .models import Cita, Consulta, EdoCita
        cita = get_object_or_404(Cita, numero=cita_id)
        
        # 2. Creamos el registro de la Consulta
        Consulta.objects.create(
            cita=cita,
            notas=notas,
            diagnostico=diagnostico
        )
        
        # 3. Cambiamos el estado de la cita a 'Finalizada'
        # Asegúrate de que el nombre 'Finalizada' exista en tu tabla EdoCita
        estado_fin, _ = EdoCita.objects.get_or_create(nombre='Finalizada')
        cita.estado = estado_fin
        cita.save()
        
        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

@api_view(['GET'])
def api_lista_pacientes_detallada(request):
    pacientes = Paciente.objects.all()
    data = []
    for p in pacientes:
        # Intentamos obtener la URL, si no, mandamos un string vacío 
        # para que el 'onerror' del JS entre en acción
        try:
            foto_path = p.foto.url if p.foto else '/media/perfiles/default.png'
        except:
            foto_path = '/media/perfiles/default.png'

        data.append({
            "id": p.usuario.numero,
            "nombre": f"{p.usuario.nombrePila} {p.usuario.primerApellido}",
            "correo": p.usuario.correo,
            "telefono": getattr(p, 'telefono', 'Sin teléfono'),
            "genero": getattr(p, 'genero', 'No especificado'),
            "edad": getattr(p, 'edad', 'N/A'),
            "foto": foto_path 
        })
    return Response(data)

def obtener_o_crear_conversacion(user1, user2_id):
    # Buscamos una conversación donde participen exactamente ambos usuarios
    conversaciones_user1 = ConvUsuario.objects.filter(usuario=user1).values_list('conversacion', flat=True)
    
    # Buscamos si el usuario2 está en alguna de esas conversaciones
    conv_comun = ConvUsuario.objects.filter(
        conversacion__in=conversaciones_user1, 
        usuario_id=user2_id
    ).first()

    if conv_comun:
        return conv_comun.conversacion
    else:
        # Si no existe, la creamos
        nueva_conv = Conversacion.objects.create(fechaInicio=timezone.now())
        ConvUsuario.objects.create(conversacion=nueva_conv, usuario=user1)
        ConvUsuario.objects.create(conversacion=nueva_conv, usuario_id=user2_id)
        return nueva_conv

def guardar_consulta(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # 1. Obtener la Cita (Usando 'numero' como PK según tu esquema)
            cita = Cita.objects.get(numero=data['cita_id'])
            
            # 2. Actualizar estado de la cita
            # IMPORTANTE: Asegúrate de que el nombre 'Atendida' coincida con tu DB
            nuevo_estado = EdoCita.objects.filter(nombre__icontains='Atendida').first()
            if nuevo_estado:
                cita.estado = nuevo_estado
                cita.save()

            # 3. Crear Consulta (según tu imagen: numero, notas, diagnostico, cita_id)
            # Dejamos que 'numero' se autogenere (AutoField)
            nueva_consulta = Consulta.objects.create(
                notas=data['notas'],
                diagnostico=data['diagnostico'],
                cita=cita # Django vincula cita_id automáticamente
            )

            # 4. Crear Sesión (según tu imagen: numero, numSesion, observaciones, consulta_id)
            conteo_previo = Sesion.objects.filter(consulta__cita__paciente=cita.paciente).count()
            Sesion.objects.create(
                numSesion=conteo_previo + 1,
                observaciones=data['observaciones'],
                consulta=nueva_consulta # Django vincula consulta_id automáticamente
            )

            # 5. Crear Pago (según tu imagen: codigo, fecha, hora, monto, consulta_id)
            Pago.objects.create(
                fecha=timezone.now().date(),
                hora=timezone.now().time(),
                monto=data['monto'],
                consulta=nueva_consulta
            )

            return JsonResponse({'status': 'ok'})

        except Exception as e:
            # Esto imprimirá el error exacto en tu consola de Python
            print("ERROR DETECTADO:", str(e)) 
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

    return JsonResponse({'status': 'error', 'message': 'Solo POST'}, status=405)
#PANEL PSICÓLOGOS

@login_required
def panel_psicologos(request):
    try:
        psicologo = Psicologo.objects.get(usuario=request.user)
    except Psicologo.DoesNotExist:
        messages.error(request, "No tienes perfil de psicólogo asignado.")
        return redirect('/')

    hoy = timezone.now().date()
    
    # --- ESTADÍSTICAS ---
    citas_hoy_count = Cita.objects.filter(psicologo=psicologo, fecha=hoy).count()
    pacientes_activos = Paciente.objects.filter(cita__psicologo=psicologo).distinct().count()
    
    # --- LÓGICA DE PACIENTES PARA EL CHAT ---
    # Obtenemos los IDs de los pacientes que tienen citas con este psicólogo
    pacientes_ids = Cita.objects.filter(psicologo=psicologo).values_list('paciente_id', flat=True).distinct()
    mis_pacientes = Paciente.objects.filter(numero__in=pacientes_ids).select_related('usuario')

    # IDs de conversaciones donde participa el psicólogo
    mis_conv_ids = list(ConvUsuario.objects.filter(usuario=request.user).values_list('conversacion_id', flat=True))

    for pac in mis_pacientes:
        # Buscamos la conversación común entre el psicólogo y este paciente
        relacion = ConvUsuario.objects.filter(
            conversacion_id__in=mis_conv_ids, 
            usuario_id=pac.usuario.numero # El usuario vinculado al paciente
        ).first()
        
        if relacion:
            ultimo_msg = Mensaje.objects.filter(conversacion=relacion.conversacion).order_by('-fechaEnvio').first()
            if ultimo_msg:
                pac.ultimo_texto = ultimo_msg.contenido
                pac.ultima_hora = ultimo_msg.fechaEnvio
                pac.yo_lo_envie = (ultimo_msg.usuario == request.user)
                pac.sin_leer = (not ultimo_msg.leido and ultimo_msg.usuario != request.user)
            else:
                pac.ultimo_texto = "Sin mensajes"
        else:
            pac.ultimo_texto = "Sin chat iniciado"

    # --- HISTORIALES ---
    citas_pendientes = Cita.objects.filter(psicologo=psicologo, estado__nombre='Pendiente').order_by('fecha', 'hora')
    todas_las_citas = Cita.objects.filter(psicologo=psicologo).order_by('-fecha')
    consultas_historial = Consulta.objects.filter(cita__psicologo=psicologo).select_related('cita', 'cita__paciente__usuario').order_by('-cita__fecha')
    pagos_historial = Pago.objects.filter(consulta__cita__psicologo=psicologo).order_by('-fecha', '-hora')
    
    telefono_obj = Telefono.objects.filter(usuario=request.user).first()

    contexto = {
        'psicologo': psicologo,
        'citas_hoy': citas_hoy_count,
        'pacientes_activos': pacientes_activos,
        'citas': citas_pendientes,
        'agendas': todas_las_citas,
        'consultas': consultas_historial,
        'pagos': pagos_historial,
        'mis_pacientes': mis_pacientes,
        'telefono': telefono_obj.numTel if telefono_obj else "",
    }
    return render(request, 'psicologos/psicologo.html', contexto)

# Reutilizamos la misma lógica de mensajes pero para el psicólogo
@login_required
def obtener_mensajes_psicologo(request):
    paciente_user_id = request.GET.get('paciente_id') 
    if not paciente_user_id:
        return JsonResponse([], safe=False)

    # 1. Buscamos la conversación que comparten el paciente y el psicólogo
    # Primero obtenemos todas las conversaciones del paciente actual
    mis_convs = ConvUsuario.objects.filter(usuario=request.user).values_list('conversacion_id', flat=True)
    
    # Buscamos si en alguna de esas conversaciones también está el psicólogo
    relacion_comun = ConvUsuario.objects.filter(
        conversacion_id__in=mis_convs, 
        usuario_id=paciente_user_id
    ).first()

    if not relacion_comun:
        return JsonResponse([], safe=False)

    # 2. Obtenemos los mensajes usando el campo 'conversacion' y ordenamos por 'fechaEnvio'
    mensajes_queryset = Mensaje.objects.filter(
        conversacion=relacion_comun.conversacion
    ).order_by('fechaEnvio')

    # 3. Marcar mensajes del psicólogo como leídos
    Mensaje.objects.filter(
        conversacion=relacion_comun.conversacion,
        leido=False
    ).exclude(usuario=request.user).update(leido=True)
    
    data = []
    for m in mensajes_queryset:
        hora_local = timezone.localtime(m.fechaEnvio)
        data.append({
            'texto': m.contenido,
            'tipo': 'sent' if m.usuario == request.user else 'received',
            'hora': hora_local.strftime('%I:%M %p'),
            'fecha_completa': hora_local.strftime('%Y-%m-%d'), # Formato para comparar: 2026-04-15
            'dia_str': hora_local.strftime('%d de %B, %Y'), # Formato legible
            'leido': m.leido
        })
        
    return JsonResponse(data, safe=False)

#PANEL PACIENTES

@login_required
def paciente(request):
    # 1. Obtener instancia del paciente
    paciente_instancia = get_object_or_404(Paciente, usuario=request.user)
    ahora = timezone.now()

    # --- LÓGICA PARA EL DASHBOARD ---
    
    # 1. Próxima cita (la más cercana a partir de ahora, que esté Pendiente)
    proxima_cita = Cita.objects.filter(
        paciente=paciente_instancia,
        estado__nombre='Pendiente',
        fecha__gte=ahora.date()
    ).order_by('fecha', 'hora').first()

    # 2. Siguientes 3 citas (después de la proxima_cita)
    siguientes_citas = []
    if proxima_cita:
        siguientes_citas = Cita.objects.filter(
            paciente=paciente_instancia,
            estado__nombre='Pendiente'
        ).exclude(numero=proxima_cita.numero).order_by('fecha', 'hora')[:3]
    
    # 3. Sesiones Realizadas (Citas con estado 'Atendida' o 'Completada')
    # Ajusta el nombre del estado según tu base de datos
    conteo_atendidas = Cita.objects.filter(
        paciente=paciente_instancia, 
        estado_id=2 
    ).count()

    ultimos_mensajes = []

    mis_convs = ConvUsuario.objects.filter(usuario=request.user).values_list('conversacion_id', flat=True)
    ultimos_mensajes = Mensaje.objects.filter(
        conversacion_id__in=mis_convs
    ).exclude(usuario=request.user).select_related('usuario').order_by('-fechaEnvio')[:3]
    
    # --- PROCESAMIENTO DE FORMULARIOS (POST) ---
    if request.method == 'POST':
        action = request.POST.get('action')
        
        # A. AGENDAR CITA
        if action == 'agendar_cita':
            # PRIMERO: Obtenemos los datos del formulario
            psi_id = request.POST.get('psicologo_id')
            fecha = request.POST.get('fecha')
            hora = request.POST.get('hora')
            mod_nombre = request.POST.get('modalidad_nombre')

            # SEGUNDO: Validaciones de fecha
            try:
                fecha_cita = datetime.datetime.strptime(fecha, "%Y-%m-%d").date()
                hoy = date.today()

                if fecha_cita <= hoy:
                    messages.error(request, "La cita debe ser programada al menos con un día de anticipación.")
                    return redirect('/paciente/')

                if fecha_cita > hoy + timedelta(days=180):
                    messages.error(request, "No puedes agendar citas con más de 6 meses de anticipación.")
                    return redirect('/paciente/')
            except (ValueError, TypeError):
                messages.error(request, "Fecha inválida.")
                return redirect('/paciente/')

            # TERCERO: Lógica de creación (el resto de tu código)
            psicologo = get_object_or_404(Psicologo, numero=psi_id)
            modalidad, _ = Modalidad.objects.get_or_create(nombre=mod_nombre or 'Virtual')
            estado_pend, _ = EdoCita.objects.get_or_create(nombre='Pendiente')
            motivo_escrito = request.POST.get('motivo', 'Consulta')
            # Buscamos el servicio específico que seleccionó el usuario
            servicio_id = request.POST.get('servicio_id')
            servicio = get_object_or_404(Servicio, clave=servicio_id)

            Cita.objects.create(
                fecha=fecha, 
                hora=hora, 
                motivo=motivo_escrito,
                psicologo=psicologo, 
                paciente=paciente_instancia,
                servicio=servicio, 
                modalidad=modalidad, 
                estado=estado_pend
            )
            messages.success(request, "¡Cita agendada correctamente!")
            return redirect('/paciente/') # Siempre haz redirect tras un POST exitoso
        elif action == 'cancelar_cita':
            cita_id = request.POST.get('cita_id')
            # Buscamos la cita asegurándonos de que pertenezca al paciente actual
            cita_a_cancelar = get_object_or_404(Cita, numero=cita_id, paciente=paciente_instancia)
            
            # Obtenemos o creamos el estado 'Cancelada'
            estado_cancelada, _ = EdoCita.objects.get_or_create(nombre='Cancelada')
            
            # Actualizamos la cita
            cita_a_cancelar.estado = estado_cancelada
            cita_a_cancelar.save()
            
            messages.info(request, "La cita ha sido cancelada.")
        # B. ACTUALIZAR PERFIL
        elif action == 'actualizar_perfil':
            nuevo_correo = request.POST.get('nuevo_correo')
            nuevo_tel = request.POST.get('nuevo_telefono')
            nueva_pass = request.POST.get('nueva_contrasena')

            # 1. Actualizar correo en el objeto Usuario
            request.user.correo = nuevo_correo
            
            # 2. Si hay nueva contraseña, encriptarla antes de guardar
            if nueva_pass and len(nueva_pass.strip()) > 0:
                request.user.set_password(nueva_pass)
                # Importante: al cambiar contraseña la sesión puede cerrarse
                # Necesitas: from django.contrib.auth import update_session_auth_hash
                from django.contrib.auth import update_session_auth_hash
                update_session_auth_hash(request, request.user)

            request.user.save()

            # 3. Actualizar teléfono en la tabla Telefono
            telefono_obj, _ = Telefono.objects.get_or_create(usuario=request.user)
            telefono_obj.numTel = nuevo_tel
            telefono_obj.save()

            messages.success(request, "Tus datos se han actualizado correctamente.")
            return redirect('/paciente/')
        elif action == 'cambiar_foto':
            nueva_foto = request.FILES.get('nueva_foto')
            if nueva_foto:
                # 1. Eliminar la foto anterior físicamente (opcional pero recomendado para no llenar el server)
                if request.user.fotoPerfil and request.user.fotoPerfil.name != 'default.png':
                    request.user.fotoPerfil.delete(save=False)
                    
                # 2. Asignar la nueva y guardar
                request.user.fotoPerfil = nueva_foto
                request.user.save()
                messages.success(request, "¡Tu foto de perfil ha sido actualizada!")
            else:
                messages.error(request, "No se seleccionó ninguna imagen.")
            return redirect('/paciente/')

    # --- CARGA DE DATOS PARA LA INTERFAZ ---
    citas_queryset = Cita.objects.filter(paciente=paciente_instancia).order_by('-fecha')
    ids_psis = citas_queryset.values_list('psicologo__usuario_id', flat=True).distinct()
    mis_psicologos_chat = Psicologo.objects.filter(usuario_id__in=ids_psis).select_related('usuario')

    for psi in mis_psicologos_chat:
        # Buscamos la conversación común
        mis_convs = ConvUsuario.objects.filter(usuario=request.user).values_list('conversacion_id', flat=True)
        relacion = ConvUsuario.objects.filter(conversacion_id__in=mis_convs, usuario_id=psi.usuario.numero).first()
        
        if relacion:
            ultimo_msg = Mensaje.objects.filter(conversacion=relacion.conversacion).order_by('-fechaEnvio').first()
            if ultimo_msg:
                # Añadimos atributos dinámicos para el HTML
                psi.ultimo_texto = ultimo_msg.contenido
                psi.ultima_hora = ultimo_msg.fechaEnvio
                psi.yo_lo_envie = (ultimo_msg.usuario == request.user)
                # Solo está "no leído" si el último mensaje lo envió el OTRO y leido es False
                psi.sin_leer = (not ultimo_msg.leido and ultimo_msg.usuario != request.user)
        else:
            psi.ultimo_texto = "Sin mensajes aún"
            psi.sin_leer = False
    
    hoy = date.today()
    nacimiento = paciente_instancia.fechaNacimiento
    edad = hoy.year - nacimiento.year - ((hoy.month, hoy.day) < (nacimiento.month, nacimiento.day))

    # Obtener teléfono (asumiendo que puede tener varios, tomamos el primero)
    telefono_obj = Telefono.objects.filter(usuario=request.user).first()
    telefono = telefono_obj.numTel if telefono_obj else "No registrado"

    contexto = {
        'proxima_cita': proxima_cita,
        'siguientes_citas': siguientes_citas,
        'conteo_sesiones': conteo_atendidas,
        'ultimos_mensajes': ultimos_mensajes,
        'psicologos': Psicologo.objects.all(), # Para el modal de agendar
        'servicios': Servicio.objects.filter(especialidad__isnull=False), # Asegúrate de enviar esto
        'mis_psicologos': mis_psicologos_chat, # Para la lista de mensajes
        'citas': citas_queryset,
        'proxima_cita': citas_queryset.filter(fecha__gte=timezone.now().date()).last(),
        'user': request.user,
        'paciente': paciente_instancia,
        'edad': edad,
        'telefono': telefono,
        'user': request.user,
    }
    
    return render(request, 'paciente/paciente.html', contexto)

@login_required
def obtener_mensajes_paciente(request):
    psicologo_user_id = request.GET.get('psicologo_id')
    if not psicologo_user_id:
        return JsonResponse([], safe=False)

    # 1. Buscamos la conversación que comparten el paciente y el psicólogo
    # Primero obtenemos todas las conversaciones del paciente actual
    mis_convs = ConvUsuario.objects.filter(usuario=request.user).values_list('conversacion_id', flat=True)
    
    # Buscamos si en alguna de esas conversaciones también está el psicólogo
    relacion_comun = ConvUsuario.objects.filter(
        conversacion_id__in=mis_convs, 
        usuario_id=psicologo_user_id
    ).first()

    if not relacion_comun:
        return JsonResponse([], safe=False)

    # 2. Obtenemos los mensajes usando el campo 'conversacion' y ordenamos por 'fechaEnvio'
    mensajes_queryset = Mensaje.objects.filter(
        conversacion=relacion_comun.conversacion
    ).order_by('fechaEnvio')

    # 3. Marcar mensajes del psicólogo como leídos
    Mensaje.objects.filter(
        conversacion=relacion_comun.conversacion,
        leido=False
    ).exclude(usuario=request.user).update(leido=True)
    
    data = []
    for m in mensajes_queryset:
        hora_local = timezone.localtime(m.fechaEnvio)
        data.append({
            'texto': m.contenido,
            'tipo': 'sent' if m.usuario == request.user else 'received',
            'hora': hora_local.strftime('%I:%M %p'),
            'fecha_completa': hora_local.strftime('%Y-%m-%d'), # Formato para comparar: 2026-04-15
            'dia_str': hora_local.strftime('%d de %B, %Y'), # Formato legible
            'leido': m.leido
        })
        
    return JsonResponse(data, safe=False)

@login_required
def enviar_mensaje_paciente(request):
    if request.method == 'POST':
        receptor_id = request.POST.get('receptor_id')
        contenido = request.POST.get('contenido')

        if not receptor_id or not contenido:
            return JsonResponse({'status': 'error'}, status=400)

        # 1. Verificar si ya existe la conversación o crearla
        mis_convs = ConvUsuario.objects.filter(usuario=request.user).values_list('conversacion_id', flat=True)
        relacion = ConvUsuario.objects.filter(
            conversacion_id__in=mis_convs, 
            usuario_id=receptor_id
        ).first()

        if relacion:
            conversacion_obj = relacion.conversacion
        else:
            conversacion_obj = Conversacion.objects.create(fechaInicio=timezone.now())
            ConvUsuario.objects.create(conversacion=conversacion_obj, usuario=request.user)
            psicologo_user = get_object_or_404(Usuario, numero=receptor_id)
            ConvUsuario.objects.create(conversacion=conversacion_obj, usuario=psicologo_user)

        # 2. Crear el mensaje (SOLO UNA VEZ)
        nuevo_msg = Mensaje.objects.create(
            contenido=contenido,
            fechaEnvio=timezone.now(),
            conversacion=conversacion_obj,
            usuario=request.user
        )

        # Devolvemos los datos del UNICO mensaje creado
        return JsonResponse({
            'status': 'ok',
            'contenido': nuevo_msg.contenido,
            'hora': timezone.localtime(nuevo_msg.fechaEnvio).strftime('%I:%M %p')
        })
    return JsonResponse({'status': 'error'}, status=400)

def api_psicologos_disponibles(request):
    try:
        servicio_id = request.GET.get('servicio')
        hora_str = request.GET.get('hora')
        fecha_str = request.GET.get('fecha')

        if not all([servicio_id, hora_str, fecha_str]):
            return JsonResponse([], safe=False)

        hora_input = dt.strptime(hora_str, "%H:%M").time()
        fecha_obj = dt.strptime(fecha_str, "%Y-%m-%d")
        
        # 1. Obtener psicólogos que YA tienen cita a esa hora y fecha
        # Excluimos las que están 'Cancelada' para que el psicólogo vuelva a estar libre
        psicologos_ocupados_ids = Cita.objects.filter(
            fecha=fecha_obj.date(),
            hora=hora_input
        ).exclude(estado__nombre='Cancelada').values_list('psicologo_id', flat=True)

        # 2. Obtener el servicio y los psicólogos de esa especialidad
        servicio = get_object_or_404(Servicio, clave=servicio_id)
        
        # 3. Filtramos: que sean de la especialidad Y NO estén en la lista de ocupados
        psicologos = Psicologo.objects.filter(
            especialidad=servicio.especialidad
        ).exclude(
            numero__in=psicologos_ocupados_ids # Excluir ocupados
        ).select_related('usuario')
        
        dias_map = {0: 'Lunes', 1: 'Martes', 2: 'Miércoles', 3: 'Jueves', 4: 'Viernes', 5: 'Sábado', 6: 'Domingo'}
        nombre_dia_selec = dias_map[fecha_obj.weekday()]

        disponibles = []

        for psi in psicologos:
            turnos = HorPsicologo.objects.filter(psicologo=psi).select_related('horario')
            for t in turnos:
                if not t.horario or nombre_dia_selec not in t.horario.dias:
                    continue

                try:
                    rango = t.horario.horas.strip()
                    partes = rango.split(' - ')
                    inicio = dt.strptime(partes[0].strip(), "%H:%M").time()
                    fin = dt.strptime(partes[1].strip(), "%H:%M").time()

                    if inicio <= hora_input < fin: 
                        foto_url = "/static/img/default-avatar.png" 
                        if psi.usuario and psi.usuario.fotoPerfil:
                            foto_url = psi.usuario.fotoPerfil.url
                        
                        disponibles.append({
                            "id": psi.numero,
                            "nombre": psi.usuario.nombrePila if psi.usuario else "Psicólogo",
                            "foto": foto_url
                        })
                        break
                except:
                    continue

        return JsonResponse(disponibles, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)