// Use Case Agrupation for Users, Files, and Merges
export const userUseCase = {
    // Test de conexión
    testConection: function() {
        alert("Actual Linked");
        eel.testConection();
    },

    //Obtener ID y Nivel
    getUserInfo : async function(userName) { 
        try {
            const result = await eel.obtener_id_y_nivel_de_usuario(userName)();

            if (result.success) {
                console.log(result);
                localStorage.setItem('userPublicInfo', JSON.stringify(result.user)); 
            } else {
                console.log("Error on data read")
            }
            return result;
        } catch (error){
            console.log(error)
        }

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
            const userName = content.usuario;
            const enteredPassword = content.password;
    
            if (!userName || !enteredPassword) {
                alert("Por favor ingrese usuario y contraseña.");
                return false; // Retorna false si faltan datos
            }
    
            // Llamada a Eel para obtener el salt y la contraseña hasheada
            const result = await eel.obtener_salt_y_password(userName)();
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
                    await this.updateLoginDate(userName);

                    await this.getUserInfo(userName);
    
                    return true;  // Retorna true si todo es correcto
                } else {
                    alert("Contraseña Incorrecta");
                    return false;  // Retorna false si la contraseña es incorrecta
                }
            } else {
                alert("Usuario no encontrado");
            }
            
            return false;

        } catch (error) {
            console.error("Error en la verificación:", error);
            alert("Ocurrió un error durante la verificación del usuario.");
            return false;  // Retorna false si ocurre un error inesperado
        }
    },
    
    
    // Actualizar fecha de login del usuario
    updateLoginDate: async function(userId) {
        try {
            const result = await eel.actualizar_fecha_login(userId)(); 
        } catch (error) {
            console.error("Error al actualizar la fecha de login:", error); 
        }
    },

    // Actualizar estado autorizado de usuario
    updateUserAuthorization: (user_id, is_authorized) => {
        return eel.actualizar_usuario_autorizado(user_id, is_authorized)()
            .then((result) => {

                console.log(result);
                if (result === true) {
                    console.log("Autorización actualizada correctamente.");
                } else {
                    console.error("Error al actualizar la autorización:", result);
                }
                return result;
            })
            .catch((error) => {
                console.error("Error al llamar a la función Python:", error);
            });
    },

    // Eliminar usuario
    deleteUser: function(userId) {

        

        const user = JSON.parse(localStorage.getItem('userPublicInfo')) || {};
        console.log(user);

        console.log(userId + "es igual a? " + user.user_id);

        if(user.user_id === userId){
            alert("No puedes eliminar tu propio usuario");
        }else{
            eel.eliminar_usuario(userId)()
            .then(result => {
                return result;
            })
            .catch(error => {
                console.error("Error al eliminar el usuario:", error);
            }); 
        }

        
    },
    
    getActiveAndInactiveUsers: async function() {
        try {
            // Llamada correcta a la función expuesta de Eel (nota los paréntesis vacíos)
            const result = await eel.obtener_usuarios_activos_e_inactivos()();
            
            if (result.success) {

                return result;

            } else {

                alert(result.message);

            }
        } catch (error) {
            console.error("Error al obtener usuarios activos e inactivos:", error);
            alert("Ocurrió un error al obtener usuarios.");
        }
    },  
        
};
