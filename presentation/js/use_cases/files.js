export const fileUseCase = {

    // Insertar un nuevo archivo
    createFile: function(title, description, createdBy, visibleForAll = false, isMerge = false) {
        eel.insertar_archivo(title, description, createdBy, visibleForAll, isMerge).then(result => {
            alert(result.message);
        });
    },

    // Seleccionar todos los archivos
    getAllFiles: function() {
        eel.seleccionar_todos_archivos().then(result => {
            if (result.success) {
                console.log("Files:", result.files);
            } else {
                alert(result.message);
            }
        });
    },

    getFilesByUser: async function(userId) {
        try {
            // Llamada a eel para obtener los archivos
            const result = await eel.seleccionar_archivos_por_usuario(userId)();

            // Verificar si la llamada fue exitosa
            if (result.success && result.files) {
                const files = result.files; // Obtener la lista de archivos
                const container = document.getElementById('fileContainer');  // Obtener el contenedor
                container.innerHTML = '';  // Limpiar el contenido anterior si existe

                // Recorrer la lista de archivos
                files.forEach(file => {
                    // Crear la columna
                    const colDiv = document.createElement('div');
                    colDiv.classList.add('col-md-4', 'd-flex');

                    // Crear la tarjeta
                    const cardDiv = document.createElement('div');
                    cardDiv.classList.add('card', 'mb-3', 'w-100');

                    // Crear el cuerpo de la tarjeta
                    const cardBodyDiv = document.createElement('div');
                    cardBodyDiv.classList.add('card-body', 'd-flex', 'flex-column');

                    // Crear el título de la tarjeta (el nombre del archivo)
                    const title = document.createElement('h5');
                    title.classList.add('card-title');
                    title.textContent = file.file_title || 'Sin título';  // Usar el nombre del archivo o 'Sin título'

                    // Crear el párrafo del tamaño (placeholder)
                    const fileSize = document.createElement('p');
                    fileSize.classList.add('card-text');
                    fileSize.textContent = `Tamaño: Desconocido`;  // Placeholder para tamaño

                    // Crear el párrafo de la fecha de subida
                    const uploadDate = document.createElement('p');
                    uploadDate.classList.add('card-text');const fechaSubida = file.file_created_at ? 
                    new Date(file.file_created_at).toLocaleDateString('es-ES', { 
                        day: '2-digit', 
                        month: 'short', // Mes abreviado
                        year: 'numeric' 
                    }) + ' / ' + 
                    new Date(file.file_created_at).toLocaleTimeString('es-ES', { 
                        hour: '2-digit', 
                        minute: '2-digit',  
                        hour12: false // Formato de 24 horas
                    }) 
                    : 'Fecha desconocida';
                    
                    uploadDate.textContent = `Subido: ${fechaSubida}`;  // Usar la fecha de creación

                    // Crear el botón de descarga
                    const downloadButton = document.createElement('a');
                    downloadButton.href = `#`;  // Ajusta el enlace de descarga según corresponda
                    downloadButton.classList.add('btn', 'btn-primary', 'mt-auto');
                    downloadButton.textContent = 'Descargar';

                    // Agregar los elementos al cuerpo de la tarjeta
                    cardBodyDiv.appendChild(title);
                    cardBodyDiv.appendChild(fileSize);
                    cardBodyDiv.appendChild(uploadDate);
                    cardBodyDiv.appendChild(downloadButton);

                    // Agregar el cuerpo de la tarjeta a la tarjeta
                    cardDiv.appendChild(cardBodyDiv);

                    // Agregar la tarjeta a la columna
                    colDiv.appendChild(cardDiv);

                    // Agregar la columna al contenedor principal
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
        eel.eliminar_archivo(fileId).then(result => {
            alert(result.message);
        });
    }
};