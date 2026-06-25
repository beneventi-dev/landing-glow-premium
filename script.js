// ============================================
// GLOW - Formulario Inteligente
// ============================================

(function() {
    'use strict';

    // Elementos del DOM
    const form = document.getElementById('lead-form');
    const successDiv = document.getElementById('form-success');
    const thankYouMessage = document.getElementById('thank-you-message');
    
    // Campos
    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const telefonoInput = document.getElementById('telefono');
    const interesSelect = document.getElementById('interes');

    // Mensajes de error
    const nombreError = document.getElementById('nombre-error');
    const emailError = document.getElementById('email-error');
    const telefonoError = document.getElementById('telefono-error');
    const interesError = document.getElementById('interes-error');

    // ============================================
    // ACTUALIZADOR DE INDICADOR DE HORA
    // ============================================

    function actualizarIndicadorHora() {
        const ahora = new Date();
        const hora = ahora.getHours();
        const timeGradient = document.querySelector('.time-gradient');
        const solIcon = document.getElementById('sol-icon');
        const lunaIcon = document.getElementById('luna-icon');
        const celestialSvg = document.getElementById('celestial-body');

        let gradientColor = 'rgba(201, 169, 110, 0.4)';
        let textColor = '#FFD700';

        // Determinar hora del día y colores
        if (hora >= 5 && hora < 8) {
            // Amanecer: Rosa/Naranja
            gradientColor = 'rgba(255, 140, 100, 0.5)';
            textColor = '#FF8C64';
            solIcon.style.display = 'block';
            lunaIcon.style.display = 'none';
            celestialSvg.style.color = textColor;
        } else if (hora >= 8 && hora < 12) {
            // Mañana: Amarillo brillante
            gradientColor = 'rgba(255, 215, 0, 0.5)';
            textColor = '#FFD700';
            solIcon.style.display = 'block';
            lunaIcon.style.display = 'none';
            celestialSvg.style.color = textColor;
        } else if (hora >= 12 && hora < 17) {
            // Tarde: Amarillo cálido
            gradientColor = 'rgba(255, 200, 0, 0.5)';
            textColor = '#FFC800';
            solIcon.style.display = 'block';
            lunaIcon.style.display = 'none';
            celestialSvg.style.color = textColor;
        } else if (hora >= 17 && hora < 19) {
            // Atardecer: Naranja/Rojo
            gradientColor = 'rgba(255, 100, 80, 0.5)';
            textColor = '#FF6450';
            solIcon.style.display = 'block';
            lunaIcon.style.display = 'none';
            celestialSvg.style.color = textColor;
        } else {
            // Noche: Azul/Morado
            gradientColor = 'rgba(100, 150, 200, 0.4)';
            textColor = '#6B8BC4';
            solIcon.style.display = 'none';
            lunaIcon.style.display = 'block';
            celestialSvg.style.color = textColor;
        }

        // Actualizar el gradiente
        if (timeGradient) {
            timeGradient.style.background = `radial-gradient(circle at 0% 0%, ${gradientColor} 0%, transparent 60%)`;
        }
    }

    // ============================================
    // SALUDOS DINÁMICOS SEGÚN HORA Y CLIMA
    // ============================================

    const saludosPorHora = {
        manana: {
            frio: [
                "Buenos días, es un día frío en Los Ángeles. Tu piel necesita hidratación profunda hoy.",
                "Buen día, el clima frío requiere cuidados especiales. Descubre nuestro serum premium.",
                "Mañana fría en Los Ángeles, ¿lista para transformar tu rutina de belleza?"
            ],
            templado: [
                "Buenos días, es un día perfecto en Los Ángeles para comenzar tu rutina.",
                "Buen día, tu piel merece los mejores cuidados esta mañana.",
                "Mañana hermosa en Los Ángeles, el momento ideal para tu asesoría de belleza."
            ],
            caluroso: [
                "Buenos días, en este día de calor, tu piel necesita protección premium.",
                "Buen día, después del calor, la hidratación es tu mejor aliada.",
                "Mañana calurosa en Los Ángeles, ¿lista para un serum que te cuide?"
            ]
        },
        tarde: {
            frio: [
                "Buenas tardes, es un día frío en Los Ángeles. Tu piel te pide cuidados premium.",
                "Por la tarde fría, tu rutina de belleza es más importante que nunca.",
                "Tarde fresca en Los Ángeles, momento perfecto para tu diagnóstico personalizado."
            ],
            templado: [
                "Buenas tardes, es el momento ideal para cuidar tu piel en Los Ángeles.",
                "Por la tarde, descubre los secretos de una piel radiante.",
                "Tarde hermosa en Los Ángeles, tu rutina de belleza te espera."
            ],
            caluroso: [
                "Buenas tardes, después de este día de calor, tu piel merece nuestro serum.",
                "Por la tarde calurosa, hidratación profunda es lo que necesitas.",
                "Tarde ardiente en Los Ángeles, ¿lista para cuidados de lujo?"
            ]
        },
        noche: {
            frio: [
                "Buenas noches, es un día frío en Los Ángeles. Tu rutina nocturna es sagrada.",
                "Por la noche fría, dedícate a ti con nuestro serum premium.",
                "Noche fresca en Los Ángeles, el momento perfecto para tu tratamiento facial."
            ],
            templado: [
                "Buenas noches, es hora de cuidar tu piel en Los Ángeles.",
                "Por la noche, tu piel se regenera. Dale los mejores cuidados.",
                "Noche hermosa en Los Ángeles, tu rutina de belleza te espera."
            ],
            caluroso: [
                "Buenas noches, después de este día de calor, descansa tu piel con lujo.",
                "Por la noche, hidratación profunda para reparar el daño del calor.",
                "Noche cálida en Los Ángeles, ¿lista para tu tratamiento premium?"
            ]
        }
    };

    async function obtenerClimaYSaludo() {
        try {
            // Coordenadas de Los Ángeles, Chile
            const lat = -37.4667;
            const lon = -72.3333;

            // Obtener clima con Open-Meteo (sin API key)
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=America/Santiago`
            );

            if (!response.ok) throw new Error('Error obteniendo clima');

            const data = await response.json();
            const temperatura = data.current.temperature_2m;

            // Determinar si es frío, templado o caluroso
            let tipoClima = 'templado';
            if (temperatura < 15) {
                tipoClima = 'frio';
            } else if (temperatura > 25) {
                tipoClima = 'caluroso';
            }

            // Determinar hora del día
            const ahora = new Date();
            const hora = ahora.getHours();
            let tiempoDelDia = 'tarde';
            if (hora >= 6 && hora < 12) {
                tiempoDelDia = 'manana';
            } else if (hora >= 12 && hora < 18) {
                tiempoDelDia = 'tarde';
            } else {
                tiempoDelDia = 'noche';
            }

            // Seleccionar saludo random
            const saludosDisponibles = saludosPorHora[tiempoDelDia][tipoClima];
            const saludoRandom = saludosDisponibles[Math.floor(Math.random() * saludosDisponibles.length)];

            return saludoRandom;

        } catch (error) {
            // Fallback: solo usar hora
            console.warn('No se pudo obtener clima, usando fallback:', error);

            const ahora = new Date();
            const hora = ahora.getHours();
            let tiempoDelDia = 'tarde';
            if (hora >= 6 && hora < 12) {
                tiempoDelDia = 'manana';
            } else if (hora >= 12 && hora < 18) {
                tiempoDelDia = 'tarde';
            } else {
                tiempoDelDia = 'noche';
            }

            // Saludos genéricos sin clima
            const saludosGeneral = {
                manana: ['Buenos días, tu piel te está pidiendo cuidados premium.', 'Buen día, ¿lista para transformar tu rutina?', 'Mañana de belleza en Los Ángeles.'],
                tarde: ['Buenas tardes, es el momento para cuidar tu piel.', 'Por la tarde, descubre los secretos de una piel radiante.', 'Tarde de lujo en Los Ángeles.'],
                noche: ['Buenas noches, dedícate a ti con nuestro serum premium.', 'Por la noche, tu piel se regenera.', 'Noche de belleza en Los Ángeles.']
            };

            const saludoRandom = saludosGeneral[tiempoDelDia][Math.floor(Math.random() * saludosGeneral[tiempoDelDia].length)];
            return saludoRandom;
        }
    }

    // ============================================
    // VALIDACIÓN EN TIEMPO REAL
    // ============================================
    
    function validateNombre() {
        const value = nombreInput.value.trim();
        if (value.length < 2) {
            nombreInput.closest('.form-group').classList.add('error');
            nombreError.classList.add('visible');
            return false;
        }
        nombreInput.closest('.form-group').classList.remove('error');
        nombreError.classList.remove('visible');
        return true;
    }

    function validateEmail() {
        const value = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            emailInput.closest('.form-group').classList.add('error');
            emailError.classList.add('visible');
            return false;
        }
        emailInput.closest('.form-group').classList.remove('error');
        emailError.classList.remove('visible');
        return true;
    }

    function validateTelefono() {
        const value = telefonoInput.value.trim();
        const telefonoRegex = /^(\+?56)?[\s]?9[\s]?(\d{4})[\s]?(\d{4})$/;
        if (!telefonoRegex.test(value)) {
            telefonoInput.closest('.form-group').classList.add('error');
            telefonoError.classList.add('visible');
            return false;
        }
        telefonoInput.closest('.form-group').classList.remove('error');
        telefonoError.classList.remove('visible');
        return true;
    }

    function validateInteres() {
        const value = interesSelect.value;
        if (!value) {
            interesSelect.closest('.form-group').classList.add('error');
            interesError.classList.add('visible');
            return false;
        }
        interesSelect.closest('.form-group').classList.remove('error');
        interesError.classList.remove('visible');
        return true;
    }

    // Validación en blur (cuando el usuario sale del campo)
    nombreInput.addEventListener('blur', validateNombre);
    emailInput.addEventListener('blur', validateEmail);
    telefonoInput.addEventListener('blur', validateTelefono);
    interesSelect.addEventListener('change', validateInteres);

    // ============================================
    // PERSONALIZACIÓN DEL SITIO
    // ============================================

    function personalizarSitio(nombre) {
        // SECCIÓN 1: HERO
        const heroCta = document.querySelector('#hero .cta-primary');
        if (heroCta) {
            heroCta.innerHTML = `Tu ritual personalizado, ${nombre} <span class="cta-arrow">→</span>`;
        }

        // SECCIÓN 2: BENEFICIOS
        const beneficiosTitulo = document.querySelector('#beneficios .section-title');
        if (beneficiosTitulo) {
            beneficiosTitulo.innerHTML = `¿Por qué estás cambiando tu rutina,<br><span class="highlight">${nombre}?</span>`;
        }

        // SECCIÓN 3: TESTIMONIOS
        const testimoniosTitulo = document.querySelector('#testimonios .section-title');
        if (testimoniosTitulo) {
            testimoniosTitulo.innerHTML = `Lo que dicen nuestras clientas<br><span class="highlight">(y pronto tú también, ${nombre})</span>`;
        }

        // SECCIÓN 4: FORMULARIO (se reemplazará si ya contactó)
        const formHeader = document.querySelector('.form-header h2');
        if (formHeader) {
            formHeader.textContent = `¡Estamos listos, ${nombre}!`;
        }

        const formHeaderParrafo = document.querySelector('.form-header p');
        if (formHeaderParrafo) {
            formHeaderParrafo.textContent = `Tu diagnóstico personalizado te espera, ${nombre}. Cuéntanos un poco más para refinar tu rutina ideal.`;
        }
    }

    // ============================================
    // DETECTAR USUARIO EXISTENTE
    // ============================================

    function mostrarMensajeYaContactado(nombre) {
        // Ocultar formulario
        form.style.display = 'none';

        // Mostrar mensaje de "ya contactado"
        successDiv.classList.remove('hidden');

        // Personalizar el mensaje
        thankYouMessage.innerHTML = `
            ✓ Recibimos tu mensaje, <strong>${nombre}</strong>.<br><br>
            Ahora nos toca a nosotros contactarte. Revisaremos tu perfil en los próximos minutos
            y te enviaremos un diagnóstico personalizado.
        `;
    }

    function verificarUsuarioExistente() {
        const userNombre = localStorage.getItem('userNombre');
        if (userNombre) {
            personalizarSitio(userNombre);
            mostrarMensajeYaContactado(userNombre);
        }
    }

    // Inyectar saludo dinámico en el sitio
    async function inyectarSaludoDinamico() {
        const saludo = await obtenerClimaYSaludo();

        // Inyectar en el subtitle del hero
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) {
            // Agregar saludo como párrafo adicional elegante
            const saludoElement = document.createElement('p');
            saludoElement.className = 'hero-saludo-dinamico';
            saludoElement.textContent = saludo;
            heroSubtitle.parentElement.insertBefore(saludoElement, heroSubtitle.nextSibling);
        }
    }

    // Cargar personalización si ya existe un usuario en localStorage
    window.addEventListener('DOMContentLoaded', function() {
        verificarUsuarioExistente();
        inyectarSaludoDinamico();
        actualizarIndicadorHora();
    });

    // ============================================
    // ENVÍO DEL FORMULARIO
    // ============================================
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validar todos los campos
        const isNombreValid = validateNombre();
        const isEmailValid = validateEmail();
        const isTelefonoValid = validateTelefono();
        const isInteresValid = validateInteres();

        if (!isNombreValid || !isEmailValid || !isTelefonoValid || !isInteresValid) {
            // Enfocar el primer campo con error
            if (!isNombreValid) {
                nombreInput.focus();
            } else if (!isEmailValid) {
                emailInput.focus();
            } else if (!isTelefonoValid) {
                telefonoInput.focus();
            } else if (!isInteresValid) {
                interesSelect.focus();
            }
            return;
        }

        // Deshabilitar el formulario mientras se envía
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        // Construir datos
        const formData = {
            nombre: nombreInput.value.trim(),
            email: emailInput.value.trim(),
            telefono: telefonoInput.value.trim(),
            interes: interesSelect.value,
            timestamp: new Date().toISOString()
        };

        try {
            // Enviar a la API de Vercel
            const response = await fetch('/api/send-lead', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                // Guardar nombre en localStorage para personalización
                const nombrePrimero = formData.nombre.split(' ')[0];
                localStorage.setItem('userNombre', nombrePrimero);

                // Personalizar el sitio con el nombre
                personalizarSitio(nombrePrimero);

                // Mostrar mensaje de agradecimiento personalizado
                if (result.thankYouMessage) {
                    thankYouMessage.innerHTML = `¡Hola <strong>${nombrePrimero}</strong>!<br><br>${result.thankYouMessage}`;
                }

                form.style.display = 'none';
                successDiv.classList.remove('hidden');

                // Scroll suave al éxito
                successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                // Error del servidor
                alert('Hubo un problema al enviar tu mensaje. Por favor, intenta de nuevo o contáctanos por WhatsApp.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión. Por favor, verifica tu internet o intenta más tarde.');
        } finally {
            // Restaurar botón
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });

    // ============================================
    // ENLACE "ENVIAR OTRO MENSAJE" - Limpiar localStorage
    // ============================================

    function setupResetContactoHandler() {
        const resetLink = document.getElementById('reset-contacto');
        if (resetLink) {
            resetLink.addEventListener('click', function(e) {
                e.preventDefault();
                // Limpiar localStorage
                localStorage.removeItem('userNombre');

                // Recargar la página para mostrar el formulario nuevamente
                location.reload();
            });
        }
    }

    window.addEventListener('DOMContentLoaded', function() {
        setupResetContactoHandler();
    });

    // ============================================
    // UTILITY: Añadir clase para animación
    // ============================================
    // Al cargar la página, animar elementos
    document.addEventListener('DOMContentLoaded', function() {
        // Pequeño efecto de fade para las secciones
        const sections = document.querySelectorAll('#beneficios, #testimonios, #formulario');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(section);
        });
    });

    // ============================================
    // DARK MODE NOCTURNO
    // ============================================

    function verificarYMostrarBotoNocturno() {
        const ahora = new Date();
        const hora = ahora.getHours();
        const nightCareBtn = document.getElementById('night-care-btn');
        const isDarkModeActive = localStorage.getItem('darkModeActive') === 'true';

        // Mostrar botón si es noche (19:00 a 05:00)
        if ((hora >= 19 || hora < 5) && nightCareBtn) {
            nightCareBtn.style.display = 'block';
        }

        // Si dark mode estaba activo, mantenerlo
        if (isDarkModeActive) {
            document.body.classList.add('dark-mode');
            mostrarToggleDarkMode();
        }
    }

    window.activarDarkMode = function() {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkModeActive', 'true');
        document.getElementById('night-care-btn').style.display = 'none';
        mostrarToggleDarkMode();
        mostrarTooltip();
    };

    window.desactivarDarkMode = function() {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkModeActive', 'false');
        document.getElementById('dark-mode-toggle').classList.add('hidden');
        verificarYMostrarBotoNocturno();
    };

    function mostrarToggleDarkMode() {
        const toggle = document.getElementById('dark-mode-toggle');
        if (toggle) {
            toggle.classList.remove('hidden');
        }
    }

    function mostrarTooltip() {
        const tooltip = document.getElementById('dark-mode-tooltip');
        if (tooltip) {
            tooltip.classList.remove('hidden');
        }
    }

    window.cerrarTooltip = function() {
        const tooltip = document.getElementById('dark-mode-tooltip');
        if (tooltip) {
            tooltip.classList.add('hidden');
        }
    };

    // Inicializar dark mode al cargar
    window.addEventListener('DOMContentLoaded', verificarYMostrarBotoNocturno);
    verificarYMostrarBotoNocturno();

})();