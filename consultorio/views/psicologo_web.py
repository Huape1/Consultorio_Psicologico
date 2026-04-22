from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from datetime import datetime, date
from django.db import transaction
from datetime import timedelta
from django.db.models.functions import ExtractMonth
from django.db.models import Count
from ..models import  Paciente, Telefono, Sesion, Pago,  Psicologo, Mensaje, ConvUsuario, Cita, EdoCita, Consulta, Expediente, Antecedentes, Evolucion, Medicacion, PlanTrabajo, EdoEmocional
from django.contrib import messages
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q
import json
from django.http import JsonResponse
from django.contrib.auth import get_user_model
import locale
try:
    locale.setlocale(locale.LC_TIME, 'es_ES.UTF-8') # O 'es_ES' según tu server
except:
    pass
User = get_user_model()

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
    pacientes = Paciente.objects.select_related('usuario').all()
    data = []
    for p in pacientes:
        # La foto está en el modelo Usuario
        foto_path = p.usuario.fotoPerfil.url if p.usuario.fotoPerfil else '/media/perfiles/default.png'

        data.append({
            "id": p.usuario.numero,
            "nombre": f"{p.usuario.nombrePila} {p.usuario.primerApellido}",
            "correo": p.usuario.correo,
            "genero": p.usuario.genero, # Viene de usuario
            "fecha_nacimiento": p.fechaNacimiento.strftime('%Y-%m-%d'),
            "foto": foto_path
        })
    return Response(data)

@api_view(['GET'])
def api_detalle_paciente(request, paciente_id):
    try:
        paciente = Paciente.objects.get(usuario__numero=paciente_id)
        expediente = Expediente.objects.filter(paciente=paciente).first()
        antecedentes = Antecedentes.objects.filter(expediente=expediente).first() if expediente else None
        
        # 3. Obtener Evoluciones del expediente
        evoluciones = Evolucion.objects.filter(expediente=expediente).order_by('-fecha') if expediente else []
        
        # Citas para el historial
        citas = Cita.objects.filter(paciente=paciente).order_by('-fecha')
        
        historial_data = []
        for c in citas:
            consulta = Consulta.objects.filter(cita=c).first()
            historial_data.append({
                "fecha": c.fecha.strftime('%d/%m/%Y'),
                "hora": c.hora.strftime('%I:%M %p'),
                "estado": c.estado.nombre if c.estado else "Pendiente",
                "id_cita": c.numero,
                "tiene_consulta": True if consulta else False,
                "id_consulta": consulta.numero if consulta else None
            })
        
        data = {
            "id_expediente": expediente.numero if expediente else None,
            "nombre": f"{paciente.usuario.nombrePila} {paciente.usuario.primerApellido}",
            "foto": paciente.usuario.fotoPerfil.url if paciente.usuario.fotoPerfil else '/media/perfiles/default.png',
            "ocupacion": expediente.ocupacion if expediente else "No registrada",
            "estado_civil": expediente.estado_civil if expediente else "No registrado",
            "fecha_nacimiento": paciente.fechaNacimiento.strftime('%d/%m/%Y'),
            "fecha_creacion": expediente.fechaCreacion.strftime('%d/%m/%Y') if expediente else "N/A",
            "antecedentes": {
                "traumas": expediente.traumas if expediente else "",
                "personales": antecedentes.personales if antecedentes else "",
                "psicologicos": antecedentes.psicologicos if antecedentes else "",
                "familiares": antecedentes.familiares if antecedentes else ""
            },
            "evoluciones": [{
                "fecha": ev.fecha.strftime('%d/%m/%Y'),
                "notas": ev.notas
            } for ev in evoluciones],
            "historial": historial_data  # USAR SOLO ESTA VARIABLE
        }
        return Response(data)
    except Paciente.DoesNotExist:
        return Response({"error": "Paciente no encontrado"}, status=404)
    
# views.py
@api_view(['GET'])
def api_detalle_consulta(request, consulta_id):
    try:
        consulta = Consulta.objects.get(numero=consulta_id)
        sesion = Sesion.objects.get(consulta=consulta)
        # Opcional: obtener medicación o estado emocional si existen
        
        return Response({
            "status": "success",
            "diagnostico": sesion.diagnostico,
            "resumen": sesion.resumen,
            "notas": sesion.notas,
            "conducta": sesion.conducta,
            "observaciones": sesion.observaciones
        })
    except (Consulta.DoesNotExist, Sesion.DoesNotExist):
        return Response({"error": "No se encontró el detalle de la sesión"}, status=404)
    

@api_view(['GET'])
def api_info_cita(request, cita_id):
    try:
        cita = Cita.objects.get(numero=cita_id)
        return Response({
            "motivo": cita.motivo,
            "servicio": cita.servicio.nombre, # Asumiendo que Servicio tiene campo 'nombre'
            "modalidad": cita.modalidad.nombre,
            "psicologo": f"{cita.psicologo.usuario.nombrePila} {cita.psicologo.usuario.primerApellido}",
            "fecha": cita.fecha.strftime('%d/%m/%Y'),
            "hora": cita.hora.strftime('%I:%M %p')
        })
    except Cita.DoesNotExist:
        return Response({"error": "Cita no encontrada"}, status=404)

    
@api_view(['POST'])
def api_guardar_evolucion(request):
    try:
        expediente_id = request.data.get('expediente_id')
        notas = request.data.get('notas')
        
        if not expediente_id or not notas:
            return Response({"error": "Faltan datos obligatorios"}, status=400)
            
        expediente = Expediente.objects.get(numero=expediente_id)
        
        # Crear el registro de evolución
        nueva_evolucion = Evolucion.objects.create(
            expediente=expediente,
            fecha=timezone.now().date(),
            notas=notas
        )
        
        return Response({
            "status": "success",
            "fecha": nueva_evolucion.fecha.strftime('%d/%m/%Y'),
            "notas": nueva_evolucion.notas
        })
    except Expediente.DoesNotExist:
        return Response({"error": "Expediente no encontrado"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

def guardar_consulta(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            cita = Cita.objects.get(numero=data['cita_id'])
            
            # 1. Actualizar estado
            nuevo_estado = EdoCita.objects.filter(nombre__icontains='Atendida').first()
            if nuevo_estado:
                cita.estado = nuevo_estado
                cita.save()

            # 2. Crear Consulta
            nueva_consulta = Consulta.objects.create(cita=cita)

            # 3. Crear Sesión 
            # (Ajustado a tus campos actuales: notas, observaciones, resumen, conducta, diagnostico)
            nueva_sesion = Sesion.objects.create(
                consulta=nueva_consulta,
                notas=data.get('notas', ''),
                observaciones=data.get('observaciones', ''),
                resumen=data.get('resumen', ''),
                conducta=data.get('conducta', ''),
                diagnostico=data.get('diagnostico', '')
            )

            # 4. Crear Pago (Ahora vinculado a la SESION, no a la consulta)
            Pago.objects.create(
                fecha=timezone.now().date(),
                hora=timezone.now().time(),
                monto=data['monto'],
                sesion=nueva_sesion # <-- Cambio clave
            )

            return JsonResponse({'status': 'ok'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

@login_required
def panel_psicologos(request):
    try:
        psicologo = Psicologo.objects.get(usuario=request.user)
    except Psicologo.DoesNotExist:
        messages.error(request, "No tienes perfil de psicólogo asignado.")
        return redirect('/')

    hoy = timezone.now().date()
    ahora = timezone.now()
    ahora1 = timezone.localtime(timezone.now())
    hora_actual = ahora1.time()
    
    # --- ESTADÍSTICAS ---
    citas_hoy_count = Cita.objects.filter(psicologo=psicologo, fecha=hoy).count()
    pacientes_activos = Paciente.objects.filter(cita__psicologo=psicologo).distinct().count()
    citas_pendientess = Cita.objects.filter(
        psicologo=psicologo,
        fecha=ahora.date(),
        hora__gte=ahora.time()
    ).order_by('hora')
    
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
    pagos_historial = Pago.objects.filter(sesion__consulta__cita__psicologo=psicologo).order_by('-fecha', '-hora')
    
    telefono_obj = Telefono.objects.filter(usuario=request.user).first()

    # --- PRÓXIMA CITA ---
    limite_atencion = (ahora1 - timedelta(minutes=50)).time()
    # Filtramos: (Es hoy y falta por pasar) O (Es un día después de hoy)
    proxima_cita = Cita.objects.filter(
        psicologo=psicologo,
        estado__nombre__iexact='Pendiente'
    ).filter(
        Q(fecha=hoy, hora__gte=limite_atencion) | 
        Q(fecha__gt=hoy)
    ).order_by('fecha', 'hora').first()

    # --- SIGUIENTES CITAS (La lista pequeña) ---
    # Traemos las que siguen de la próxima (excluimos la primera para que no se repita)
    citass = Cita.objects.filter(
        psicologo=psicologo,
        estado__nombre__iexact='Pendiente'
    ).filter(
        Q(fecha=hoy, hora__gte=limite_atencion) | 
        Q(fecha__gt=hoy)
    ).order_by('fecha', 'hora')[1:5] # Empezamos desde la segunda

    # Calcular si falta poco (opcional para el estilo)
    faltan_15 = False
    if proxima_cita:
        # Combinamos fecha y hora de la cita para comparar
        dt_cita = timezone.make_aware(datetime.combine(proxima_cita.fecha, proxima_cita.hora))
        diferencia = dt_cita - ahora
        if 0 <= diferencia.total_seconds() <= 900: # 900 segundos = 15 min
            faltan_15 = True

    # --- LÓGICA DEL GRÁFICO (Añadir esto aquí) ---
    # --- SEMANA ---
    inicio_semana = hoy - timedelta(days=hoy.weekday())
    citas_sem_qs = Cita.objects.filter(
        psicologo=psicologo, 
        estado__nombre__icontains="Atendida", 
        fecha__range=[inicio_semana, hoy]
    ).values('fecha').annotate(total=Count('numero'))

    data_semana = [0] * 7
    for c in citas_sem_qs:
        # c['fecha'] es un objeto date, extraemos el día de la semana
        data_semana[c['fecha'].weekday()] = c['total']

    # --- MES ---
    citas_mes_qs = Cita.objects.filter(
        psicologo=psicologo, 
        estado__nombre__icontains="Atendida",
        fecha__month=hoy.month, 
        fecha__year=hoy.year
    ).values('fecha').annotate(total=Count('numero'))
    
    data_mes = [0, 0, 0, 0]
    for c in citas_mes_qs:
        dia = c['fecha'].day
        idx = min((dia - 1) // 7, 3)
        data_mes[idx] += c['total']

    # --- AÑO ---
    citas_anio_qs = Cita.objects.filter(
        psicologo=psicologo, 
        estado__nombre__icontains="Atendida",
        fecha__year=hoy.year
    ).annotate(mes_num=ExtractMonth('fecha')).values('mes_num').annotate(total=Count('numero'))
    
    data_anio = [0] * 12
    for c in citas_anio_qs:
        # mes_num viene de 1 a 12
        data_anio[c['mes_num'] - 1] = c['total']

    # --- LISTAS DE LABELS ---
    labels_semana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
    labels_anio = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

    # Lógica para determinar si es la primera vez
    es_primera_consulta = True
    if proxima_cita:
        # Contamos cuántas consultas tiene el paciente con ESTE psicólogo que ya estén terminadas
        conteo_consultas = Consulta.objects.filter(
            cita__paciente=proxima_cita.paciente,
            cita__psicologo=psicologo
        ).count()
    
    # --- LÓGICA DE EXPEDIENTE ---
    tiene_expediente = False
    if proxima_cita:
        # Verificamos si ya existe un expediente registrado para este paciente
        tiene_expediente = Expediente.objects.filter(paciente=proxima_cita.paciente).exists()
        
        # Si ya tiene 1 o más, ya no es la primera vez

    contexto = {
        'psicologo': psicologo,
        'citas_hoy': citas_hoy_count,
        'pacientes_activos': pacientes_activos,
        'citas': citas_pendientes,
        'citass': citas_pendientess,
        'agendas': todas_las_citas,
        'consultas': consultas_historial,
        'pagos': pagos_historial,
        'mis_pacientes': mis_pacientes,
        'telefono': telefono_obj.numTel if telefono_obj else "",
        #proxima Citas
        'proxima': proxima_cita,
        'citasss': citass,
        'es_hoy': proxima_cita.fecha == ahora.date() if proxima_cita else False,
        'faltan_15': faltan_15,
        'chart_labels_semana': labels_semana,
        'chart_data_semana': data_semana, # Ahora es una lista [0, 0, 1, ...]
        'chart_data_mes': data_mes,       # Lista [0, 0, 0, 0]
        'chart_data_anio': data_anio,     # Lista de 12 ceros/números
        'chart_labels_anio': labels_anio,
        #expediente, sesion
        'es_primera_consulta': es_primera_consulta,
        'tiene_expediente': tiene_expediente,
    }
    return render(request, 'psicologos/psicologo.html', contexto)

#Pantalla expediente

@login_required
def guardar_expediente_ajax(request):
    if request.method == 'POST':
        try:
            # 1. Obtener al paciente (puedes pasarlo por ID desde el JS)
            paciente_id = request.POST.get('paciente_id')
            paciente = Paciente.objects.get(numero=paciente_id)

            # 2. Crear el Expediente
            expediente = Expediente.objects.create(
                fechaCreacion=timezone.now().date(),
                traumas=request.POST.get('traumas'),
                riesgos=request.POST.get('riesgos'),
                ocupacion=request.POST.get('ocupacion'),
                estado_civil=request.POST.get('estado_civil'),
                paciente=paciente
            )

            # 3. Crear los Antecedentes vinculados al expediente
            Antecedentes.objects.create(
                personales=request.POST.get('ant_personales'),
                psicologicos=request.POST.get('ant_psicologicos'),
                familiares=request.POST.get('ant_familiares'),
                expediente=expediente
            )

            return JsonResponse({'status': 'success', 'message': 'Expediente guardado correctamente'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Método no permitido'}, status=405)

@login_required
def api_obtener_expediente_lateral(request):
    paciente_id = request.GET.get('paciente_id')
    if not paciente_id:
        return JsonResponse({'error': 'Falta ID de paciente'}, status=400)

    try:
        paciente = Paciente.objects.get(numero=paciente_id)
        expediente = Expediente.objects.get(paciente=paciente)
        
        # Obtener Antecedentes (asumiendo que solo hay uno principal por expediente)
        antecedentes = Antecedentes.objects.filter(expediente=expediente).first()
        
        # Obtener Evoluciones (últimas 5)
        evoluciones_qs = Evolucion.objects.filter(expediente=expediente).order_by('-fecha')[:5]
        evoluciones_list = []
        for evo in evoluciones_qs:
            evoluciones_list.append({
                'fecha': evo.fecha.strftime('%d/%m/%Y'),
                'notas': evo.notas
            })

        # Calcular Edad
        today = date.today()
        born = paciente.fechaNacimiento
        edad = today.year - born.year - ((today.month, today.day) < (born.month, born.day))

        data = {
            'edad': edad,
            'ocupacion': expediente.ocupacion,
            'estado_civil': expediente.estado_civil,
            'riesgos': expediente.riesgos,
            'traumas': expediente.traumas,
            'ant_personales': antecedentes.personales if antecedentes else None,
            'ant_familiares': antecedentes.familiares if antecedentes else None,
            'ant_psicologicos': antecedentes.psicologicos if antecedentes else None,
            'evoluciones': evoluciones_list
        }
        
        return JsonResponse(data)

    except (Paciente.DoesNotExist, Expediente.DoesNotExist):
        return JsonResponse({'error': 'Expediente no encontrado'}, status=404)
    
@login_required
def guardar_consulta(request):
    if request.method == 'POST':
        try:
            # Usamos una transacción para asegurar que si algo falla, no se guarde nada a medias
            with transaction.atomic():
                # 1. Obtener la Cita
                cita_id = request.POST.get('cita_id')
                if not cita_id:
                    return JsonResponse({'status': 'error', 'message': 'ID de cita no proporcionado'})
                
                cita = Cita.objects.get(numero=cita_id)

                # 2. Crear la Consulta
                # Nota: Tu modelo Consulta solo tiene numero y cita según lo enviado
                nueva_consulta = Consulta.objects.create(cita=cita)

                # 3. Crear la Sesión (Cuerpo principal de la consulta)
                nueva_sesion = Sesion.objects.create(
                    consulta=nueva_consulta,
                    notas=request.POST.get('notas', ''),
                    conducta=request.POST.get('conducta', ''),
                    diagnostico=request.POST.get('diagnostico', ''),
                    resumen=request.POST.get('resumen', ''),
                    observaciones=request.POST.get('conducta', '') # Usando conducta como observación o ajusta según prefieras
                )

                # 4. Crear el Estado Emocional (Ratings del Paso 1)
                # Convertimos a int() porque vienen como strings del formulario
                EdoEmocional.objects.create(
                    sesion=nueva_sesion,
                    ansiedad=int(request.POST.get('ansiedad', 0)),
                    tristeza=int(request.POST.get('tristeza', 0)),
                    estres=int(request.POST.get('estres', 0)),
                    animo_general=int(request.POST.get('animo_general', 0))
                )

                # 5. Crear el Plan de Trabajo (Paso 3)
                PlanTrabajo.objects.create(
                    sesion=nueva_sesion,
                    objetivos=request.POST.get('plan_objetivos', ''),
                    tecnicas=request.POST.get('plan_tecnicas', ''),
                    frecuencia_sesion=request.POST.get('plan_frecuencia', '')
                )

                # 6. Crear Medicación (Si se llenó el nombre del medicamento)
                med_nombre = request.POST.get('med_nombre')
                if med_nombre:
                    Medicacion.objects.create(
                        sesion=nueva_sesion,
                        medicamento=med_nombre,
                        dosis=request.POST.get('med_dosis', ''),
                        frecuencia=request.POST.get('med_frecuencia', '')
                    )

                # 7. Actualizar el estado de la Cita a "Atendida"
                # Usamos iexact para evitar problemas de mayúsculas/minúsculas
                estado_atendida = EdoCita.objects.get(nombre__icontains="Atendida")
                cita.estado = estado_atendida
                cita.save()

                return JsonResponse({
                    'status': 'success', 
                    'message': 'Consulta y expediente de sesión guardados correctamente.'
                })

        except Cita.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'La cita especificada no existe.'})
        except Exception as e:
            # Imprime el error en consola para debuguear
            print(f"Error al guardar consulta: {str(e)}")
            return JsonResponse({'status': 'error', 'message': str(e)})

    return JsonResponse({'status': 'error', 'message': 'Método no permitido.'})


@api_view(['POST', 'PUT'])
def api_editar_paciente(request, paciente_id):
    try:
        # Buscamos al paciente por el número de usuario
        paciente = Paciente.objects.get(usuario__numero=paciente_id)
        expediente = Expediente.objects.filter(paciente=paciente).first()
        antecedentes = Antecedentes.objects.filter(expediente=expediente).first()

        with transaction.atomic():
            # Actualizar Expediente (Traumas y Riesgos)
            if expediente:
                expediente.traumas = request.data.get('traumas', expediente.traumas)
                expediente.riesgos = request.data.get('riesgos', expediente.riesgos)
                expediente.save()

            # Actualizar Antecedentes
            if antecedentes:
                antecedentes.personales = request.data.get('ant_personales', antecedentes.personales)
                antecedentes.psicologicos = request.data.get('ant_psicologicos', antecedentes.psicologicos)
                antecedentes.familiares = request.data.get('ant_familiares', antecedentes.familiares)
                antecedentes.save()

        return Response({
            "status": "success", 
            "nombre_completo": f"{paciente.usuario.nombrePila} {paciente.usuario.primerApellido}"
        })
    except Exception as e:
        return Response({"status": "error", "error": str(e)}, status=400)