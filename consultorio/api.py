# Crear conexion a flutter
from rest_framework import viewsets
from .models import Usuario
from .serializers import UsuarioSerializer

# Vistas para Flutter (API REST)
class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer