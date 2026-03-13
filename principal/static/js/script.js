// ==================== //
// Datos de Especialidades
// ==================== //
const especialidades = [
    {
        id: 1,
        titulo: "Terapia Individual",
        descripcion: "Un espacio seguro y confidencial diseñado para explorar tus pensamientos, emociones y comportamientos. Nuestros especialistas te acompañarán en el proceso de autoconocimiento y resolución de conflictos personales, ayudándote a construir una vida más plena y equilibrada.",
        duracion: "50 Minutos",
        modalidad: "Online / Presencial",
        dirigidoA: "Adultos y Adolescentes",
        precio: "$600 MXN / Sesión",
        experiencias: [
            {
                nombre: "Mariana López",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
                comentario: '"Me ha ayudado muchísimo a entender mi ansiedad. Me siento escuchada y con herramientas reales para mi día a día."',
                rating: 5
            },
            {
                nombre: "Carlos Ruiz",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
                comentario: '"Excelente profesionalismo. El proceso ah sido trasformador. Muy recomendado para quien busca crecer."',
                rating: 5
            },
            {
                nombre: "Ana Paulo J.",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
                comentario: '"Al principio tenia dudas, pero la calidez del trato me hizo sentir cómoda desde la primera sesión."',
                rating: 4
            }
        ]
    },
    {
        id: 2,
        titulo: "Terapia de Pareja",
        descripcion: "Un espacio terapéutico diseñado para mejorar la comunicación, resolver conflictos y fortalecer el vínculo emocional entre ambos miembros de la pareja. El objetivo es construir relaciones más saludables, basadas en el respeto, la comprensión y el apoyo mutuo.",
        duracion: "50 Minutos",
        modalidad: "Online / Presencial",
        dirigidoA: "Parejas que enfrentan conflictos, dificultades de comunicación o que desean fortalecer su relación.",
        precio: "$700 MXN / Sesión",
        experiencias: [
            {
                nombre: "Roberto y María",
                avatar: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=100&h=100&fit=crop&crop=face",
                comentario: '"Aprendimos a comunicarnos de una forma que nunca imaginamos. Nuestra relación mejoró significativamente."',
                rating: 5
            },
            {
                nombre: "Andrea S.",
                avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
                comentario: '"Las sesiones nos dieron herramientas prácticas para resolver conflictos sin caer en discusiones."',
                rating: 5
            },
            {
                nombre: "Luis y Carmen",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
                comentario: '"Gracias a la terapia pudimos salvar nuestra relación. Muy agradecidos con el profesionalismo."',
                rating: 5
            }
        ]
    },
    {
        id: 3,
        titulo: "Psicología Infantil",
        descripcion: "Atención psicológica especializada para niños y adolescentes, enfocada en el desarrollo emocional, conductual y social. Se trabaja en conjunto con los padres para apoyar el bienestar del menor y fortalecer su desarrollo.",
        duracion: "45 Minutos",
        modalidad: "Presencial / Online (según edad)",
        dirigidoA: "Niños y adolescentes con dificultades emocionales, conductuales, escolares o sociales.",
        precio: "$550 MXN / Sesión",
        experiencias: [
            {
                nombre: "Patricia G.",
                avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&crop=face",
                comentario: '"Mi hijo mejoró mucho su comportamiento en la escuela. El enfoque fue muy apropiado para su edad."',
                rating: 5
            },
            {
                nombre: "Fernando M.",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                comentario: '"La terapeuta supo conectar con mi hija de inmediato. Ahora maneja mejor sus emociones."',
                rating: 5
            },
            {
                nombre: "Gabriela R.",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
                comentario: '"Excelente atención. Mi niño ahora tiene más confianza en sí mismo."',
                rating: 4
            }
        ]
    },
    {
        id: 4,
        titulo: "Terapia Familiar",
        descripcion: "Un proceso terapéutico orientado a mejorar la comunicación y las relaciones entre los miembros de la familia. Se abordan conflictos familiares, cambios importantes o problemas que afectan la convivencia y el bienestar familiar.",
        duracion: "60 Minutos",
        modalidad: "Presencial / Online",
        dirigidoA: "Familias que desean mejorar su convivencia, resolver conflictos o fortalecer sus relaciones.",
        precio: "$750 MXN / Sesión",
        experiencias: [
            {
                nombre: "Familia Hernández",
                avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop&crop=face",
                comentario: '"La terapia nos ayudó a entendernos mejor como familia. Ahora hay más armonía en casa."',
                rating: 5
            },
            {
                nombre: "Rosa Elena T.",
                avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face",
                comentario: '"Pudimos resolver conflictos que llevábamos años arrastrando. Muy recomendado."',
                rating: 5
            },
            {
                nombre: "Jorge P.",
                avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
                comentario: '"El terapeuta supo guiarnos con paciencia. Nuestra comunicación mejoró muchísimo."',
                rating: 5
            }
        ]
    },
    {
        id: 5,
        titulo: "Psicooncología",
        descripcion: "Apoyo psicológico especializado para personas que enfrentan un diagnóstico de cáncer y sus familiares. Se brinda acompañamiento emocional durante el tratamiento, ayudando a manejar el estrés, el miedo y las dificultades emocionales asociadas a la enfermedad.",
        duracion: "50 Minutos",
        modalidad: "Online / Presencial",
        dirigidoA: "Pacientes con cáncer, sobrevivientes y familiares que requieren apoyo emocional.",
        precio: "$650 MXN / Sesión",
        experiencias: [
            {
                nombre: "María del Carmen",
                avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face",
                comentario: '"El apoyo durante mi tratamiento fue fundamental. Me ayudó a mantener una actitud positiva."',
                rating: 5
            },
            {
                nombre: "Eduardo V.",
                avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
                comentario: '"Como familiar, la terapia me dio herramientas para acompañar a mi madre en su proceso."',
                rating: 5
            },
            {
                nombre: "Lucía F.",
                avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
                comentario: '"Me sentí acompañada en todo momento. El profesionalismo y la empatía fueron excepcionales."',
                rating: 5
            }
        ]
    },
    {
        id: 6,
        titulo: "Psicopatología",
        descripcion: "Evaluación y tratamiento psicológico de trastornos mentales como ansiedad, depresión, trastornos del estado de ánimo y otros problemas emocionales. Se utilizan técnicas terapéuticas basadas en evidencia para mejorar la salud mental y la calidad de vida.",
        duracion: "50 Minutos",
        modalidad: "Online / Presencial",
        dirigidoA: "Personas que presentan trastornos psicológicos o dificultades emocionales que afectan su vida diaria.",
        precio: "$650 MXN / Sesión",
        experiencias: [
            {
                nombre: "Alejandro M.",
                avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face",
                comentario: '"El diagnóstico preciso me permitió entender lo que me pasaba. El tratamiento ha sido muy efectivo."',
                rating: 5
            },
            {
                nombre: "Diana L.",
                avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop&crop=face",
                comentario: '"Después de años sin entender mi ansiedad, por fin encontré un tratamiento que funciona."',
                rating: 5
            },
            {
                nombre: "Ricardo S.",
                avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop&crop=face",
                comentario: '"Profesionales muy capacitados. Mi calidad de vida ha mejorado significativamente."',
                rating: 4
            }
        ]
    }
];

// ==================== //
// Inicialización
// ==================== //
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar iconos de Lucide
    lucide.createIcons();
    
    // Añadir animación de entrada a las cards
    animateCardsOnScroll();
});

// ==================== //
// Funciones del Modal
// ==================== //
function openModal(id) {
    const especialidad = especialidades.find(e => e.id === id);
    if (!especialidad) return;

    // Actualizar contenido del modal
    document.getElementById('modalTitle').textContent = especialidad.titulo;
    document.getElementById('modalDescription').textContent = especialidad.descripcion;
    document.getElementById('modalDuracion').textContent = especialidad.duracion;
    document.getElementById('modalModalidad').textContent = especialidad.modalidad;
    document.getElementById('modalDirigido').textContent = especialidad.dirigidoA;
    document.getElementById('modalPrecio').textContent = especialidad.precio;

    // Generar testimonios
    const testimoniosContainer = document.getElementById('testimoniosContainer');
    testimoniosContainer.innerHTML = especialidad.experiencias.map(exp => `
        <div class="testimonio">
            <div class="testimonio-header">
                <img src="${exp.avatar}" alt="${exp.nombre}" class="testimonio-avatar">
                <div class="testimonio-info">
                    <div class="testimonio-top">
                        <span class="testimonio-nombre">${exp.nombre}</span>
                        <div class="testimonio-stars">
                            ${generateStars(exp.rating)}
                        </div>
                    </div>
                    <p class="testimonio-texto">${exp.comentario}</p>
                </div>
            </div>
        </div>
    `).join('');

    // Mostrar modal con animación
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.add('active');
    
    // Bloquear scroll del body
    document.body.style.overflow = 'hidden';
    
    // Reinicializar iconos de Lucide en el modal
    lucide.createIcons();
}

function closeModal(event) {
    // Si se hace clic en el overlay (no en el modal), cerrar
    if (event && event.target !== event.currentTarget) return;
    
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.remove('active');
    
    // Restaurar scroll del body
    document.body.style.overflow = '';
}

// Cerrar modal con tecla Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// ==================== //
// Función para generar estrellas
// ==================== //
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<svg class="filled" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
        } else {
            stars += '<svg class="empty" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
        }
    }
    return stars;
}

// ==================== //
// Animaciones
// ==================== //
function animateCardsOnScroll() {
    const cards = document.querySelectorAll('.card');
    
    // Configurar observer para animación al hacer scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Añadir delay escalonado para cada card
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Aplicar estilos iniciales y observar cada card
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
}

// ==================== //
// Efecto hover en botones
// ==================== //
document.querySelectorAll('.btn-info, .btn-login, .btn-agendar').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});
