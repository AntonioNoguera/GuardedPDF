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

    // Obtener archivos por ID de usuario
    getFilesByUser: function(userId) {
        eel.seleccionar_archivos_por_usuario(userId).then(result => {
            if (result.success) {
                console.log("Files by user:", result.files);
            } else {
                alert(result.message);
            }
        });
    },

    // Eliminar un archivo
    deleteFile: function(fileId) {
        eel.eliminar_archivo(fileId).then(result => {
            alert(result.message);
        });
    }
};