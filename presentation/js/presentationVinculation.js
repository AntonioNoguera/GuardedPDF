import { loginTest } from './app_validations/auth_validations.js';

const Routes = Object.freeze({
    REGISTER_PAGE: '/html/auth/register_page.html',
    LOGIN_PAGE: '/html/auth/index.html',
    // otros routes
});

function freeNavigateTo(data) { 
    window.location.href = data;
}

function navigateTo (data, content) {
    switch (data) {
        case Routes.REGISTER_PAGE:
            console.log("ENtenr")
            if(loginTest(content)){
                freeNavigateTo(Routes.REGISTER_PAGE);
            }
            break;  // No olvides los breaks en los cases
        default:
            console.log("Not in a case");
    }
}


const App = {
    navigateTo,
    Routes,
    freeNavigateTo
};

// Exportar el objeto al ámbito global
window.App = App;
window.navigateTo = navigateTo;
window.Routes = Routes;
window.freeNavigateTo = freeNavigateTo;