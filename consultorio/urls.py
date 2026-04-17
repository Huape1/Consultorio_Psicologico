from django.urls import path
from .views import index_web, pacientes_web, psicologo_web, admin_web, auth_movil, pacientes_movil, psicologos_movil, admin_movil
from rest_framework.routers import DefaultRouter
from .api import UsuarioViewSet
from django.conf import settings
from django.conf.urls.static import static

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
    # Auth
    path('api/login/', auth_movil.api_login), 
    path('api/registro-api/', auth_movil.api_registro_paciente),
    #Admin
    path('admin/stats/', admin_movil.api_admin_stats),
    path('api/admin/psychologists/', admin_movil.api_get_psychologists),
    path('api/admin/psychologists/create/', admin_movil.api_create_psychologist),
    path('admin/specialties/', admin_movil.api_get_specialties, name='api_get_specialties'),
    path('api/admin/psychologists/update/<int:pk>/', admin_movil.api_update_psychologist),
    path('api/admin/schedules/', admin_movil.api_get_schedules, name='api_get_schedules'),
    path('api/admin/schedules/manage/<int:pk>/', admin_movil.api_manage_schedule, name='api_manage_schedule'),
    path('api/admin/list-admins/', admin_movil.api_get_admins, name='api_get_admins'),
    path('api/admin/manage-admin/<int:pk>/', admin_movil.api_manage_admin, name='api_manage_admin'),
    path('api/auth/profile/', admin_movil.get_user_profile, name='get_profile'),
    path('api/auth/profile/update/', admin_movil.update_user_profile, name='update_profile'),
    #Pacientes
    path('api/paciente/dashboard/', pacientes_movil.get_paciente_dashboard, name='get_paciente_dashboard'),
    path('paciente/perfil/', pacientes_movil.get_paciente_data, name='paciente_perfil'),
    path('paciente/citas/', pacientes_movil.get_mis_citas),
    path('paciente/setup-agendar/', pacientes_movil.get_setup_agendar),
    path('paciente/agendar/', pacientes_movil.agendar_cita_api, name='agendar_cita'),
    path('api/paciente/perfils/', pacientes_movil.get_perfil_paciente),
    path('api/paciente/actualizar-perfil-api/', pacientes_movil.actualizar_perfil_api),
    #Psicologos
    path('api/psicologo/dashboard/', psicologos_movil.psicologo_dashboard, name='psicologo_dashboard'),
    path('api/psicologo/pacientes/', psicologos_movil.get_mis_pacientes), 
    path('api/psicologo/agenda/', psicologos_movil.get_agenda_diaria, name='get_agenda_diaria'),
    path('api/psicologo/perfil/', psicologos_movil.get_perfil_psicologo), 
    path('api/psicologo/actualizar-perfil/', psicologos_movil.actualizar_perfil_psicologo), 
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
