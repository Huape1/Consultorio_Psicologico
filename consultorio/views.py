from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'index.html')

def login(request):
    return render(request, 'login.html')

def registro(request):
    return render(request, 'registro.html')

def especialidades(request):
    return render(request, 'especialidades.html')

def esp(request):
    return render(request, 'esp.html')

#Pacientes
def paciente(request):
    return render(request, 'paciente/paciente.html')

#Psicologos
def panel(request):
    return render(request, 'psicologos/PANEL.html')

def mensajes(request):
    return render(request, 'psicologos/mensajes.html')

def cuenta(request):
    return render(request, 'psicologos/cuenta.html')

def agendas(request):
    return render(request, 'psicologos/agendas.html')

#Admin
def admin(request):
    return render(request, 'admin/admin.html')

#Inicio2
def login2(request):
    return render(request, 'login2.html')

def registro2(request):
    return render(request, 'registro2.html')