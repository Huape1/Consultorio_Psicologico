from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('login/', views.login),
    path('paciente/', views.paciente),
    path('login2/', views.login2),
     path('registro2/', views.registro2),
    path('registro/', views.registro),
    path('especialidad/', views.especialidades),
    path('esp/', views.esp),
    path('panel/', views.panel),
    path('mensajes/', views.mensajes),
    path('cuenta/', views.cuenta),
    path('agendas/', views.agendas),
    path('admins/', views.admin)
]