from django.urls import path
from . import views
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api import UsuarioViewSet
from django.conf import settings
from django.conf.urls.static import static

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
    #Flutter
    path('admin/stats/', views.api_admin_stats),
    path('api/admin/psychologists/', views.api_get_psychologists),
    path('api/admin/psychologists/create/', views.api_create_psychologist),
    path('admin/specialties/', views.api_get_specialties, name='api_get_specialties'),
    path('api/admin/psychologists/update/<int:pk>/', views.api_update_psychologist),
    path('api/admin/schedules/', views.api_get_schedules, name='api_get_schedules'),
    path('api/admin/schedules/manage/<int:pk>/', views.api_manage_schedule, name='api_manage_schedule'),
    path('api/admin/list-admins/', views.api_get_admins, name='api_get_admins'),
    path('api/admin/manage-admin/<int:pk>/', views.api_manage_admin, name='api_manage_admin'),
    path('api/auth/profile/', views.get_user_profile, name='get_profile'),
    path('api/auth/profile/update/', views.update_user_profile, name='update_profile'),
    path('api/paciente/dashboard/', views.get_paciente_dashboard, name='get_paciente_dashboard'),
    path('paciente/perfil/', views.get_paciente_data, name='paciente_perfil'),
    path('paciente/citas/', views.get_mis_citas),
    path('paciente/setup-agendar/', views.get_setup_agendar),
    path('paciente/agendar/', views.agendar_cita_api, name='agendar_cita'),
    path('api/paciente/perfils/', views.get_perfil_paciente),
    path('api/paciente/actualizar-perfil-api/', views.actualizar_perfil_api),
    path('api/psicologo/dashboard/', views.psicologo_dashboard, name='psicologo_dashboard'),
    path('api/psicologo/pacientes/', views.get_mis_pacientes), # Agregué api/
    path('api/psicologo/agenda/', views.get_agenda_diaria, name='get_agenda_diaria'),
    path('api/psicologo/perfil/', views.get_perfil_psicologo), # Agregué api/
    path('api/psicologo/actualizar-perfil/', views.actualizar_perfil_psicologo), # Agregué api/
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)