from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from zoneinfo import ZoneInfo
import datetime  
from datetime import date, timedelta
from datetime import datetime as dt
from django.db import transaction
from django.contrib.auth import logout
from django.contrib.auth import authenticate, login as auth_login
from models import Usuario, TipoUsuario, Paciente, Telefono, EdoCuenta, Sesion, Pago, Especialidad, Horario, Psicologo, HorPsicologo, Conversacion, Mensaje, ConvUsuario, Cita, Modalidad, EdoCita, Servicio, Consulta
from django.contrib.auth.hashers import make_password
from django.contrib import messages
from django.db.models import Q, Count
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
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

def lista_psicologos(request):
    # Capturar filtros del frontend
    search_query = request.GET.get('q', '')
    especialidad_id = request.GET.get('especialidad', '')
    solo_activos = request.GET.get('activos', 'false') == 'true'

    psicologos = Psicologo.objects.all()

    # Filtro por nombre o apellidos
    if search_query:
        psicologos = psicologos.filter(
            Q(usuario__nombrePila__icontains=search_query) | 
            Q(usuario__primerApellido__icontains=search_query)
        )

    # Filtro por especialidad
    if especialidad_id:
        psicologos = psicologos.filter(especialidad_id=especialidad_id)

    # Filtro por estado de cuenta
    if solo_activos:
        psicologos = psicologos.filter(usuario__estadoCuenta__nombre='Activo')

    # ... retornar a tu template ...

def tu_vista_admin(request):

    # 1. Traemos los datos de la base de datos
    horarios_qs = Horario.objects.all()
    
    # 2. Convertimos a lista de diccionarios (muy importante)
    horarios_list = list(horarios_qs.values('numero', 'nombre', 'dias', 'horas', 'icono', 'activo'))
    
    context = {
        'horarios_json': horarios_list, # Enviamos la lista al HTML
        # ... tus otros datos ...
    }
    return render(request, 'admin.html', context)

def obtener_o_crear_conversacion(user1, user2_id):
    # Buscamos una conversación donde participen exactamente ambos usuarios
    conversaciones_user1 = ConvUsuario.objects.filter(usuario=user1).values_list('conversacion', flat=True)
    
    # Buscamos si el usuario2 está en alguna de esas conversaciones
    conv_comun = ConvUsuario.objects.filter(
        conversacion__in=conversaciones_user1, 
        usuario_id=user2_id
    ).first()

    if conv_comun:
        return conv_comun.conversacion
    else:
        # Si no existe, la creamos
        nueva_conv = Conversacion.objects.create(fechaInicio=timezone.now())
        ConvUsuario.objects.create(conversacion=nueva_conv, usuario=user1)
        ConvUsuario.objects.create(conversacion=nueva_conv, usuario_id=user2_id)
        return nueva_conv
