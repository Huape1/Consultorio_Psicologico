from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Usuario, TipoUsuario, EdoCuenta, Telefono, Psicologo # Añade todos los que necesites

# Configuración básica para ver columnas en la lista
@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('numero', 'nombrePila', 'primerApellido', 'correo', 'tipoUsuario', 'estadoCuenta')
    search_fields = ('nombrePila', 'correo')

@admin.register(EdoCuenta)
class EdoCuentaAdmin(admin.ModelAdmin):
    list_display = ('clave', 'nombre', 'descripcion')

# Registro simple para los demás
admin.site.register(TipoUsuario)
admin.site.register(Telefono)
admin.site.register(Psicologo)