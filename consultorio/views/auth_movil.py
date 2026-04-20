from django.db import transaction
from django.contrib.auth import authenticate
from ..models import Usuario, TipoUsuario, Paciente, Telefono, EdoCuenta
from django.contrib.auth.hashers import make_password
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
import json
from django.http import JsonResponse
from django.contrib.auth import get_user_model
import locale
try:
    locale.setlocale(locale.LC_TIME, 'es_ES.UTF-8') # O 'es_ES' según tu server
except:
    pass
User = get_user_model()

@csrf_exempt  # <--- Esto le dice a Django: "No pidas cookie CSRF para esta función"
def api_registro_paciente(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Validación de correo existente para evitar el error de base de datos
            if Usuario.objects.filter(correo=data.get('correo')).exists():
                return JsonResponse({'error': 'El correo ya está registrado'}, status=400)

            with transaction.atomic():
                # Obtenemos los modelos necesarios
                tipo_paciente = TipoUsuario.objects.get(clave=1)
                # Usamos icontains por si en la BD dice "Activo" o "activo"
                estado_activo = EdoCuenta.objects.filter(nombre__icontains='Activo').first()
                
                if not estado_activo:
                    return JsonResponse({'error': 'Configuración de servidor: Estado de cuenta no encontrado'}, status=500)

                # 1. Crear el Usuario usando el Manager
                usuario = Usuario.objects.create_user(
                    correo=data.get('correo'),
                    password=data.get('password'),
                    nombrePila=data.get('nombre'),
                    primerApellido=data.get('primer_apellido'),
                    segundoApellido=data.get('segundo_apellido', ''),
                    genero=data.get('genero'),
                    tipoUsuario=tipo_paciente,
                    estadoCuenta=estado_activo
                )

                # 2. Crear el Paciente
                Paciente.objects.create(
                    usuario=usuario,
                    fechaNacimiento=data.get('fecha_nacimiento')
                )

                # 3. Crear el Teléfono
                num_tel = data.get('telefono')
                if num_tel:
                    Telefono.objects.create(numTel=num_tel, usuario=usuario)

            return JsonResponse({'status': 'success', 'message': 'Usuario creado correctamente'}, status=201)

        except Exception as e:
            print(f"Error interno: {str(e)}")
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Solo se permite POST'}, status=405)

@api_view(['POST'])
@permission_classes([AllowAny])
def api_login(request):
    correo = request.data.get('correo')
    password = request.data.get('password')
    user = authenticate(username=correo, password=password)
    
    if user is not None:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key, # <--- ¡VITAL!
            'user': { # <--- Envolvemos en 'user' para que Flutter lo encuentre
                'numero': user.pk,
                'nombrePila': user.nombrePila,
                'correo': user.correo,
                'tipoUsuario': user.tipoUsuario.pk if user.tipoUsuario else 1,
            }
        }, status=200)
    else:
        return Response({'error': 'Credenciales inválidas'}, status=401)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cambiar_password_universal(request):
    usuario = request.user  # Django ya sabe quién es por el Token
    nueva_pass = request.data.get('password')
    
    if not nueva_pass:
        return JsonResponse({"status": "error", "message": "Falta la contraseña"}, status=400)
    
    try:
        usuario.set_password(nueva_pass)
        usuario.save()
        return JsonResponse({"status": "success", "message": "Contraseña actualizada"})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=400)