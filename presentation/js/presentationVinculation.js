
//Importing Presentation Validations
import { registerValidation, loginValidations } from './app_validations/auth_validations.js';

//Importanting Data Methods
import { userUseCase } from './use_cases/users.js';
import { fileUseCase } from './use_cases/files.js';
import { mergeUseCase } from './use_cases/merges.js';

const Routes = Object.freeze({ 
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

//Navigations
function navigateTo (data, content) {
    switch (data) {
        
        case Routes.REGISTER_PAGE: 

            freeNavigateTo(Routes.REGISTER_PAGE);

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



// UseCaseAplications
function runUseCase( caseEndpoint, content ) {
    
    switch (caseEndpoint) {
        
        case "addNewUser" :
            if (registerValidation(content)) {
                userUseCase.createUser(content);
            }
            
            break;
        
        case "tryLogin" : 
            if (loginValidations(content)) {
                if (userUseCase.verifyUserPassword(content)) {
                    freeNavigateTo(Routes.FILES_PAGE);
                }
            }

            break;

        case "getAllUsers" :
            userUseCase.getActiveAndInactiveUsers()
                .then((readedData) => {
                    if (readedData) {
                        console.log(readedData);
                    
                        // Actualiza el texto de los botones con los contadores
                        document.getElementById('activeUserBtn').innerHTML = "Usuarios Activos ( " + readedData.usuarios_activos.length + " )";
                        document.getElementById('newPetitionsBtn').innerHTML = "Nuevas Peticiones ( " + readedData.usuarios_inactivos.length + " )";
                    
                        // Selecciona el cuerpo de la tabla de usuarios activos
                        const tableActiveBody = document.querySelector('#table_active tbody');
                        
                        const tablePetitionBody = document.querySelector('#table_petitions tbody');
                        
                        // Limpia cualquier contenido previo en el cuerpo de la tabla
                        tableActiveBody.innerHTML = '';
                    
                        // Recorre el arreglo de usuarios activos y genera las filas
                        readedData.usuarios_activos.forEach((usuario, index) => {
                            // Crea una nueva fila
                            const row = document.createElement('tr');
                            
                            // Define el contenido de la fila
                            row.innerHTML = ` 
                                <td class="text-center">${usuario.user_id}</td>
                                <td class="text-left">${usuario.user_fullname}</td>
                                <td class="text-center">${usuario.user_name}</td>
                                <td class="text-center">${usuario.user_created_at ? usuario.user_created_at : 'Date Null'}</td>
                                <td class="text-center">${usuario.user_role_id ? 'Admin' : 'N'}</td>
                                <td class="text-center">
                                    <a href="#" class="btn btn-primary btn-sm w-45">Aceptar</a>
                                    <a href="#" class="btn btn-secondary btn-sm w-45">Denegar</a>
                                </td>
                            `;
                            
                            // Agrega la fila a la tabla
                            tableActiveBody.appendChild(row);
                        });

                        // Limpia cualquier contenido previo en el cuerpo de la tabla
                        tablePetitionBody.innerHTML = '';
                    
                        // Recorre el arreglo de usuarios activos y genera las filas
                        readedData.usuarios_inactivos.forEach((usuario, index) => {

                            // Crea una nueva fila
                            const row = document.createElement('tr');
                            
                            // Define el contenido de la fila
                            row.innerHTML = ` 
                                <td class="text-center">${usuario.user_id}</td>
                                <td class="text-left">${usuario.user_fullname}</td>
                                <td class="text-center">${usuario.user_name}</td>
                                <td class="text-center">${usuario.user_created_at ? usuario.user_created_at : 'Date Null'}</td>
                                <td class="text-center">${usuario.user_role_id ? 'Admin' : 'N'}</td>
                                <td class="text-center">
                                    <a href="#" class="btn btn-primary btn-sm w-45">Aceptar</a>
                                    <a href="#" class="btn btn-secondary btn-sm w-45">Denegar</a>
                                </td>
                            `;
                            
                            // Agrega la fila a la tabla
                            tablePetitionBody.appendChild(row);
                        });
                    
                    } else {
                        console.error("No se recibieron datos");
                    }
                })
                .catch((error) => {
                    console.error("Error al obtener los usuarios activos e inactivos:", error);
                });
            break;

        default :
            alert("Unsoported ");
            break;
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
window.runUseCase = runUseCase;