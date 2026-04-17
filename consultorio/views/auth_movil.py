from django.db import transaction
from django.contrib.auth import authenticate
from ..models import Usuario, TipoUsuario, Paciente, Telefono, EdoCuenta
from django.contrib.auth.hashers import make_password
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
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

@csrf_exempt
def api_registro_paciente(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Validación rápida de campos obligatorios
            if not data.get('fecha_nacimiento'):
                return JsonResponse({'error': 'La fecha de nacimiento es obligatoria'}, status=400)

            with transaction.atomic():
                # 1. Obtenemos las llaves foráneas necesarias
                # Asegúrate de que los nombres coincidan exactamente con tu BD
                tipo_paciente = TipoUsuario.objects.get(clave=1)
                estado_activo = EdoCuenta.objects.get(nombre__icontains='Activo') 
                
                # 2. Crear el Usuario
                usuario = Usuario.objects.create(
                    nombrePila=data.get('nombre'),
                    primerApellido=data.get('primer_apellido'),
                    segundoApellido=data.get('segundo_apellido', ''),
                    genero=data.get('genero'),
                    correo=data.get('correo'),
                    password=make_password(data.get('password')),
                    tipoUsuario=tipo_paciente,
                    estadoCuenta=estado_activo
                )

                # 3. Crear el registro de Paciente con la FECHA
                Paciente.objects.create(
                    usuario=usuario,
                    fechaNacimiento=data.get('fecha_nacimiento') # Formato YYYY-MM-DD
                )

                # 4. Crear el Teléfono
                telefono_data = data.get('telefono')
                if telefono_data:
                    Telefono.objects.create(
                        numTel=telefono_data,
                        usuario=usuario
                    )

            return JsonResponse({
                'status': 'success',
                'message': 'Registro exitoso y cuenta activa'
            }, status=201)

        except TipoUsuario.DoesNotExist:
            return JsonResponse({'error': 'Error de configuración: Tipo de usuario no encontrado'}, status=500)
        except EdoCuenta.DoesNotExist:
            return JsonResponse({'error': 'Error de configuración: Estado de cuenta "Activo" no encontrado'}, status=500)
        except Exception as e:
            # Imprime el error en la consola de Django para debuguear mejor
            print(f"Error en registro: {e}")
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Método no permitido'}, status=405)