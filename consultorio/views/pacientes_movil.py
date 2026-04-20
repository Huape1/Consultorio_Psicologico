from ..models import Paciente, Telefono, Psicologo, Mensaje, Cita, Modalidad, EdoCita, Servicio, Usuario, Conversacion, ConvUsuario, TipoUsuario
from rest_framework.decorators import api_view
from datetime import date
from rest_framework.response import Response
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes, authentication_classes, permission_classes
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.shortcuts import  get_object_or_404
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from ..serializers import PacienteDashboardSerializer
import locale
try:
    locale.setlocale(locale.LC_TIME, 'es_ES.UTF-8') # O 'es_ES' según tu server
except:
    pass
User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_paciente_data(request):
    try:
        # Obtenemos el paciente asociado al usuario logueado
        paciente = Paciente.objects.get(usuario=request.user)
        serializer = PacienteDashboardSerializer(paciente)
        return Response(serializer.data)
    except Paciente.DoesNotExist:
        return Response({'error': 'No eres un paciente'}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_paciente_dashboard(request):
    try:
        # 1. Obtener Paciente
        paciente = Paciente.objects.get(usuario=request.user)
        usuario = request.user
        
        # 2. Calcular Edad
        today = date.today()
        edad = today.year - paciente.fechaNacimiento.year - (
            (today.month, today.day) < (paciente.fechaNacimiento.month, paciente.fechaNacimiento.day)
        )

        # 3. Próxima Cita (Estado: Pendiente/Confirmada y fecha >= hoy)
        proxima = Cita.objects.filter(
            paciente=paciente, 
            fecha__gte=today,
            estado__nombre__in=['Pendiente', 'Confirmada']
        ).order_by('fecha', 'hora').first()

        proxima_data = None
        if proxima:
            proxima_data = {
                "fecha": proxima.fecha.strftime("%Y-%m-%d"),
                "hora": proxima.hora.strftime("%I:%M %p"),
                "servicio_nombre": proxima.servicio.nombre,
                "psicologo_nombre": f"{proxima.psicologo.usuario.nombrePila} {proxima.psicologo.usuario.primerApellido}",
                "estado_nombre": proxima.estado.nombre
            }

        # 4. Contador de Sesiones (Citas con estado 'Atendido')
        sesiones_count = Cita.objects.filter(paciente=paciente, estado__nombre='Atendido').count()

        # 5. Últimos Mensajes
        mensajes_qs = Mensaje.objects.filter(conversacion__convusuario__usuario=usuario).order_by('-fechaEnvio')[:2]
        mensajes_list = []
        for m in mensajes_qs:
            mensajes_list.append({
                "remitente": f"{m.usuario.nombrePila}",
                "contenido": m.contenido,
                "hora": m.fechaEnvio.strftime("%I:%M %p"),
                "foto_remitente": request.build_absolute_uri(m.usuario.fotoPerfil.url) if m.usuario.fotoPerfil else None # <--- Esto
            })

        # 6. Respuesta final
        return JsonResponse({
            "nombre": f"{usuario.nombrePila} {usuario.primerApellido}",
            "email": usuario.correo, # <--- AÑADE ESTO
            "genero": usuario.genero,
            "edad": edad,
            "foto_perfil": request.build_absolute_uri(usuario.fotoPerfil.url) if usuario.fotoPerfil else None, # <--- AÑADE ESTO
            "sesiones": sesiones_count,
            "proxima_cita": proxima_data,
            "mensajes": mensajes_list
        })

    except Paciente.DoesNotExist:
        return JsonResponse({"error": "No encontrado"}, status=404)
    
# Pantalla de citas del paciente
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_mis_citas(request):
    try:
        paciente = Paciente.objects.get(usuario=request.user)
        citas = Cita.objects.filter(paciente=paciente).order_by('-fecha', '-hora')
        
        citas_list = []
        for c in citas:
            usuario_psicologo = c.psicologo.usuario
            citas_list.append({
                "fecha": c.fecha.strftime("%d/%m/%Y"),
                "hora": c.hora.strftime("%I:%M %p"),
                "psicologo": f"{usuario_psicologo.nombrePila} {usuario_psicologo.primerApellido}",
                "psicologo_foto": request.build_absolute_uri(usuario_psicologo.fotoPerfil.url) if usuario_psicologo.fotoPerfil else None,
                "servicio": c.servicio.nombre,
                "estado": c.estado.nombre 
            })
            
        return JsonResponse(citas_list, safe=False)
    except Paciente.DoesNotExist:
        return JsonResponse({"error": "Paciente no encontrado"}, status=404)
    
#Pantalla agendar cita del paciente
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_setup_agendar(request):
    # Obtenemos psicólogos activos
    psicologos = Psicologo.objects.all()
    psis_data = [{
        "id": p.numero,
        "nombre": f"{p.usuario.nombrePila} {p.usuario.primerApellido}",
        "especialidad": "Psicología Clínica", # O el campo que tengas
        "foto": p.usuario.fotoPerfil.url if p.usuario.fotoPerfil else None
    } for p in psicologos]

    # Obtenemos servicios/tipos de terapia
    servicios = Servicio.objects.all()
    serv_data = [{
        "id": s.clave,
        "nombre": s.nombre,
        "precio": 800 # O s.precio si tienes el campo
    } for s in servicios]

    return JsonResponse({"psicologos": psis_data, "servicios": serv_data})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def agendar_cita_api(request):
    try:
        paciente = Paciente.objects.get(usuario=request.user)
        data = request.data
        
        # Obtenemos instancias necesarias
        psicologo = Psicologo.objects.get(numero=data['psicologo_id'])
        servicio = Servicio.objects.get(clave=data['servicio_id'])
        modalidad, _ = Modalidad.objects.get_or_create(nombre=data['modalidad'])
        estado_pend, _ = EdoCita.objects.get_or_create(nombre='Pendiente')

        # Crear la cita
        Cita.objects.create(
            fecha=data['fecha'],
            hora=data['hora'],
            motivo=data.get('motivo', 'Consulta'),
            psicologo=psicologo,
            paciente=paciente,
            servicio=servicio,
            modalidad=modalidad,
            estado=estado_pend
        )
        return Response({"status": "success", "message": "Cita agendada correctamente"})
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    
#Pantalla Perfel
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_perfil_paciente(request):
    usuario = request.user
    paciente = Paciente.objects.get(usuario=usuario)
    telefono_obj = Telefono.objects.filter(usuario=usuario).first()
    
    return JsonResponse({
        "nombre": usuario.nombrePila,
        "apellido": usuario.primerApellido,
        "segundo_apellido": usuario.segundoApellido, # Añadido
        "nombre_completo": f"{usuario.nombrePila} {usuario.primerApellido} {usuario.segundoApellido}",
        "email": usuario.correo,
        "telefono": telefono_obj.numTel if telefono_obj else "",
        "foto_perfil": request.build_absolute_uri(usuario.fotoPerfil.url) if usuario.fotoPerfil else None,
        "genero": usuario.genero,
        "fecha_nacimiento": paciente.fechaNacimiento.strftime("%d/%m/%Y") # Formato más amigable
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def actualizar_perfil_api(request):
    try:
        usuario = request.user
        data = request.data
        
        # Actualizar Foto si viene
        if 'foto_perfil' in request.FILES:
            usuario.fotoPerfil = request.FILES['foto_perfil']
        
        # Actualizar Teléfono
        if 'telefono' in data:
            telefono_obj, _ = Telefono.objects.get_or_create(usuario=usuario)
            telefono_obj.numTel = data['telefono']
            telefono_obj.save()
            
        usuario.save()
        return JsonResponse({"status": "success", "message": "Perfil actualizado"})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=400)
    
#Pantala mensajes

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def api_get_contactos_paciente(request):
    # Lógica: Buscar psicólogos con los que el paciente tiene (o tuvo) una cita
    # Ajusta 'Cita' y sus campos según tu modelo real
    from ..models import Cita 
    
    citas = Cita.objects.filter(paciente__usuario=request.user).select_related('psicologo__usuario')
    
    contactos = []
    # Usamos un set para no repetir psicólogos si hay varias citas
    vistos = set()
    
    for cita in citas:
        psi = cita.psicologo.usuario
        if psi.numero not in vistos:
            contactos.append({
                'id': psi.numero,
                'nombre': f"Dr. {psi.nombrePila} {psi.primerApellido}",
                'ultimo_msg': "Toca para chatear" # Podrías buscar el último mensaje real aquí
            })
            vistos.add(psi.numero)
            
    return JsonResponse(contactos, safe=False)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def api_obtener_mensajes_paciente(request):
    psicologo_user_id = request.GET.get('psicologo_id')
    
    if not psicologo_user_id:
        return JsonResponse({'error': 'Falta el ID del receptor'}, status=400)

    # --- LÓGICA PARA ENCONTRAR LA CONVERSACIÓN ---
    if str(psicologo_user_id) == '0':
        # Caso Soporte: Buscamos conversación donde esté el usuario y un Admin (Tipo 3)
        relacion_comun = ConvUsuario.objects.filter(
            usuario=request.user,
            conversacion__convusuario__usuario__tipoUsuario_id=3
        ).first()
    else:
        # Caso Normal: Buscamos conversación entre paciente y psicólogo específico
        mis_convs = ConvUsuario.objects.filter(usuario=request.user).values_list('conversacion_id', flat=True)
        relacion_comun = ConvUsuario.objects.filter(
            conversacion_id__in=mis_convs, 
            usuario_id=psicologo_user_id
        ).first()

    if not relacion_comun:
        return JsonResponse([], safe=False)

    # --- OBTENER MENSAJES ---
    mensajes_queryset = Mensaje.objects.filter(
        conversacion=relacion_comun.conversacion
    ).order_by('fechaEnvio')

    # Marcar como leídos
    Mensaje.objects.filter(
        conversacion=relacion_comun.conversacion,
        leido=False
    ).exclude(usuario=request.user).update(leido=True)
    
    data = []
    for m in mensajes_queryset:
        # Convertimos a hora local del servidor/usuario
        fecha_local = timezone.localtime(m.fechaEnvio)
        
        data.append({
            'texto': m.contenido,
            'tipo': 'sent' if m.usuario == request.user else 'received',
            'hora': fecha_local.strftime('%I:%M %p'),
            'fecha_completa': fecha_local.strftime('%Y-%m-%d'), # Para la lógica de Flutter
            'dia_str': fecha_local.strftime('%d de %B, %Y'),    # Lo que se ve en el divisor
            'leido': m.leido
        })
        
    return JsonResponse(data, safe=False)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@csrf_exempt
def api_enviar_mensaje_paciente(request):
    # En DRF usamos request.data para leer JSON enviado desde Flutter
    receptor_id = request.data.get('receptor_id')
    contenido = request.data.get('contenido')

    if not receptor_id or not contenido:
        return JsonResponse({'error': 'Datos incompletos'}, status=400)

    # --- LÓGICA DE SOPORTE (ID 0) ---
    if str(receptor_id) == '0':
        # Buscamos si ya existe una conversación de soporte para este paciente
        # (Una donde estén el paciente y al menos un admin)
        tipo_admin = TipoUsuario.objects.get(nombre='Administrador')
        admins = Usuario.objects.filter(tipoUsuario=tipo_admin)
        
        # Buscamos conversación de soporte existente
        mis_convs = ConvUsuario.objects.filter(usuario=request.user).values_list('conversacion_id', flat=True)
        # Filtramos conversaciones donde también esté el primer admin (como representante del grupo)
        relacion = ConvUsuario.objects.filter(conversacion_id__in=mis_convs, usuario__tipoUsuario=tipo_admin).first()
        
        if relacion:
            conversacion_obj = relacion.conversacion
        else:
            # Crear nueva conversación de soporte e incluir a TODOS los admins
            conversacion_obj = Conversacion.objects.create(fechaInicio=timezone.now())
            ConvUsuario.objects.create(conversacion=conversacion_obj, usuario=request.user)
            for admin in admins:
                ConvUsuario.objects.create(conversacion=conversacion_obj, usuario=admin)
    else:
        # --- LÓGICA NORMAL (PSICÓLOGO) ---
        mis_convs = ConvUsuario.objects.filter(usuario=request.user).values_list('conversacion_id', flat=True)
        relacion = ConvUsuario.objects.filter(conversacion_id__in=mis_convs, usuario_id=receptor_id).first()

        if relacion:
            conversacion_obj = relacion.conversacion
        else:
            conversacion_obj = Conversacion.objects.create(fechaInicio=timezone.now())
            ConvUsuario.objects.create(conversacion=conversacion_obj, usuario=request.user)
            receptor_user = get_object_or_404(Usuario, numero=receptor_id)
            ConvUsuario.objects.create(conversacion=conversacion_obj, usuario=receptor_user)

    # Crear el mensaje
    nuevo_msg = Mensaje.objects.create(
        contenido=contenido,
        fechaEnvio=timezone.now(),
        conversacion=conversacion_obj,
        usuario=request.user
    )

    return JsonResponse({
        'status': 'ok',
        'hora': timezone.localtime(nuevo_msg.fechaEnvio).strftime('%I:%M %p')
    })

@api_view(['GET'])
def api_obtener_chats_admin(request):
    # Obtiene todas las conversaciones donde el admin actual está
    convs_ids = ConvUsuario.objects.filter(usuario=request.user).values_list('conversacion_id', flat=True)
    
    # Buscamos el otro integrante (el paciente) para mostrar su nombre
    chats = []
    for c_id in convs_ids:
        # Buscamos al usuario que NO es admin en esa conv
        participante = ConvUsuario.objects.filter(conversacion_id=c_id).exclude(usuario__tipoUsuario__nombre='Administrador').first()
        if participante:
            ultimo_msg = Mensaje.objects.filter(conversacion_id=c_id).last()
            chats.append({
                'id_paciente': participante.usuario.numero,
                'nombre_paciente': participante.usuario.nombrePila,
                'ultimo_msg': ultimo_msg.contenido if ultimo_msg else ""
            })
    return JsonResponse(chats, safe=False)