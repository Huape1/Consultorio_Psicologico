from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('login/', views.login),
    path('registro/', views.registro),
    path('especialidad/', views.especialidades)
]