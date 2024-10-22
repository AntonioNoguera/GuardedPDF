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

    getFilesByUser: async function(userId) {
        try {
            console.log("Solicitando archivos para el usuario:", userId);
            const result = await eel.seleccionar_archivos_por_usuario(userId)();

            if (result.success && result.files) {
                console.log("Archivos del usuario obtenidos:", result.files);
                const files = result.files;
                const container = document.getElementById('fileContainer');
                container.innerHTML = '';

                // Recorrer la lista de archivos
                files.forEach(file => {
                    console.log("Generando tarjeta para archivo:", file.file_title);
                    const colDiv = document.createElement('div');
                    colDiv.classList.add('col-md-4', 'd-flex');

                    const cardDiv = document.createElement('div');
                    cardDiv.classList.add('card', 'mb-3', 'w-100');

                    const cardBodyDiv = document.createElement('div');
                    cardBodyDiv.classList.add('card-body', 'd-flex', 'flex-column');

                    const title = document.createElement('h5');
                    title.classList.add('card-title');
                    title.textContent = file.file_title || 'Sin título';

                    const fileSize = document.createElement('p');
                    fileSize.classList.add('card-text');
                    fileSize.textContent = `Tamaño: Desconocido`;

                    const uploadDate = document.createElement('p');
                    uploadDate.classList.add('card-text');
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
                    
                    uploadDate.textContent = `Subido: ${fechaSubida}`;

                    const downloadButton = document.createElement('a');
                    downloadButton.href = `#`;
                    downloadButton.classList.add('btn', 'btn-primary', 'mt-auto');
                    downloadButton.textContent = 'Descargar';

                    cardBodyDiv.appendChild(title);
                    cardBodyDiv.appendChild(fileSize);
                    cardBodyDiv.appendChild(uploadDate);
                    cardBodyDiv.appendChild(downloadButton);

                    cardDiv.appendChild(cardBodyDiv);
                    colDiv.appendChild(cardDiv);

                    container.appendChild(colDiv);
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
    }
};
