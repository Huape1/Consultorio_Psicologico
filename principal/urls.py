from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('login/', views.login),
    path('registro/', views.registro),
    path('especialidad/', views.especialidades),
    path('panel/', views.panel),
    path('mensajes/', views.mensajes),
    path('cuenta/', views.cuenta),
    path('agendas/', views.agendas)
]