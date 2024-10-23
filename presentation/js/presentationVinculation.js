//Importing Presentation Validations
import { registerValidation, loginValidations } from './app_validations/auth_validations.js';

//Importing Data Methods
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
  

// Opciones de formato para la fecha con mes abreviado y formato 24h
const options = { 
    year: 'numeric', 
    month: 'short', // Abrevia el mes (Ejemplo: Ene, Feb, Mar)
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false // Usa formato de 24 horas
};

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
async function runUseCase(caseEndpoint, content) {  // Añadir async aquí
    
    switch (caseEndpoint) {
        case "addNewUser":
            if (registerValidation(content)) {
                await userUseCase.createUser(content);  // Añadir await aquí
            }
            break;
        
        case "tryLogin": 
            if (loginValidations(content)) {
                const isPasswordValid = await userUseCase.verifyUserPassword(content);  // Añadir await aquí
                if (isPasswordValid) {
                    freeNavigateTo(Routes.FILES_PAGE);
                }
            }
            break;

        case "getAllUsers": 
            try {
                const readedData = await userUseCase.getActiveAndInactiveUsers();  // Añadir await aquí
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
                    readedData.usuarios_activos.forEach((usuario) => {
                        // Crea una nueva fila
                        let row = document.createElement('tr');
                        let formattedDate = (new Date(usuario.user_created_at)).toLocaleDateString('es-ES', options); 
                        
                        // Define el contenido de la fila
                        row.innerHTML = `  
                            <td class="text-left">${usuario.user_fullname}</td>
                            <td class="text-left">${usuario.user_name}</td>
                            <td class="text-center">${formattedDate}</td>
                            <td class="text-center">${usuario.user_role_id}</td>
                            <td class="text-center">
                                <div class="row px-2">
                                    <div class="col-12 col-md-6 px-1">
                                        <button id="delete-${usuario.user_id}" class="btn btn-primary btn-sm w-100">Eliminar Usuario</button>
                                    </div>
                                    <div class="col-12 col-md-6 px-0">
                                        <button id="sleep-${usuario.user_id}" class="btn btn-secondary btn-sm w-90">Suspender Usuario</button>
                                    </div>
                                </div>
                            </td>
                        `;

                        // Agrega la fila a la tabla
                        tableActiveBody.appendChild(row); 

                        // Asigna un event listener al botón de "Eliminar"
                        document.getElementById(`delete-${usuario.user_id}`).addEventListener('click', async () => {  // Añadir async aquí
                            await userUseCase.deleteUser(usuario.user_id);  // Añadir await aquí
                            await runUseCase("getAllUsers");  // Añadir await aquí
                        });

                        // Asigna un event listener al botón de "Suspender"
                        document.getElementById(`sleep-${usuario.user_id}`).addEventListener('click', async () => {  // Añadir async aquí
                            await userUseCase.updateUserAuthorization(usuario.user_id, false);  // Añadir await aquí
                            await runUseCase("getAllUsers");  // Añadir await aquí
                        });
                    });

                    // Limpia cualquier contenido previo en el cuerpo de la tabla de peticiones
                    tablePetitionBody.innerHTML = '';
                    
                    // Recorre el arreglo de usuarios inactivos y genera las filas
                    readedData.usuarios_inactivos.forEach((usuario) => { 
                        let formattedDate = (new Date(usuario.user_created_at)).toLocaleDateString('es-ES', options); 
                        
                        // Crea una nueva fila
                        const row = document.createElement('tr');
                    
                        // Asigna un ID a la fila basada en el user_id
                        row.id = `row-${usuario.user_id}`;
                        
                        // Define el contenido de la fila
                        row.innerHTML = `  
                            <td class="text-left">${usuario.user_fullname}</td>
                            <td class="text-center">${usuario.user_name}</td>
                            <td class="text-center">${formattedDate}</td>
                            <td class="text-center">${usuario.user_role_id}</td>
                            <td class="text-center">
                                <div class="row px-2">
                                    <div class="col-12 col-md-6 px-0">
                                        <button id="accept-${usuario.user_id}" class="btn btn-primary btn-sm w-100">Aceptar</button>
                                    </div> 
                                    
                                    <div class="col-12 col-md-6 px-1">
                                        <button id="deleteAm-${usuario.user_id}" class="btn btn-secondary btn-sm w-100">Denegar</button>
                                    </div>
                                </div>
                            </td>`;
                    
                        // Agrega la fila a la tabla
                        tablePetitionBody.appendChild(row);
                    
                        // Asigna un event listener al botón de "Aceptar"
                        document.getElementById(`accept-${usuario.user_id}`).addEventListener('click', async () => {  // Añadir async aquí
                            await userUseCase.updateUserAuthorization(usuario.user_id, true);  // Añadir await aquí
                            await runUseCase("getAllUsers");  // Añadir await aquí
                        });
                    
                        // Asigna un event listener al botón de "Denegar"
                        document.getElementById(`deleteAm-${usuario.user_id}`).addEventListener('click', async () => {  // Añadir async aquí
                            await userUseCase.deleteUser(usuario.user_id);  // Añadir await aquí
                            await runUseCase("getAllUsers");  // Añadir await aquí
                        });
                    });
                } else {
                    console.error("No se recibieron datos");
                }
            } catch (error) {
                console.error("Error al obtener los usuarios activos e inactivos:", error);
            }
            break;

        case "getUserFiles" :
            //Readed from memory
            const UserId = 3;
            const getFiles = await fileUseCase.getFilesByUser(UserId);
            break;
        
        case "getAllFiles":
            const files = await fileUseCase.getAllFiles();

            console.log(files);

            break;

        case "insertFiles":
        
            const result = await fileUseCase.mergeOperation(content);
 
            break;
            

        default:
            alert("Unsupported action");
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
