import datetime  
from django.utils import timezone
from django.core.files.storage import default_storage
from django.db import transaction
from ..models import Usuario, TipoUsuario, Paciente, Telefono, EdoCuenta, Especialidad, Horario, Psicologo, Mensaje, Cita, Conversacion, ConvUsuario
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
    # 1. Validar usuario de forma segura para evitar el error de AnonymousUser
    user = request.user
    admin_name = "Admin"
    admin_photo = None

    if not user.is_anonymous:
        admin_name = user.nombrePila if hasattr(user, 'nombrePila') else user.username
        if user.fotoPerfil:
            admin_photo = request.build_absolute_uri(user.fotoPerfil.url)

    # 2. Conteos básicos
    stats = {
        'activePsychologists': Psicologo.objects.count(),
        'registeredPatients': Paciente.objects.count(),
        'pendingMessages': Mensaje.objects.filter(leido=False).count(),
        'todayAppointments': Cita.objects.filter(fecha=datetime.date.today()).count(),
        'currentAdminName': admin_name,
        'currentAdminPhoto': admin_photo,
    }
    
    # 3. Últimos 3 mensajes (CORREGIDO: order_by)
    # Usamos order_by para ordenar por fecha de envío descendente
    mensajes = Mensaje.objects.select_related('usuario').order_by('-fechaEnvio')[:3]
    
    stats['recentMessages'] = []
    for m in mensajes:
        foto_m = None
        if m.usuario.fotoPerfil:
            foto_m = request.build_absolute_uri(m.usuario.fotoPerfil.url)
            
        stats['recentMessages'].append({
            'user': f"{m.usuario.nombrePila} {m.usuario.primerApellido}",
            'content': m.contenido,
            'timestamp': m.fechaEnvio.strftime('%H:%M'),
            'isHigh': not m.leido,
            'photo': foto_m
        })
    
    # 4. Lista de Administradores
    admins = Usuario.objects.filter(tipoUsuario__clave=3)
    stats['adminList'] = []
    for a in admins:
        foto_a = None
        if a.fotoPerfil:
            foto_a = request.build_absolute_uri(a.fotoPerfil.url)
            
        stats['adminList'].append({
            'fullName': f"{a.nombrePila} {a.primerApellido}",
            'role': 'Administrador del Sistema',
            'status': 'Activo' if a.is_active else 'Inactivo',
            'photo': foto_a
        })

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
    tel = Telefono.objects.filter(usuario=user).first()
    
    return Response({
        "nombre": user.nombrePila,
        "apellido1": user.primerApellido,
        "apellido2": user.segundoApellido,
        "email": user.correo,
        "genero": user.genero,
        "phone": tel.numTel if tel else "",
        "photo": request.build_absolute_uri(user.fotoPerfil.url) if user.fotoPerfil else None,
        "role": user.tipoUsuario.nombre if user.tipoUsuario else "Admin"
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    user = request.user
    # Para datos de texto
    user.nombrePila = request.data.get('nombre', user.nombrePila)
    user.primerApellido = request.data.get('apellido1', user.primerApellido)
    user.segundoApellido = request.data.get('apellido2', user.segundoApellido)
    user.correo = request.data.get('email', user.correo)
    user.genero = request.data.get('genero', user.genero)
    
    # Para la foto (si se envía un archivo)
    if 'foto' in request.FILES:
        user.fotoPerfil = request.FILES['foto']
    
    user.save()

    if 'phone' in request.data:
        Telefono.objects.update_or_create(
            usuario=user, 
            defaults={'numTel': request.data['phone']}
        )
        
    return Response({"status": "success", "message": "Perfil actualizado"})

#Pantalla soporte
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_lista_soporte_admin(request):
    """Lista todos los usuarios que tienen un chat abierto con soporte (Admins)"""
    # Buscamos todas las conversaciones donde participa el admin actual
    mis_convs = ConvUsuario.objects.filter(usuario=request.user).values_list('conversacion', flat=True)
    
    # Buscamos a los "otros" en esas conversaciones
    relaciones_otros = ConvUsuario.objects.filter(
        conversacion__in=mis_convs
    ).exclude(usuario=request.user).select_related('usuario', 'conversacion')

    data = []
    for rel in relaciones_otros:
        u = rel.usuario
        ultimo_msg = Mensaje.objects.filter(conversacion=rel.conversacion).order_by('-fechaEnvio').first()
        no_leidos = Mensaje.objects.filter(conversacion=rel.conversacion, leido=False).exclude(usuario=request.user).count()

        data.append({
            'id': u.numero,
            'nombre': f"{u.nombrePila} {u.primerApellido}",
            'foto': request.build_absolute_uri(u.fotoPerfil.url) if u.fotoPerfil else None,
            'ultimo_msg': ultimo_msg.contenido if ultimo_msg else "Sin mensajes",
            'tiempo': ultimo_msg.fechaEnvio.strftime('%I:%M %p') if ultimo_msg else "",
            'unread_count': no_leidos
        })
    
    return JsonResponse(data, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_mensajes_soporte_admin(request):
    usuario_id = request.GET.get('usuario_id')
    mis_convs = ConvUsuario.objects.filter(usuario=request.user).values_list('conversacion', flat=True)
    
    relacion = ConvUsuario.objects.filter(
        conversacion__in=mis_convs, 
        usuario_id=usuario_id
    ).first()

    if not relacion:
        return JsonResponse([], safe=False)

    mensajes = Mensaje.objects.filter(conversacion=relacion.conversacion).order_by('fechaEnvio')
    
    # Marcar como leídos
    Mensaje.objects.filter(conversacion=relacion.conversacion, leido=False).exclude(usuario=request.user).update(leido=True)

    data = []
    for m in mensajes:
        f_local = timezone.localtime(m.fechaEnvio)
        data.append({
            'texto': m.contenido,
            'tipo': 'sent' if m.usuario == request.user else 'received',
            'hora': f_local.strftime('%I:%M %p'),
            'fecha_completa': f_local.strftime('%Y-%m-%d'),
            'dia_str': f_local.strftime('%d de %B, %Y'),
            'leido': m.leido
        })
    return JsonResponse(data, safe=False)
