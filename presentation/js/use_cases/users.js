//Use Case Agrupation for Users

export const userUseCase = {

    testConection : function() {
        alert("Actual Linked");
        eel.testConection()
    },

    createUser : function(userName, userFullName) {
        alert("Create userAttemp")
        eel.insertar_usuario(userName, userFullName, "password", "salt", 1)
    }

}
