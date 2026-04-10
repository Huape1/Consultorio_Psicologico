from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('login/', views.login),
    path('logout/', views.cerrar_sesion, name='logout'),
    path('paciente/', views.paciente),
    path('login2/', views.login2),
    path('registro2/', views.registro2),
    path('registro/', views.registro),
    path('especialidad/', views.especialidades),
    path('guardar_especialidad/', views.guardar_especialidad, name='guardar_especialidad'),
    path('eliminar_especialidad/', views.eliminar_especialidad, name='eliminar_especialidad'),
    path('crear_o_editar_psicologo/', views.crear_o_editar_psicologo, name='crear_o_editar_psicologo'),
    path('dar_de_baja_psicologo/<int:id>/', views.dar_de_baja_psicologo, name='dar_de_baja_psicologo'),
    path('esp/', views.esp),
    path('panel/', views.panel),
    path('mensajes/', views.mensajes),
    path('api/chat/usuarios/', views.api_lista_usuarios_chat, name='api_usuarios_chat'),
    path('api/chat/enviar/', views.enviar_mensaje_chat, name='enviar_mensaje'),
    path('api/chat/mensajes/<int:usuario_id>/', views.obtener_mensajes, name='obtener_mensajes'),
    path('cuenta/', views.cuenta),
    path('agendas/', views.agendas),
    path('admin/', views.admin, name='admin'),
    path('api/dashboard/stats/', views.api_dashboard_stats),
    path('crear-admin/', views.crear_admin),
    path('desactivar-admin/', views.desactivar_admin, name='desactivar_admin'),
    path('editar-admin/', views.editar_admin, name='editar_admin'),
    path('guardar_horario/', views.guardar_horario, name='guardar_horario')
]