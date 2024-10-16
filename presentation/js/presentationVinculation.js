//Importing Presentation Validations
import { loginTest } from './app_validations/auth_validations.js';

//Importanting Data Methods
import { userUseCase } from './use_cases/users.js';

eel.testConection();

const Routes = Object.freeze({
    //NODOS DE RUTA DISPONIBLE

    REGISTER_PAGE: '/html/auth/register_page.html',
    LOGIN_PAGE: '/html/auth/index.html',

    FILES_PAGE: '../../html/merge_files/files_page.html',
    HISTORY_PAGE: '../../html/merge_files/history_page.html',
    MERGE_PAGE: '../../html/merge_files/merge_page.html',

    ADMIN_PAGE: '../../html/user_administration/user_admin_page.html',
});

function freeNavigateTo(data) { 
    window.location.href = data;
}

function navigateTo (data, content) {
    switch (data) {
        
        case Routes.REGISTER_PAGE:
            //el primer hace toda la logica de la ejecución

            //el segundo hace el llamado al "caso de uso"
            if(loginTest(content)){
                userUseCase.createUser("topName","topFullName");
                //freeNavigateTo(Routes.REGISTER_PAGE);
            }

            break;

        case Routes.LOGIN_PAGE:
             
            freeNavigateTo(Routes.LOGIN_PAGE); 

            break;

        case Routes.FILES_PAGE:
             
            freeNavigateTo(Routes.FILES_PAGE); 

            break; 
        
        case Routes.HISTORY_PAGE:
                
            freeNavigateTo(Routes.HISTORY_PAGE); 

            break;

        case Routes.MERGE_PAGE:
             
            freeNavigateTo(Routes.MERGE_PAGE); 

            break;

        case Routes.ADMIN_PAGE:
             
            freeNavigateTo(Routes.ADMIN_PAGE); 

            break;
    
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

