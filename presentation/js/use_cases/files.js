const options = { 
    year: 'numeric', 
    month: 'short', // Abrevia el mes (Ejemplo: Ene, Feb, Mar)
    day: 'numeric',  
    hour: '2-digit',
    minute: '2-digit',
    hour12: false // Usa formato de 24 horas
};

// Mostrar el contenedor cuando sea necesario 
function mostrarPDF() {
    console.log("Mostrando el contenedor de PDF");
    const container = document.getElementById('pdfViewerContainer');
    container.style.display = 'block';

    // Detener la propagación del clic en el contenedor del PDF
    container.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    // Agregar un evento que cierre el contenedor si se hace clic fuera de él
    function cerrarPDF(event) {
        const pdfViewer = document.getElementById('pdfViewerContainer');
        if (!pdfViewer.contains(event.target)) {
            console.log("Cerrando el visor de PDF al hacer clic fuera");
            pdfViewer.style.display = 'none';
            document.removeEventListener('click', cerrarPDF); // Removemos el event listener
        }
    }

    // Asegúrate de que el evento de clic solo cierre si es fuera del contenedor
    setTimeout(() => {
        document.addEventListener('click', cerrarPDF);
    }, 0); // Retrasa la adición del listener hasta que la apertura esté completa
}


export const fileUseCase = {

    // Insertar un nuevo archivo
    createFile: function(title, description, createdBy, visibleForAll = false, isMerge = false) {
        console.log("Insertando archivo:", title, description, createdBy, visibleForAll, isMerge);
        eel.insertar_archivo(title, description, createdBy, visibleForAll, isMerge).then(result => {
            console.log("Resultado de la inserción:", result);
            alert(result.message);
        });
    },

    // Seleccionar todos los archivos
    getAllFiles: async function() {
        try {
            console.log("Solicitando todos los archivos...");
            const result = await eel.seleccionar_todos_archivos()();

            if (result.success) {
                console.log("Archivos obtenidos:", result.files);
                const files = result.files;
            
                const tableBody = document.querySelector('table tbody'); // Selecciona el cuerpo de la tabla
                console.log("Generando filas para la tabla");
            
                // Contenedor donde se mostrará el iframe
                const pdfViewerContainer = document.getElementById('pdfViewerContainer');  // Asegúrate de tener este contenedor en tu HTML
            
                // Iterar sobre cada archivo y crear una fila
                files.forEach(file => {
                    console.log("Procesando archivo:", file.file_title);

                    const row = document.createElement('tr');
            
                    let formattedDate = file.file_created_at ? (new Date(file.file_created_at)).toLocaleDateString('es-ES', options) : "No disponible"; 
                    let authorName = file.file_created_by || "Autor desconocido"; // Verifica si hay autor
            
                    // Usamos innerHTML para insertar directamente el contenido de cada fila
                    row.innerHTML = `
                        <td>${file.file_title}</td>
                        <td>${authorName}</td>
                        <td class="text-center">${formattedDate}</td>
                        <td class="text-center">${file.file_visible_for_all ? "Sí" : "No"}</td>
                        <td class="text-center">${file.file_is_merge ? "Sí" : "No"}</td>
                        <td class="text-center">
                            <a href="#" class="btn btn-primary btn-sm w-45" id="viewFile-${file.file_id}">Ver Archivo</a>
                        </td>`;
                    
                    // Añadir la fila al cuerpo de la tabla
                    tableBody.appendChild(row);
                    console.log("Fila añadida a la tabla");

                    // Agregar evento click al botón
                    document.getElementById(`viewFile-${file.file_id}`).addEventListener('click', function(event) {
                        event.preventDefault();
                        console.log("Se hizo clic en 'Ver Archivo' para:", file.file_title);

                        // Verifica si el archivo tiene contenido
                        if (file.file_blob) {
                            console.log("Cargando archivo PDF en el iframe:", file.file_title);
                            pdfViewerContainer.style.display = 'inline-block';

                            // Cargar el PDF en el iframe
                            const pdfData = 'data:application/pdf;base64,' + file.file_blob;
                            const iframe = document.getElementById('pdfFrame');
                            iframe.src = pdfData;
                            mostrarPDF();
                        } else {
                            console.log("El archivo no tiene contenido disponible:", file.file_title);
                            alert('El archivo no está disponible.');
                        }
                    });
                });
            } else {
                console.log("Error al obtener archivos:", result.message);
                alert(result.message);
            }

        } catch (error){
            console.log("Error en la obtención de archivos", error);
        }   
    },

    getFilesByUser: async function() {

        try {
            const user = JSON.parse(localStorage.getItem('userPublicInfo')) || {};

            const result = await eel.seleccionar_archivos_por_usuario(user.user_id)();

            console.log("id usuario consultado; ", user.user_id);

            if (result.success && result.files) {

                console.log("Archivos del usuario obtenidos:", result.files);
                const files = result.files;
                const container = document.getElementById('fileContainer');
                container.innerHTML = '';

                files.forEach(file => {
                    console.log("Generando tarjeta para archivo:", file.file_title);

                    // Crear la columna (colDiv) directamente con un 'div' contenedor
                    const colDiv = document.createElement('div');
                    colDiv.classList.add('col-md-4', 'd-flex', 'small-card', 'my-2');

                    // Formatear la fecha de subida
                    const fechaSubida = file.file_created_at ? 
                        new Date(file.file_created_at).toLocaleDateString('es-ES', { 
                            day: '2-digit', 
                            month: 'short', 
                            year: 'numeric' 
                        }) + ' / ' + 
                        new Date(file.file_created_at).toLocaleTimeString('es-ES', { 
                            hour: '2-digit', 
                            minute: '2-digit',  
                            hour12: false 
                        }) 
                        : 'Fecha desconocida';
                    
                    const size_formatted = (file.file_size / 8000) + "KB";

                    // Usar template string para generar el HTML de la tarjeta
                    colDiv.innerHTML = `
                        <div class="card mb-3 w-100">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title">${file.file_title || 'Sin título'}</h5>
                                <p class="card-text">Tamaño: ${size_formatted}</p>
                                <p class="card-text">Autor: ${file.file_created_by}</p>
                                <p class="card-text">Subido: ${fechaSubida}</p>
                                <a href="#" class="btn btn-primary mt-auto" id="viewFile-${file.file_id}"> Ver Archivo </a>
                            </div>
                        </div>
                    `;

                    // Añadir la tarjeta al contenedor principal
                    container.appendChild(colDiv);


                    // Agregar evento click al botón
                    document.getElementById(`viewFile-${file.file_id}`).addEventListener('click', function(event) {
                        event.preventDefault();
                        console.log("Se hizo clic en 'Ver Archivo' para:", file.file_title);

                        // Verifica si el archivo tiene contenido
                        if (file.file_blob) {
                            console.log("Cargando archivo PDF en el iframe:", file.file_title);
                            pdfViewerContainer.style.display = 'inline-block';

                            // Cargar el PDF en el iframe
                            const pdfData = 'data:application/pdf;base64,' + file.file_blob;
                            const iframe = document.getElementById('pdfFrame');
                            iframe.src = pdfData;
                            mostrarPDF();
                        } else {
                            console.log("El archivo no tiene contenido disponible:", file.file_title);
                            alert('El archivo no está disponible.');
                        }
                    });
                });

                console.log("Archivos cargados correctamente");

                return result;

            } else {

                throw new Error(result.message || "No se pudieron obtener los archivos.");
            
            }

        } catch (error) {
            console.error("Error en la selección de archivos:", error);
            alert("Problemas en la selección de archivos");
        }
    },

    // Eliminar un archivo
    deleteFile: function(fileId) {
        console.log("Eliminando archivo:", fileId);
        eel.eliminar_archivo(fileId).then(result => {
            console.log("Resultado de la eliminación:", result);
            alert(result.message);
        });
    },

    mergeOperation: async function (merginFiles) {

        console.log("Merge Routine");
        console.log(merginFiles);

        var mergeSize = 0;
        
        try {
            // Inicializar una variable para representar el resultado de la unión (puede ser una cadena o un buffer dependiendo de los datos)
            var mergeResult = []; 

            const user = JSON.parse(localStorage.getItem('userPublicInfo')) || {};

            console.log(user);
    
            // Iterar sobre cada archivo en merginFiles
            for (let file of merginFiles.files) {
                try {
                    console.log("Trying to insert", file.size);
    
                    // Aquí puedes procesar cada archivo y "unir" su contenido como parte del mergeResult
                    mergeResult.push( file.data );  // Ejemplo simple de procesamiento (concatena nombres)

                    // Insertar en la base de datos con eel (sin callback)
                    let response = await eel.insertar_archivo(file.name, "descripción", user.user_id, false, false, file.data, file.size.toString())();
                    if (response.status === "success") {
                        console.log("Archivo insertado correctamente:", file.name);
                    } else {
                        console.log("Error al insertar archivo:", file.name);
                    }

                    mergeSize += file.size;

                } catch (error) {
                    console.log("Error al insertar archivo:", file.name, "Error:", error);
                    // No detener el ciclo, solo registrar el error y continuar
                    continue;
                }
            }
    
            // Lógica para manejar el resultado final de la unión de archivos (mergeResult)
            console.log("Merge completado:", mergeResult);
    
            console.log("Registrando merge...");
    
            // Insertar la operación de "UNION" en la base de datos
            const merge64 = await eel.merge_pdfs(mergeResult)();

            await eel.insertar_archivo(merginFiles.title, merginFiles.description ,user.user_id, true, merginFiles.isVisibleForAll, merge64, mergeSize.toString() )();

        } catch (error) {
            console.log("Something went wrong with the merge:", error);
        }
    },

    insertMergeMembers : function() {

    },
};