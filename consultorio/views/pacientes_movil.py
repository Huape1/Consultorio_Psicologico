from models import Paciente, Telefono, Psicologo, Mensaje, Cita, Modalidad, EdoCita, Servicio
from rest_framework.decorators import api_view
from datetime import date
from rest_framework.response import Response
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
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
                "hora": m.fechaEnvio.strftime("%I:%M %p") if m.fechaEnvio.date() == today else m.fechaEnvio.strftime("%d/%m")
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
            citas_list.append({
                "fecha": c.fecha.strftime("%d/%m/%Y"),
                "hora": c.hora.strftime("%I:%M %p"),
                "psicologo": f"{c.psicologo.usuario.nombrePila} {c.psicologo.usuario.primerApellido}",
                "servicio": c.servicio.nombre,
                "estado": c.estado.nombre # 'Pendiente', 'Confirmada', 'Atendido', 'Cancelada'
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
        "email": usuario.correo,
        "telefono": telefono_obj.numTel if telefono_obj else "",
        "foto_perfil": request.build_absolute_uri(usuario.fotoPerfil.url) if usuario.fotoPerfil else None,
        "genero": usuario.genero,
        "fecha_nacimiento": paciente.fechaNacimiento.strftime("%Y-%m-%d")
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def actualizar_perfil_api(request):
    try:
        usuario = request.user
        data = request.data
        
        # Actualizar datos básicos del usuario
        usuario.nombrePila = data.get('nombre', usuario.nombrePila)
        usuario.primerApellido = data.get('apellido', usuario.primerApellido)
        usuario.correo = data.get('email', usuario.correo)
        usuario.save()
        
        # Actualizar teléfono
        if 'telefono' in data:
            telefono_obj, _ = Telefono.objects.get_or_create(usuario=usuario)
            telefono_obj.numTel = data['telefono']
            telefono_obj.save()
            
        return JsonResponse({"status": "success", "message": "Perfil actualizado"})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=400)