from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import date, datetime as dt
from ..models import Paciente, Telefono, Psicologo, Cita, ConvUsuario, Mensaje, Expediente, Evolucion, Antecedentes
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from django.contrib.auth import get_user_model
import locale
try:
    locale.setlocale(locale.LC_TIME, 'es_ES.UTF-8') # O 'es_ES' según tu server
except:
    pass
User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def psicologo_dashboard(request):
    psicologo = get_object_or_404(Psicologo, usuario=request.user)
    hoy = timezone.now().date()
    ahora = timezone.localtime(timezone.now())

    # 1. Mensajes no leídos (Conteo real)
    mensajes_sin_leer = Mensaje.objects.filter(
        conversacion__convusuario__usuario=request.user,
        leido=False
    ).exclude(usuario=request.user).count()

    # 2. Próxima Cita (La que sigue a partir de ahorita)
    proxima_cita_obj = Cita.objects.filter(
        psicologo=psicologo,
        estado__nombre__in=['Pendiente', 'Confirmada'],
        fecha__gte=hoy
    ).filter(
        Q(fecha__gt=hoy) | Q(fecha=hoy, hora__gte=ahora.time())
    ).order_by('fecha', 'hora').first()

    # 3. Lista de 3 citas siguientes (excluyendo la próxima)
    citas_siguientes_qs = Cita.objects.filter(
        psicologo=psicologo,
        fecha__gte=hoy
    ).exclude(
        numero=proxima_cita_obj.numero if proxima_cita_obj else -1
    ).order_by('fecha', 'hora')[:3]

    # Formatear lista de citas
    citas_lista = []
    for c in citas_siguientes_qs:
        citas_lista.append({
            "id": c.numero,
            "paciente_nombre": f"{c.paciente.usuario.nombrePila} {c.paciente.usuario.primerApellido}",
            "hora": c.hora.strftime("%H:%M"),
            "fecha": c.fecha.strftime("%d/%m/%Y"),
            "estado": c.estado.nombre,
            "tipo": c.servicio.nombre,
        })

    return JsonResponse({
        "nombre_psicologo": f"{request.user.nombrePila} {request.user.primerApellido}",
        "foto_psicologo": request.build_absolute_uri(request.user.fotoPerfil.url) if request.user.fotoPerfil else None,
        "stats": {
            "total_hoy": Cita.objects.filter(psicologo=psicologo, fecha=hoy).count(),
            "mensajes_no_leidos": mensajes_sin_leer,
            "pacientes_activos": Paciente.objects.filter(cita__psicologo=psicologo).distinct().count()
        },
        "proxima_cita": {
            "id": proxima_cita_obj.numero,
            "paciente_nombre": f"{proxima_cita_obj.paciente.usuario.nombrePila} {proxima_cita_obj.paciente.usuario.primerApellido}",
            "hora": proxima_cita_obj.hora.strftime("%H:%M"),
            "fecha": proxima_cita_obj.fecha.strftime("%d/%m/%Y"),
            "tipo": proxima_cita_obj.servicio.nombre,
            "estado": proxima_cita_obj.estado.nombre,
            "foto_paciente": request.build_absolute_uri(proxima_cita_obj.paciente.usuario.fotoPerfil.url) if proxima_cita_obj.paciente.usuario.fotoPerfil else None,
        } if proxima_cita_obj else None,
        "citas_siguientes": citas_lista
    })
    
#Pantalla de pacientes del psicólogo
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_mis_pacientes(request):
    psicologo = get_object_or_404(Psicologo, usuario=request.user)
    pacientes_qs = Paciente.objects.filter(cita__psicologo=psicologo).distinct()
    
    data = []
    for p in pacientes_qs:
        sesiones_count = Cita.objects.filter(
            paciente=p, 
            psicologo=psicologo,
            estado__nombre='Realizada'
        ).count()

        # Obtenemos el teléfono del usuario
        tel_obj = Telefono.objects.filter(usuario=p.usuario).first()

        data.append({
            "id": p.numero,
            "nombre_completo": f"{p.usuario.nombrePila} {p.usuario.primerApellido}",
            "sesiones_completadas": sesiones_count,
            "correo": p.usuario.correo, # <--- AGREGADO
            "telefono": tel_obj.numTel if tel_obj else "Sin teléfono", # <--- AGREGADO
            "foto_perfil": request.build_absolute_uri(p.usuario.fotoPerfil.url) if p.usuario.fotoPerfil else None, # <--- LLAVE UNIFICADA
        })
        
    return JsonResponse(data, safe=False)

#Pantalla de agenda
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_agenda_diaria(request):
    psicologo = get_object_or_404(Psicologo, usuario=request.user)
    # Obtenemos la fecha de los parámetros: /api/psicologo/agenda/?fecha=2024-10-24
    fecha_str = request.query_params.get('fecha')
    
    if fecha_str:
        fecha_obj = dt.strptime(fecha_str, '%Y-%m-%d').date()
    else:
        fecha_obj = timezone.now().date()

    citas = Cita.objects.filter(
        psicologo=psicologo, 
        fecha=fecha_obj
    ).exclude(estado__nombre='Cancelada').order_by('hora')

    data = []
    for c in citas:
        data.append({
            "id": c.numero,
            "hora": c.hora.strftime("%H:%M"),
            "tipo": c.servicio.nombre,
            "status": c.estado.nombre,
            "paciente_nombre": f"{c.paciente.usuario.nombrePila} {c.paciente.usuario.primerApellido}",
            "modalidad": "Virtual" if c.modalidad else "Presencial",
            "duracion": "45 min" # O la duración real de tu modelo
        })

    return JsonResponse(data, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_perfil_psicologo(request):
    usuario = request.user
    psicologo = get_object_or_404(Psicologo, usuario=usuario)
    telefono = Telefono.objects.filter(usuario=usuario).first()
    
    return JsonResponse({
        "nombre": usuario.nombrePila,
        "apellido": usuario.primerApellido,
        "segundo_apellido": usuario.segundoApellido,
        "nombre_completo": f"{usuario.nombrePila} {usuario.primerApellido} {usuario.segundoApellido}",
        "email": usuario.correo,
        "genero": usuario.genero,
        "telefono": telefono.numTel if telefono else "",
        "cedula": psicologo.cedula,
        "especialidad": psicologo.especialidad.nombre,
        "presentacion": psicologo.presentacion or "", # Importante
        "foto_perfil": request.build_absolute_uri(usuario.fotoPerfil.url) if usuario.fotoPerfil else None,
        "tipo_usuario": "Especialista"
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def actualizar_perfil_psicologo(request):
    usuario = request.user
    psicologo = get_object_or_404(Psicologo, usuario=usuario)
    
    try:
        # 1. Actualizar Foto de Perfil si viene en la petición
        if 'foto_perfil' in request.FILES:
            usuario.fotoPerfil = request.FILES['foto_perfil']
        
        # 2. Actualizar presentación del psicólogo
        if 'presentacion' in request.data:
            psicologo.presentacion = request.data.get('presentacion')
            psicologo.save()

        # 3. Datos básicos del usuario (opcional si los permites editar)
        usuario.nombrePila = request.data.get('nombre', usuario.nombrePila)
        usuario.save()
        
        return JsonResponse({"status": "success", "message": "Perfil actualizado"})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=400)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_obtener_expediente_lateral(request):
    # Obtenemos el ID desde los parámetros de la URL (?paciente_id=X)
    paciente_id = request.query_params.get('paciente_id')
    
    if not paciente_id:
        return JsonResponse({'error': 'Falta ID de paciente'}, status=400)

    try:
        # 1. Obtener el paciente (verificando que existe)
        paciente = get_object_or_404(Paciente, numero=paciente_id)
        
        # 2. Intentar obtener el expediente
        expediente = Expediente.objects.filter(paciente=paciente).first()
        if not expediente:
            return JsonResponse({'error': 'Este paciente aún no tiene un expediente creado'}, status=404)

        # 3. Obtener Antecedentes (principal por expediente)
        antecedentes = Antecedentes.objects.filter(expediente=expediente).first()
        
        # 4. Obtener Evoluciones (últimas 5)
        evoluciones_qs = Evolucion.objects.filter(expediente=expediente).order_by('-fecha')[:5]
        evoluciones_list = []
        for evo in evoluciones_qs:
            evoluciones_list.append({
                'fecha': evo.fecha.strftime('%d/%m/%Y'),
                'notas': evo.notas
            })

        # 5. Calcular Edad
        today = date.today()
        born = paciente.fechaNacimiento
        edad = today.year - born.year - ((today.month, today.day) < (born.month, born.day))

        # 6. Construir respuesta
        data = {
            'edad': edad,
            'ocupacion': expediente.ocupacion or "No especificada",
            'estado_civil': expediente.estado_civil or "No especificado",
            'riesgos': expediente.riesgos or "Sin riesgos registrados",
            'traumas': expediente.traumas or "Sin traumas registrados",
            'ant_personales': antecedentes.personales if antecedentes else "Sin registros",
            'ant_familiares': antecedentes.familiares if antecedentes else "Sin registros",
            'ant_psicologicos': antecedentes.psicologicos if antecedentes else "Sin registros",
            'evoluciones': evoluciones_list
        }

        return JsonResponse(data)

    except Exception as e:
        print(f"Error en api_obtener_expediente_lateral: {e}")
        return JsonResponse({'error': 'Error interno del servidor'}, status=500)
    
#Pantalla mensajes:
from django.utils import timezone
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from ..models import Cita, Mensaje, ConvUsuario, Conversacion, Usuario, TipoUsuario

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_get_contactos_psicologo(request):
    # 1. Obtener pacientes con los que el psicólogo tiene citas
    citas = Cita.objects.filter(psicologo__usuario=request.user).select_related('paciente__usuario')
    
    contactos = []
    vistos = set()
    
    # Agregar Soporte siempre al inicio
    contactos.append({
        'id': 0,
        'nombre': "Soporte Técnico (Admin)",
        'ultimo_msg': "Chat de ayuda y reportes",
        'foto': None,
        'is_admin': True
    })

    for cita in citas:
        pac = cita.paciente.usuario
        if pac.numero not in vistos:
            contactos.append({
                'id': pac.numero,
                'nombre': f"{pac.nombrePila} {pac.primerApellido}",
                'ultimo_msg': "Toca para ver el historial",
                'foto': request.build_absolute_uri(pac.fotoPerfil.url) if pac.fotoPerfil else None,
                'is_admin': False
            })
            vistos.add(pac.numero)
            
    return JsonResponse(contactos, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_obtener_mensajes_psicologo(request):
    receptor_id = request.GET.get('receptor_id')
    
    if str(receptor_id) == '0':
        # Conversación con Admin (Tipo 3)
        relacion_comun = ConvUsuario.objects.filter(
            usuario=request.user,
            conversacion__convusuario__usuario__tipoUsuario_id=3
        ).first()
    else:
        # Conversación con Paciente
        mis_convs = ConvUsuario.objects.filter(usuario=request.user).values_list('conversacion_id', flat=True)
        relacion_comun = ConvUsuario.objects.filter(
            conversacion_id__in=mis_convs, 
            usuario_id=receptor_id
        ).first()

    if not relacion_comun:
        return JsonResponse([], safe=False)

    mensajes = Mensaje.objects.filter(conversacion=relacion_comun.conversacion).order_by('fechaEnvio')
    
    # Marcar como leídos los que no son míos
    Mensaje.objects.filter(conversacion=relacion_comun.conversacion, leido=False).exclude(usuario=request.user).update(leido=True)

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