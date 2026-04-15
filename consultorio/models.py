from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# ========================
# TABLAS BASE
# ========================

class TipoUsuario(models.Model):
    clave = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nombre

class EdoCuenta(models.Model):
    clave = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50) # Ej. Activo, Inactivo, Bloqueado
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nombre

class UsuarioManager(BaseUserManager):
    def create_user(self, correo, password=None, **extra_fields):
        if not correo:
            raise ValueError('El correo es obligatorio')
        correo = self.normalize_email(correo)
        user = self.model(correo=correo, **extra_fields)
        user.set_password(password) # Esto encripta la contraseña
        user.save(using=self._db)
        return user

    def create_superuser(self, correo, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        from .models import TipoUsuario
        # Cambiamos 'nombreTipo' por 'nombre' que es el que pide tu modelo
        tipo_admin = TipoUsuario.objects.get_or_create(nombre="Administrador")[0]
        
        extra_fields.setdefault('tipoUsuario', tipo_admin)
        
        return self.create_user(correo, password, **extra_fields)

class Usuario(AbstractBaseUser, PermissionsMixin):
    numero = models.AutoField(primary_key=True)
    nombrePila = models.CharField(max_length=50)
    primerApellido = models.CharField(max_length=50)
    segundoApellido = models.CharField(max_length=50)
    genero = models.CharField(max_length=20)
    
    # El correo será el "username" para loguearse
    correo = models.EmailField(max_length=100, unique=True) 
    
    # Django ya maneja 'password', así que no necesitas 'contrasena'
    fotoPerfil = models.ImageField(upload_to='perfiles/', default='perfiles/default.png', blank=True, null=True)
    tipoUsuario = models.ForeignKey(TipoUsuario, on_delete=models.CASCADE)
    estadoCuenta = models.ForeignKey(EdoCuenta, on_delete=models.SET_NULL, null=True, blank=True)

    # Campos obligatorios para Django
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UsuarioManager()

    USERNAME_FIELD = 'correo' # Con esto te logueas
    REQUIRED_FIELDS = ['nombrePila', 'primerApellido'] # Lo que pide al crear superuser

    def __str__(self):
        return f"{self.nombrePila} {self.primerApellido}"


class Telefono(models.Model):
    numero = models.AutoField(primary_key=True)
    numTel = models.CharField(max_length=20)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)


# ========================
# CONVERSACIÓN Y MENSAJES
# ========================

class Conversacion(models.Model):
    numero = models.AutoField(primary_key=True)
    fechaInicio = models.DateTimeField()


class ConvUsuario(models.Model):
    conversacion = models.ForeignKey(Conversacion, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('conversacion', 'usuario')


class Mensaje(models.Model):
    numero = models.AutoField(primary_key=True)
    fechaEnvio = models.DateTimeField()
    contenido = models.TextField()
    conversacion = models.ForeignKey(Conversacion, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)


# ========================
# CATÁLOGOS
# ========================

class Especialidad(models.Model):
    clave = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre

class EdoCita(models.Model):
    clave = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    descripcion = models.TextField(blank=True, null=True)


class Modalidad(models.Model):
    clave = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    descripcion = models.TextField(blank=True, null=True)


class Servicio(models.Model):
    clave = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    # Nuevos campos
    especialidad = models.ForeignKey(Especialidad, on_delete=models.CASCADE, related_name='servicios')
    es_grupal_posible = models.BooleanField(default=False) # Si el servicio admite grupos
    max_personas = models.IntegerField(default=1)

    def __str__(self):
        return self.nombre


# ========================
# PSICÓLOGO Y HORARIOS
# ========================

class Psicologo(models.Model):
    numero = models.AutoField(primary_key=True)
    cedula = models.CharField(max_length=50)
    especialidad = models.ForeignKey(Especialidad, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)


class Horario(models.Model):
    numero = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100) # Ej: Turno Matutino
    dias = models.CharField(max_length=100)   # Ej: Lunes a Viernes
    horas = models.CharField(max_length=100)  # Ej: 08:00 AM - 02:00 PM
    icono = models.CharField(max_length=50, default='sun') # Slug para el icono
    activo = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nombre} ({self.horas})"


class HorPsicologo(models.Model):
    psicologo = models.ForeignKey(Psicologo, on_delete=models.CASCADE)
    horario = models.ForeignKey(Horario, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('psicologo', 'horario')


# ========================
# PACIENTE Y EXPEDIENTE
# ========================

class Paciente(models.Model):
    numero = models.AutoField(primary_key=True)
    fechaNacimiento = models.DateField()
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)


class Expediente(models.Model):
    numero = models.AutoField(primary_key=True)
    fechaCreacion = models.DateField()
    antecedentes = models.TextField()
    traumas = models.TextField()
    sintomas = models.TextField()
    evolucion = models.TextField()
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE)


# ========================
# GRUPOS Y RESEÑAS
# ========================

class GrupoTerapia(models.Model):
    numero = models.AutoField(primary_key=True)
    cantidad = models.IntegerField()


class GrupoPaciente(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE)
    grupoTerapia = models.ForeignKey(GrupoTerapia, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('paciente', 'grupoTerapia')


class Resena(models.Model):
    numero = models.AutoField(primary_key=True)
    fecha = models.DateField()
    comentario = models.TextField()
    calificacion = models.IntegerField()
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE)
    servicio = models.ForeignKey(Servicio, on_delete=models.CASCADE)


# ========================
# CITAS Y CONSULTAS
# ========================

class Cita(models.Model):
    numero = models.AutoField(primary_key=True)
    fecha = models.DateField()
    hora = models.TimeField()
    motivo = models.TextField()
    psicologo = models.ForeignKey(Psicologo, on_delete=models.CASCADE)
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE)
    servicio = models.ForeignKey(Servicio, on_delete=models.CASCADE)
    grupoTerapia = models.ForeignKey(GrupoTerapia, on_delete=models.CASCADE, null=True, blank=True)
    modalidad = models.ForeignKey(Modalidad, on_delete=models.CASCADE)
    estado = models.ForeignKey(EdoCita, on_delete=models.CASCADE)


class Consulta(models.Model):
    numero = models.AutoField(primary_key=True)
    notas = models.TextField()
    diagnostico = models.TextField()
    cita = models.ForeignKey(Cita, on_delete=models.CASCADE)


class Sesion(models.Model):
    numero = models.AutoField(primary_key=True)
    numSesion = models.IntegerField()
    observaciones = models.TextField()
    consulta = models.ForeignKey(Consulta, on_delete=models.CASCADE)


# ========================
# PAGOS Y FACTURAS
# ========================

class Pago(models.Model):
    codigo = models.AutoField(primary_key=True)
    fecha = models.DateField()
    hora = models.TimeField()
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    consulta = models.ForeignKey(Consulta, on_delete=models.CASCADE)


class Factura(models.Model):
    codigo = models.AutoField(primary_key=True)
    fechaEmision = models.DateField()
    total = models.DecimalField(max_digits=10, decimal_places=2)
    pago = models.ForeignKey(Pago, on_delete=models.CASCADE)