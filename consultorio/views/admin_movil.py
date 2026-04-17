import datetime  
from django.db import transaction
from ..models import Usuario, TipoUsuario, Paciente, Telefono, EdoCuenta, Especialidad, Horario, Psicologo, Mensaje, Cita
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
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

#Panel pirncipal
@csrf_exempt
def api_admin_stats(request):
    # 1. Conteos
    stats = {
        'activePsychologists': Psicologo.objects.count(),
        'registeredPatients': Paciente.objects.count(),
        'pendingMessages': Mensaje.objects.filter(leido=False).count(),
        'todayAppointments': Cita.objects.filter(fecha=datetime.date.today()).count(),
    }
    
    # 2. Últimos 3 mensajes
    mensajes = Mensaje.objects.select_related('usuario').order_by('-fechaEnvio')[:3]
    stats['recentMessages'] = [{
        'user': f"{m.usuario.nombrePila} {m.usuario.primerApellido}",
        'content': m.contenido,
        'timestamp': m.fechaEnvio.strftime('%H:%M'),
        'isHigh': not m.leido # Marcamos como "importante" si no se ha leído
    } for m in mensajes]
    
    # 3. Lista de Administradores (Rol 3)
    admins = Usuario.objects.filter(tipoUsuario__clave=3)
    stats['adminList'] = [{
        'fullName': f"{a.nombrePila} {a.primerApellido}",
        'role': 'Administrador del Sistema',
        'status': 'online' if a.is_active else 'offline'
    } for a in admins]

    return JsonResponse(stats)
    
def api_ultimos_mensajes(request):
    # Traemos los últimos 5 mensajes con info del usuario que los envió
    mensajes = Mensaje.objects.select_related('usuario').order_by('-fechaEnvio')[:5]
    data = [{
        'user': f"{m.usuario.nombrePila} {m.usuario.primerApellido}",
        'content': m.contenido,
        'timestamp': m.fechaEnvio.strftime('%H:%M'), # Solo hora para el dashboard
        'isRead': m.leido
    } for m in mensajes]
    return JsonResponse(data, safe=False)

#Panel psicólogos

def api_get_psychologists(request):
    try:
        usuarios_psicologos = Usuario.objects.filter(tipoUsuario__clave=2)
        data = []
        for u in usuarios_psicologos:
            info_psicologo = Psicologo.objects.filter(usuario=u).first()
            tel_obj = Telefono.objects.filter(usuario=u).first()
            
            # Construir URL de la imagen
            foto_url = None
            if u.fotoPerfil:
                foto_url = request.build_absolute_uri(u.fotoPerfil.url)
            
            data.append({
                "id": u.numero,
                "fullName": f"{u.nombrePila} {u.primerApellido} {u.segundoApellido}",
                "email": u.correo,
                "photo": foto_url, # <--- Nueva clave con la URL
                "specialty": info_psicologo.especialidad.nombre if info_psicologo else "General",
                "phone": tel_obj.numTel if tel_obj else "Sin teléfono",
                "license": info_psicologo.cedula if info_psicologo else "N/A",
            })
            
        return JsonResponse(data, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
@transaction.atomic
def api_create_psychologist(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        
        # 1. Crear Usuario con la password del formulario
        nuevo_usuario = Usuario.objects.create_user(
            correo=data['email'],
            password=data['password'], # Usamos la password enviada
            nombrePila=data['nombre'],
            primerApellido=data['apellido1'],
            segundoApellido=data.get('apellido2', ''),
            genero=data['genero'],
            tipoUsuario=TipoUsuario.objects.get(clave=2),
            estadoCuenta=EdoCuenta.objects.get(nombre="Activo")
        )

        # 2. Crear Teléfono (según tu modelo Telefono)
        Telefono.objects.create(
            numTel=data['telefono'],
            usuario=nuevo_usuario
        )

        # 3. Crear Perfil de Psicólogo
        Psicologo.objects.create(
            usuario=nuevo_usuario,
            cedula=data['cedula'],
            especialidad_id=data['especialidad_id']
        )

        return JsonResponse({"status": "ok"})

def api_get_specialties(request):
    especialidades = Especialidad.objects.filter(activo=True)
    data = [{"clave": e.clave, "nombre": e.nombre} for e in especialidades]
    return JsonResponse(data, safe=False)

@csrf_exempt
@transaction.atomic
def api_update_psychologist(request, pk):
    if request.method == 'POST': # O PUT si tu ApiService lo soporta
        try:
            data = json.loads(request.body)
            usuario = Usuario.objects.get(numero=pk)
            
            # 1. Actualizar Usuario
            usuario.nombrePila = data['nombre']
            usuario.primerApellido = data['apellido1']
            usuario.segundoApellido = data['apellido2']
            usuario.correo = data['email']
            usuario.genero = data['genero']
            if data.get('password'): # Solo si se envió una nueva
                usuario.set_password(data['password'])
            usuario.save()

            # 2. Actualizar Teléfono
            tel_obj = Telefono.objects.filter(usuario=usuario).first()
            if tel_obj:
                tel_obj.numTel = data['telefono']
                tel_obj.save()
            else:
                Telefono.objects.create(numTel=data['telefono'], usuario=usuario)

            # 3. Actualizar Perfil Psicólogo
            psico_profile = Psicologo.objects.get(usuario=usuario)
            psico_profile.cedula = data['cedula']
            psico_profile.especialidad_id = data['especialidad_id']
            psico_profile.save()

            return JsonResponse({"message": "Actualizado con éxito"})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

#Panel Horarios
def api_get_schedules(request):
    try:
        # Obtenemos todos los horarios de la base de datos
        horarios = Horario.objects.all().order_by('numero')
        
        data = []
        for h in horarios:
            data.append({
                "id": h.numero,        # Usamos 'numero' porque es tu PK
                "name": h.nombre,
                "days": h.dias,
                "hours": h.horas,
                "icon": h.icono,
                "status": "Activo" if h.activo else "Inactivo"
            })
            
        # Importante: safe=False permite enviar una LISTA en lugar de un OBJETO
        return JsonResponse(data, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def api_manage_schedule(request, pk=None):
    if request.method == 'POST':
        data = json.loads(request.body)
        if pk: # EDITAR
            h = Horario.objects.get(numero=pk)
        else: # CREAR
            h = Horario()
        
        h.nombre = data['name']
        h.dias = data['days']
        h.horas = data['hours']
        h.icono = data.get('icon', 'sun')
        h.activo = data.get('status') == "Activo"
        h.save()
        
        return JsonResponse({"status": "ok"})
    
#Panel adminstradores
def api_get_admins(request):
    # Filtramos por tipoUsuario clave 3 (Administradores)
    admins = Usuario.objects.filter(tipoUsuario__clave=3).order_by('numero')
    
    data = []
    for a in admins:
        foto_url = request.build_absolute_uri(a.fotoPerfil.url) if a.fotoPerfil else None
        data.append({
            "id": a.numero,
            "nombre": a.nombrePila,
            "apellido1": a.primerApellido,
            "apellido2": a.segundoApellido,
            "fullName": f"{a.nombrePila} {a.primerApellido} {a.segundoApellido}",
            "email": a.correo,
            "genero": a.genero,
            "phone": Telefono.objects.filter(usuario=a).first().numTel if Telefono.objects.filter(usuario=a).exists() else "",
            "photo": foto_url,
            "status": a.estadoCuenta.nombre if a.estadoCuenta else "Inactivo"
        })
    return JsonResponse(data, safe=False)

@csrf_exempt
@transaction.atomic
def api_manage_admin(request, pk=None):
    if request.method == 'POST':
        data = json.loads(request.body)
        
        # Si pk es 0 o None, creamos uno nuevo
        if pk and pk != 0:
            user = Usuario.objects.get(numero=pk)
        else:
            # IMPORTANTE: Cambiado a clave 3 para coincidir con tu filtro de lista
            user = Usuario(tipoUsuario=TipoUsuario.objects.get(clave=3))
        
        user.nombrePila = data['nombre']
        user.primerApellido = data['apellido1']
        user.segundoApellido = data.get('apellido2', '')
        user.correo = data['email']
        user.genero = data['genero']
        
        if data.get('status'):
            # Buscamos el objeto EdoCuenta por nombre
            estado = EdoCuenta.objects.filter(nombre=data['status']).first()
            if estado:
                user.estadoCuenta = estado
        
        if data.get('password') and data['password'].strip() != "":
            user.set_password(data['password'])
        
        user.save()

        if data.get('telefono'):
            Telefono.objects.update_or_create(
                usuario=user,
                defaults={'numTel': data['telefono']}
            )
        
        return JsonResponse({"status": "ok"})
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    user = request.user
    # Intentamos obtener el teléfono si existe
    tel = Telefono.objects.filter(usuario=user).first()
    
    return Response({
        "full_name": f"{user.nombrePila} {user.primerApellido} {user.segundoApellido}",
        "email": user.correo,
        "phone": tel.numTel if tel else "",
        "photo": request.build_absolute_uri(user.fotoPerfil.url) if user.fotoPerfil else None,
        "role": user.tipoUsuario.nombre if user.tipoUsuario else "Administrador"
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    user = request.user
    data = request.data
    
    # Actualizar nombre (ejemplo simple, puedes separar nombre de apellidos)
    if 'full_name' in data:
        nombres = data['full_name'].split(' ')
        user.nombrePila = nombres[0]
        if len(nombres) > 1:
            user.primerApellido = nombres[1]
        user.save()
        
    # Actualizar teléfono
    if 'phone' in data:
        Telefono.objects.update_or_create(
            usuario=user, 
            defaults={'numTel': data['phone']}
        )
        
    return Response({"message": "Perfil actualizado"})
