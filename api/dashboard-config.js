// ============================================
// API: Configuración segura para el Dashboard
// ============================================
// Las credenciales admin están protegidas en variables de entorno
// Solo retorna la configuración pública de Firebase

export default async function handler(req, res) {
    // Solo permitir GET
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    // Configuración pública de Firebase (segura porque está restringida por dominio)
    const firebaseConfig = {
        apiKey: "AIzaSyBo1G5H9ZLumIm2PwTtq_KRVIyeY05NuTc",
        authDomain: "glow-bcf37.firebaseapp.com",
        databaseURL: "https://glow-bcf37-default-rtdb.firebaseio.com",
        projectId: "glow-bcf37",
        storageBucket: "glow-bcf37.appspot.com",
        messagingSenderId: "114740390857076001773",
        appId: "1:114740390857076001773:web:8c5b5f6a3d8e9b2c1f4d"
    };

    // Retornar con headers de cache para evitar requests innecesarios
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).json(firebaseConfig);
}
