from django.urls import path
from . import views
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api import UsuarioViewSet

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet, basename='usuario')

urlpatterns = [
    path('', views.index),
    path('login/', views.login),
    path('logout/', views.cerrar_sesion, name='logout'),
    path('paciente/', views.paciente, name='paciente'),
    path('registro/', views.registro),
    path('especialidad/', views.especialidades),
    path('guardar_especialidad/', views.guardar_especialidad, name='guardar_especialidad'),
    path('eliminar_especialidad/', views.eliminar_especialidad, name='eliminar_especialidad'),
    path('crear_o_editar_psicologo/', views.crear_o_editar_psicologo, name='crear_o_editar_psicologo'),
    path('dar_de_baja_psicologo/<int:id>/', views.dar_de_baja_psicologo, name='dar_de_baja_psicologo'),
    path('esp/', views.esp),
    # --- PANEL PSICÓLOGO ---
    path('obtener-mensajes-psicologo/', views.obtener_mensajes_psicologo, name='obtener_mensajes_psicologo'),
    path('api/chat/usuarios/', views.api_lista_usuarios_chat, name='api_usuarios_chat'),
    path('api/chat/enviar/', views.enviar_mensaje_chat, name='enviar_mensaje'),
    path('api/chat/mensajes/<int:usuario_id>/', views.obtener_mensajes, name='obtener_mensajes'),
    path('api/registrar_consulta/', views.registrar_consulta_api, name='registrar_consulta_api'),
    path('api/pacientes-detallada/', views.api_lista_pacientes_detallada, name='api_pacientes_detallada'),
    path('guardar_consulta/', views.guardar_consulta, name='guardar_consulta'),
    path('panel_psicologos/', views.panel_psicologos, name='panel_psicologos'),
    # Perfil y Cuenta
    path('cuenta/', views.cuenta, name='cuenta'),
    path('agendas/', views.agendas, name='agendas'),
    path('admin/', views.admin, name='admin'),
    path('api/dashboard/stats/', views.api_dashboard_stats),
    path('crear-admin/', views.crear_admin),
    path('desactivar-admin/', views.desactivar_admin, name='desactivar_admin'),
    path('editar-admin/', views.editar_admin, name='editar_admin'),
    path('guardar_horario/', views.guardar_horario, name='guardar_horario'),
    path('', include(router.urls)),
    path('api/login/', views.api_login), # Apunta a la nueva función Json
    path('api/registro-api/', views.api_registro_paciente), # Apunta a la nueva función Json
    # Paciente
    #path('panel_paciente/', views.panel_paciente, name='panel_paciente'),
    path('enviar_mensaje_paciente/', views.enviar_mensaje_paciente, name='enviar_mensaje_paciente'),
    path('obtener_mensajes_paciente/', views.obtener_mensajes_paciente, name='obtener_mensajes_paciente'),
    path('api/psicologos-disponibles/', views.api_psicologos_disponibles, name='api_psicologos_disponibles'),
]