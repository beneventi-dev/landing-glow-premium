// Configuración pública de Firebase (segura porque está restringida por dominio)
// Esta configuración es pública y está en el cliente, pero está protegida por:
// 1. Restricción de dominio en Google Cloud Console
// 2. Reglas de seguridad en Firebase (solo usuarios autenticados pueden acceder)

export const firebaseConfig = {
    apiKey: "AIzaSyAnbD6zUJZp7Ps-Z3KLp_1YQ0bL4nT8KvI",
    authDomain: "glow-bcf37.firebaseapp.com",
    databaseURL: "https://glow-bcf37-default-rtdb.firebaseio.com",
    projectId: "glow-bcf37",
    storageBucket: "glow-bcf37.appspot.com",
    messagingSenderId: "114740390857076001773",
    appId: "1:114740390857076001773:web:8c5b5f6a3d8e9b2c1f4d"
};
