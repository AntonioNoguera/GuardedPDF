// Use Case Agrupation for Users, Files, and Merges
export const userUseCase = {

    // Test de conexión
    testConection: function() {
        alert("Actual Linked");
        eel.testConection();
    },

    // Crear nuevo usuario
    createUser: async function(userData) {
        console.log(userData);
        // Extraer los datos del usuario desde el objeto userData
        const userName = userData.usuario;
        const userFullName = userData.nombreCompleto;
        const password = userData.password;

        // Generar un salt aleatorio de 16 bytes
        const salt = window.crypto.getRandomValues(new Uint8Array(16));
        const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');

        // Hashear la contraseña con el salt
        const hashBuffer = await window.crypto.subtle.digest(
            "SHA-256",
            new TextEncoder().encode(password + saltHex)
        );
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        const userLevel = userData.userLevel === "admin" ? 1 : 2; // Asigna niveles según el rol

        eel.insertar_usuario(userName, userFullName, hashHex, saltHex, userLevel)((result) => {
            if (result.success) {
                alert("Success");
                document.getElementById('registerForm').reset();
            } else {
                console.log(result);
                alert("Error:" + result.message);
            }
        });
    },
 
    verifyUserPassword: async function(content) {
        try {
            const userId = content.usuario;
            const enteredPassword = content.password;
    
            if (!userId || !enteredPassword) {
                alert("Por favor ingrese usuario y contraseña.");
                return;
            }
    
            // Llamada a Eel para obtener el salt y la contraseña hasheada
            const result = await eel.obtener_salt_y_password(userId)();
            console.log(result);
    
            if (result.success) {
                const saltHex = result.salt;
                const storedHash = result.password;
    
                // Hashear la contraseña ingresada con el salt almacenado
                const hashBuffer = await window.crypto.subtle.digest(
                    "SHA-256",
                    new TextEncoder().encode(enteredPassword + saltHex)
                );
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
                if (hashHex === storedHash) {
                    alert("Password is correct");
                } else {
                    alert("Incorrect password");
                }
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error en la verificación:", error);
            alert("Ocurrió un error durante la verificación del usuario.");
        }
    },
    

    // Actualizar estado autorizado de usuario
    updateUserAuthorization: function(userId, isAuthorized) {
        eel.actualizar_usuario_autorizado(userId, isAuthorized).then(result => {
            alert(result.message);
        });
    },

    // Eliminar usuario
    deleteUser: function(userId) {
        eel.eliminar_usuario(userId).then(result => {
            alert(result.message);
        });
    },

    // Actualizar fecha de login del usuario
    updateLoginDate: function(userId) {
        eel.actualizar_fecha_login(userId).then(result => {
            alert(result.message);
        });
    }
};
