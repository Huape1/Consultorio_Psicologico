from django.db import models

# Create your models here.
from django.db import models

# ========================
# TABLAS BASE
# ========================

class TipoUsuario(models.Model):
    clave = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nombre


class Usuario(models.Model):
    numero = models.AutoField(primary_key=True)
    nombrePila = models.CharField(max_length=50)
    primerApellido = models.CharField(max_length=50)
    segundoApellido = models.CharField(max_length=50)
    genero = models.CharField(max_length=20)
    correo = models.EmailField(max_length=100)
    contrasena = models.CharField(max_length=100)
    fotoPerfil = models.TextField(blank=True, null=True)
    tipoUsuario = models.ForeignKey(TipoUsuario, on_delete=models.CASCADE)

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


class EdoPsicologo(models.Model):
    clave = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    descripcion = models.TextField(blank=True, null=True)


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


# ========================
# PSICÓLOGO Y HORARIOS
# ========================

class Psicologo(models.Model):
    numero = models.AutoField(primary_key=True)
    cedula = models.CharField(max_length=50)
    especialidad = models.ForeignKey(Especialidad, on_delete=models.CASCADE)
    estado = models.ForeignKey(EdoPsicologo, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)


class Horario(models.Model):
    numero = models.AutoField(primary_key=True)
    dias = models.CharField(max_length=50)
    horas = models.CharField(max_length=50)


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