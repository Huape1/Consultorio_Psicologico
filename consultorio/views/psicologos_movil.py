from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import datetime as dt
from ..models import Paciente, Telefono, Psicologo, Cita, Usuario
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
    # Obtener la instancia del psicólogo
    psicologo = get_object_or_404(Psicologo, usuario=request.user)
    hoy = timezone.now().date()

    # 1. Estadísticas
    citas_hoy = Cita.objects.filter(psicologo=psicologo, fecha=hoy)
    pendientes = citas_hoy.filter(estado__nombre='Pendiente').count()
    
    # 2. Citas del día (formateadas para el ListView)
    citas_lista = []
    for c in citas_hoy.order_by('hora'):
        citas_lista.append({
            "id": c.numero,
            "paciente_nombre": f"{c.paciente.usuario.nombrePila} {c.paciente.usuario.primerApellido}",
            "hora": c.hora.strftime("%H:%M"),
            "estado": c.estado.nombre,
            "tipo": c.servicio.nombre,
            "foto_paciente": request.build_absolute_uri(c.paciente.usuario.fotoPerfil.url) if c.paciente.usuario.fotoPerfil else None
        })

    return JsonResponse({
        "nombre_psicologo": f"{request.user.nombrePila} {request.user.primerApellido}",
        "stats": {
            "total_hoy": citas_hoy.count(),
            "pendientes": pendientes,
            "mensajes": 3 # O conteo real de mensajes sin leer
        },
        "citas": citas_lista
    })
    
#Pantalla de pacientes del psicólogo
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_mis_pacientes(request):
    psicologo = get_object_or_404(Psicologo, usuario=request.user)
    
    # Obtenemos pacientes únicos que han tenido citas con este psicólogo
    # Además contamos cuántas sesiones 'Realizadas' tienen
    pacientes_qs = Paciente.objects.filter(cita__psicologo=psicologo).distinct()
    
    data = []
    for p in pacientes_qs:
        sesiones_count = Cita.objects.filter(
            paciente=p, 
            psicologo=psicologo, 
            estado__nombre='Realizada'
        ).count()
        
        data.append({
            "id": p.numero,
            "nombre_completo": f"{p.usuario.nombrePila} {p.usuario.primerApellido}",
            "sesiones_completadas": sesiones_count,
            "foto": request.build_absolute_uri(p.usuario.fotoPerfil.url) if p.usuario.fotoPerfil else None,
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