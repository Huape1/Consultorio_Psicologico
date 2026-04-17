from django.urls import path
from .views import index_web, pacientes_web, psicologo_web, admin_web, auth_movil, pacientes_movil, psicologos_movil, admin_movil
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api import UsuarioViewSet

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet, basename='usuario')

urlpatterns = [
    # --- INDEX ---
    path('', index_web.index),
    path('especialidad/', index_web.especialidades),
    path('login/', index_web.login),
    path('logout/', index_web.cerrar_sesion, name='logout'),
    path('registro/', index_web.registro),
    # --- PANEL PACIENTE ---
    #path('panel_paciente/', views.panel_paciente, name='panel_paciente'),
    path('paciente/', pacientes_web.paciente, name='paciente'),
    path('enviar_mensaje_paciente/', pacientes_web.enviar_mensaje_paciente, name='enviar_mensaje_paciente'),
    path('obtener_mensajes_paciente/', pacientes_web.obtener_mensajes_paciente, name='obtener_mensajes_paciente'),
    path('api/psicologos-disponibles/', pacientes_web.api_psicologos_disponibles, name='api_psicologos_disponibles'),
    # --- PANEL ADMIN ---
    path('admin/', admin_web.admin, name='admin'),
    path('guardar_especialidad/', admin_web.guardar_especialidad, name='guardar_especialidad'),
    path('eliminar_especialidad/', admin_web.eliminar_especialidad, name='eliminar_especialidad'),
    path('crear_o_editar_psicologo/', admin_web.crear_o_editar_psicologo, name='crear_o_editar_psicologo'),
    path('dar_de_baja_psicologo/<int:id>/', admin_web.dar_de_baja_psicologo, name='dar_de_baja_psicologo'),
    path('api/chat/usuarios/', admin_web.api_lista_usuarios_chat, name='api_usuarios_chat'),
    path('api/chat/enviar/', admin_web.enviar_mensaje_chat, name='enviar_mensaje'),
    path('api/chat/mensajes/<int:usuario_id>/', admin_web.obtener_mensajes, name='obtener_mensajes'),
    path('api/dashboard/stats/', admin_web.api_dashboard_stats),
    path('crear-admin/', admin_web.crear_admin),
    path('desactivar-admin/', admin_web.desactivar_admin, name='desactivar_admin'),
    path('editar-admin/', admin_web.editar_admin, name='editar_admin'),
    path('guardar_horario/', admin_web.guardar_horario, name='guardar_horario'),
    path('esp/', admin_web.esp), # Talvez la elimine
    # --- PANEL PSICÓLOGO ---
    path('cuenta/', psicologo_web.cuenta, name='cuenta'), #Talvez la elimine
    path('obtener-mensajes-psicologo/', psicologo_web.obtener_mensajes_psicologo, name='obtener_mensajes_psicologo'),
    path('api/pacientes-detallada/', psicologo_web.api_lista_pacientes_detallada, name='api_pacientes_detallada'),
    path('guardar_consulta/', psicologo_web.guardar_consulta, name='guardar_consulta'),
    path('panel_psicologos/', psicologo_web.panel_psicologos, name='panel_psicologos'), #Puede que lo elimine
    path('agendas/', psicologo_web.agendas, name='agendas'), #Puede que la elimine
    # |||| --- F L U T E R --- |||
    path('api/login/', auth_movil.api_login), 
    path('api/registro-api/', auth_movil.api_registro_paciente), 
]