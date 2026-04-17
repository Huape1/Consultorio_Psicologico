from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from ..models import  Paciente, Telefono, Sesion, Pago,  Psicologo, Mensaje, ConvUsuario, Cita, EdoCita, Consulta
from django.contrib import messages
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

def cuenta(request):
    return render(request, 'psicologos/psicologo.html')

def agendas(request):
    return render(request, 'psicologos/psicologo.html')

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