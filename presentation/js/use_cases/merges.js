export const mergeUseCase = {

    // Insertar nuevo merge (unión de archivos)
    createMerge: function(title, description, createdBy, members) {
        eel.insertar_nuevo_merge(title, description, createdBy, members).then(result => {
            alert(result.message);
        });
    },

    // Obtener todos los merges
    getAllMerges: function() {
        eel.seleccionar_todos_merges().then(result => {
            if (result.success) {
                console.log("Merges:", result.merges);
            } else {
                alert(result.message);
            }
        });
    },

    // Obtener todos los miembros de los merges
    getAllMergeMembers: function() {
        eel.obtener_todos_los_merges().then(result => {
            if (result.success) {
                console.log("Merge Members:", result.merges);
            } else {
                alert(result.message);
            }
        });
    }
};