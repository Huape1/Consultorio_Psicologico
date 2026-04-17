from django.db import transaction
from django.contrib.auth import authenticate
from ..models import Usuario, TipoUsuario, Paciente, Telefono, EdoCuenta
from django.contrib.auth.hashers import make_password
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
from django.contrib.auth import get_user_model
import locale
try:
    locale.setlocale(locale.LC_TIME, 'es_ES.UTF-8') # O 'es_ES' según tu server
except:
    pass
User = get_user_model()

@csrf_exempt
def api_login(request):
    if request.method == 'POST':
        # Flutter envía JSON, así que lo leemos así:
        try:
            data = json.loads(request.body)
            correo_login = data.get('correo')
            password_login = data.get('password')
        except:
            # Si mandas los datos como Form Data en lugar de JSON
            correo_login = request.POST.get('correo')
            password_login = request.POST.get('password')

        user = authenticate(request, username=correo_login, password=password_login)

        if user is not None:
            estado = getattr(user.estadoCuenta, 'nombre', user.estadoCuenta)
            
            if str(estado).lower() != 'activo':
                return JsonResponse({'error': 'Cuenta inactiva'}, status=403)

            # En lugar de auth_login (que es para sesiones de navegador), 
            # simplemente devolvemos los datos del usuario.
            return JsonResponse({
                'token': 'session_token_temporal', # Aquí luego pondremos un JWT real
                'user': {
                    'numero': user.numero,
                    'nombrePila': user.nombrePila,
                    'primerApellido': user.primerApellido,
                    'segundoApellido': user.segundoApellido,
                    'correo': user.correo,
                    'tipoUsuario': user.tipoUsuario_id,
                    'genero': user.genero,
                }
            }, status=200)
        else:
            return JsonResponse({'error': 'Credenciales inválidas'}, status=401)
            
    return JsonResponse({'error': 'Método no permitido'}, status=405)

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