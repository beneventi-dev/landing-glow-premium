// ============================================
// API: Envío de Leads a Correos y Google Sheets
// ============================================

export default async function handler(req, res) {
    // Solo aceptar POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        const { nombre, email, interes, timestamp } = req.body;

        // Validar datos obligatorios
        if (!nombre || !email || !interes) {
            return res.status(400).json({ 
                error: 'Faltan campos obligatorios: nombre, email, e interés' 
            });
        }

        // ============================================
        // 1. CLASIFICAR EL INTERÉS (Para el asunto)
        // ============================================
        const interesMap = {
            'rutina-facial': 'Rutina Facial Completa',
            'anti-edad': 'Tratamiento Anti-Edad',
            'maquillaje': 'Maquillaje Clean',
            'vip': '⭐ ASESORÍA VIP ⭐'
        };

        const interesLabel = interesMap[interes] || interes;
        const asunto = `[LEAD - GLOW] ${interesLabel} - ${nombre}`;

        // ============================================
        // 2. CONFIGURAR DESTINATARIOS (desde .env)
        // ============================================
        const recipients = process.env.EMAIL_RECIPIENTS 
            ? process.env.EMAIL_RECIPIENTS.split(',').map(email => email.trim())
            : ['ventas@glow.cl']; // Fallback por defecto

        // ============================================
        // 3. ENVIAR CORREO (con Nodemailer)
        // ============================================
        const nodemailer = require('nodemailer');

        // Configurar transporte SMTP
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_PORT === '465', // true para 465
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        // Construir cuerpo del correo
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #7A2E3B; color: white; padding: 20px; text-align: center; border-radius: 12px 12px 0 0; }
                    .content { background: #F9F6F0; padding: 30px; border-radius: 0 0 12px 12px; }
                    .field { margin-bottom: 16px; }
                    .label { font-weight: 600; color: #2C2824; }
                    .value { color: #7A2E3B; font-weight: 500; }
                    .badge { display: inline-block; background: #C9A96E; color: white; padding: 4px 12px; border-radius: 100px; font-size: 0.8rem; }
                    .footer { text-align: center; color: #88847E; font-size: 0.8rem; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h2>✨ GLOW · Nuevo Lead</h2>
                </div>
                <div class="content">
                    <p><strong>¡Tienes un nuevo contacto!</strong></p>
                    
                    <div class="field">
                        <span class="label">👤 Nombre:</span>
                        <span class="value">${nombre}</span>
                    </div>
                    
                    <div class="field">
                        <span class="label">📧 Correo:</span>
                        <span class="value">${email}</span>
                    </div>
                    
                    <div class="field">
                        <span class="label">🎯 Interés:</span>
                        <span class="badge">${interesLabel}</span>
                    </div>
                    
                    <div class="field">
                        <span class="label">🕐 Fecha:</span>
                        <span class="value">${new Date(timestamp).toLocaleString('es-CL', { timeZone: 'America/Santiago' })}</span>
                    </div>
                    
                    <hr style="margin: 24px 0; border: none; border-top: 1px solid #E8D5A3;">
                    
                    <p style="font-size: 0.95rem; color: #2C2824;">
                        <strong>📍 Los Ángeles, Chile</strong><br>
                        Este lead viene de la landing page GLOW.
                    </p>
                </div>
                <div class="footer">
                    <p>GLOW · Serum Facial Premium · Los Ángeles, Chile</p>
                </div>
            </body>
            </html>
        `;

        const mailOptions = {
            from: process.env.EMAIL_SENDER || 'no-reply@glow.cl',
            to: recipients.join(', '),
            subject: asunto,
            html: htmlContent,
            text: `Nuevo lead de GLOW\n\nNombre: ${nombre}\nCorreo: ${email}\nInterés: ${interesLabel}\nFecha: ${new Date(timestamp).toLocaleString('es-CL')}`
        };

        // Enviar correo
        await transporter.sendMail(mailOptions);

        // ============================================
        // 4. GUARDAR EN GOOGLE SHEETS (Opcional)
        // ============================================
        // Si tienes configurado Google Sheets, descomenta esta sección
        /*
        const { google } = require('googleapis');
        const sheets = google.sheets('v4');
        
        const auth = new google.auth.GoogleAuth({
            credentials: {
                private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheetsClient = await auth.getClient();
        const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

        await sheets.spreadsheets.values.append({
            auth: sheetsClient,
            spreadsheetId: spreadsheetId,
            range: 'Leads!A:E',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[
                    new Date(timestamp).toLocaleString('es-CL', { timeZone: 'America/Santiago' }),
                    nombre,
                    email,
                    interesLabel,
                    'Pendiente'
                ]]
            }
        });
        */

        // ============================================
        // 5. RESPONDER CON ÉXITO
        // ============================================
        const thankYouMessage = process.env.THANK_YOU_MESSAGE || 
            'Hemos recibido tu solicitud de asesoría. En los próximos 5 minutos, una de nuestras expertas en belleza revisará tu perfil y te enviará un diagnóstico personalizado.';

        return res.status(200).json({
            success: true,
            message: 'Lead enviado correctamente',
            thankYouMessage: thankYouMessage
        });

    } catch (error) {
        console.error('Error en API:', error);
        return res.status(500).json({
            error: 'Error interno del servidor',
            details: error.message
        });
    }
}