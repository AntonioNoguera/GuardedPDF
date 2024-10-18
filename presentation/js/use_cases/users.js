// Use Case Agrupation for Users, Files, and Merges
export const userUseCase = {
    
    // Test de conexión
    testConection: function() {
        alert("Actual Linked");
        eel.testConection();
    },

    // Crear nuevo usuario
    createUser: function(userName, userFullName) { 
        if(eel.insertar_usuario(userName, userFullName, "password", "salt", 1).success) {
            alert("Success");
        } else {
            alert("Failed");
        }
    },

    // Obtener salt y contraseña del usuario
    getUserSaltAndPassword: function(userId) {
        eel.obtener_salt_y_password(userId).then(result => {
            if (result.success) {
                console.log("Salt:", result.salt, "Password:", result.password);
            } else {
                alert(result.message);
            }
        });
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