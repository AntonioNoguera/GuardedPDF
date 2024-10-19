export function registerValidation(data) {
    const userName = data.usuario;
    const userFullName = data.nombreCompleto;
    const password = data.password;
    const userLevel = data.userLevel === "admin" ? 1 : 2;

    return true;
}

export function loginValidations(data) {

    const userId = data.usuario;
    const enteredPassword = data.password;
    
    return true;
}