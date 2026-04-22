from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from django.utils import timezone
import datetime  
from datetime import date, timedelta
from django.db.models import Q
from datetime import datetime as dt
from ..models import Usuario, Paciente, Telefono, Psicologo, HorPsicologo, Conversacion, Mensaje, ConvUsuario, Cita, Modalidad, EdoCita, Servicio
from django.contrib import messages
from django.http import JsonResponse
import locale
try:
    locale.setlocale(locale.LC_TIME, 'es_ES.UTF-8') # O 'es_ES' según tu server
except:
    pass
User = get_user_model()

@login_required
def paciente(request):
    # 1. Obtener instancia del paciente
    paciente_instancia = get_object_or_404(Paciente, usuario=request.user)
    ahora = timezone.now()
    hoy_fecha = ahora.date()
    ahora_hora = ahora.time()

    # --- LÓGICA PARA EL DASHBOARD ---
    
    # 1. Próxima cita (la más cercana a partir de ahora, que esté Pendiente)
    citas_pendientes = Cita.objects.filter(
        paciente=paciente_instancia,
        estado__nombre='Pendiente'
    ).filter(
        Q(fecha__gt=hoy_fecha) | 
        Q(fecha=hoy_fecha, hora__gte=ahora_hora)
    ).order_by('fecha', 'hora')

    # La primera del queryset es la "Próxima cita"
    proxima_cita = citas_pendientes.first()

    # 2. Siguientes 3 citas (después de la proxima_cita)
    siguientes_citas = []
    if proxima_cita:
        # Excluimos la que ya pusimos en la tarjeta principal
        siguientes_citas = citas_pendientes.exclude(numero=proxima_cita.numero)[:3]
    else:
        # Si no hubo próxima cita, intentamos llenar la lista lateral con lo que haya
        siguientes_citas = citas_pendientes[:3]
    
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

    conversacion_final = None

    if psicologo_user_id == 'SOPORTE':
        # Buscar conversación donde esté el paciente y un admin
        relacion = ConvUsuario.objects.filter(
            usuario=request.user,
            conversacion__convusuario__usuario__is_staff=True
        ).distinct().first()
        if relacion:
            conversacion_final = relacion.conversacion
    else:
        mis_convs = ConvUsuario.objects.filter(usuario=request.user).values_list('conversacion_id', flat=True)
        relacion_comun = ConvUsuario.objects.filter(
            conversacion_id__in=mis_convs, 
            usuario_id=psicologo_user_id
        ).first()
        if relacion_comun:
            conversacion_final = relacion_comun.conversacion

    if not conversacion_final:
        return JsonResponse([], safe=False)

    mensajes_queryset = Mensaje.objects.filter(conversacion=conversacion_final).order_by('fechaEnvio')

    # Marcar como leídos
    Mensaje.objects.filter(conversacion=conversacion_final, leido=False).exclude(usuario=request.user).update(leido=True)
    
    data = []
    for m in mensajes_queryset:
        hora_local = timezone.localtime(m.fechaEnvio)
        data.append({
            'texto': m.contenido,
            'tipo': 'sent' if m.usuario == request.user else 'received',
            'hora': hora_local.strftime('%I:%M %p'),
            'fecha_completa': hora_local.strftime('%Y-%m-%d'),
            'dia_str': hora_local.strftime('%d de %B, %Y'),
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

        conversacion_obj = None

        if receptor_id == 'SOPORTE':
            relacion = ConvUsuario.objects.filter(
                usuario=request.user,
                conversacion__convusuario__usuario__is_staff=True
            ).distinct().first()
            
            if relacion:
                conversacion_obj = relacion.conversacion
            else:
                conversacion_obj = Conversacion.objects.create(fechaInicio=timezone.now())
                ConvUsuario.objects.create(conversacion=conversacion_obj, usuario=request.user)
                for admin in Usuario.objects.filter(is_staff=True):
                    ConvUsuario.objects.get_or_create(conversacion=conversacion_obj, usuario=admin)
        else:
            # Lógica normal para psicólogos
            mis_convs = ConvUsuario.objects.filter(usuario=request.user).values_list('conversacion_id', flat=True)
            relacion = ConvUsuario.objects.filter(conversacion_id__in=mis_convs, usuario_id=receptor_id).first()

            if relacion:
                conversacion_obj = relacion.conversacion
            else:
                conversacion_obj = Conversacion.objects.create(fechaInicio=timezone.now())
                ConvUsuario.objects.create(conversacion=conversacion_obj, usuario=request.user)
                psicologo_user = get_object_or_404(Usuario, numero=receptor_id)
                ConvUsuario.objects.create(conversacion=conversacion_obj, usuario=psicologo_user)

        nuevo_msg = Mensaje.objects.create(
            contenido=contenido,
            fechaEnvio=timezone.now(),
            conversacion=conversacion_obj,
            usuario=request.user
        )

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
        