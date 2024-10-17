//Use Case Agrupation for Users
export const userUseCase = {

    testConection : function() {
        alert("Actual Linked");
        eel.testConection()
    },

    createUser : function(userName, userFullName) { 
        if(eel.insertar_usuario(userName, userFullName, "password", "salt", 1).success){
            alert("Success")
        }else{
            alert("Failed")
        }
    }

}
