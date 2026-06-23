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
    const interesSelect = document.getElementById('interes');
    
    // Mensajes de error
    const nombreError = document.getElementById('nombre-error');
    const emailError = document.getElementById('email-error');
    const interesError = document.getElementById('interes-error');

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
    interesSelect.addEventListener('change', validateInteres);

    // ============================================
    // ENVÍO DEL FORMULARIO
    // ============================================
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validar todos los campos
        const isNombreValid = validateNombre();
        const isEmailValid = validateEmail();
        const isInteresValid = validateInteres();

        if (!isNombreValid || !isEmailValid || !isInteresValid) {
            // Enfocar el primer campo con error
            if (!isNombreValid) {
                nombreInput.focus();
            } else if (!isEmailValid) {
                emailInput.focus();
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
                // Éxito: mostrar mensaje de agradecimiento
                if (result.thankYouMessage) {
                    thankYouMessage.textContent = result.thankYouMessage;
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

})();