from rest_framework import serializers
from .models import Usuario, Psicologo # Importa tus modelos

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        # Elige los campos que quieres enviar a Flutter
        fields = ['numero', 'nombrePila', 'primerApellido', 'correo', 'fotoPerfil', 'tipoUsuario']

class PsicologoSerializer(serializers.ModelSerializer):
    # Puedes incluir el serializer de usuario para ver los datos completos
    datos_usuario = UsuarioSerializer(source='usuario', read_only=True)

    class Meta:
        model = Psicologo
        fields = ['cedula', 'especialidad', 'datos_usuario']