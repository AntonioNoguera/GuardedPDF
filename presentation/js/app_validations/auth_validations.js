export function registerValidation(data) {

    if (!data.usuario) {
        return false
    }

    if (!data.nombreCompleto) {
        return false
    }

    if (!data.password) {
        return false
    }
  
    const userLevel = data.userLevel === "admin" ? 1 : 2;

    return true;
}

export function loginValidations(data) {

    const userId = data.usuario;
    const enteredPassword = data.password;
    
    if (!data.usuario) {
        return false;
    }

    if (!data.password) {
        return fase
    }

    return true;
}