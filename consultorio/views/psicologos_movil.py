from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import date, datetime as dt
from ..models import Paciente, Telefono, Psicologo, Cita, Usuario, Mensaje, Expediente, Evolucion, Antecedentes
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

#Pantalla perfil
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_perfil_psicologo(request):
    usuario = request.user
    psicologo = get_object_or_404(Psicologo, usuario=usuario)
    # Intentamos obtener el teléfono si existe
    telefono = Telefono.objects.filter(usuario=usuario).first()
    
    return JsonResponse({
        "nombre": usuario.nombrePila,          # Llave simple para el form
        "apellido": usuario.primerApellido,    # Llave simple para el form
        "nombre_completo": f"{usuario.nombrePila} {usuario.primerApellido}",
        "email": usuario.correo,
        "telefono": telefono.numTel if telefono else "",
        "especialidad": psicologo.especialidad.nombre,
        "foto_perfil": request.build_absolute_uri(usuario.fotoPerfil.url) if usuario.fotoPerfil else None,
        "tipo_usuario": "Especialista"
    })
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def actualizar_perfil_psicologo(request):
    usuario = request.user
    data = request.data
    
    try:
        # Actualizamos los datos del usuario base
        usuario.nombrePila = data.get('nombre', usuario.nombrePila)
        usuario.primerApellido = data.get('apellido', usuario.primerApellido)
        usuario.correo = data.get('email', usuario.correo)
        usuario.save()
        
        # Si envías teléfono, se actualiza en la tabla Telefono
        nuevo_tel = data.get('telefono')
        if nuevo_tel:
            # Buscamos el primer teléfono o creamos uno si no existe
            tel_obj, created = Telefono.objects.get_or_create(usuario=usuario)
            tel_obj.numTel = nuevo_tel
            tel_obj.save()

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