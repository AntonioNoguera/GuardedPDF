import eel
import base64
import io
from pypdf import PdfWriter, PdfReader
from peewee_setup import *
import datetime
from peewee import IntegrityError, DoesNotExist
 

# USER
# Insertar nuevo usuario
@eel.expose
def insertar_usuario(nombre, fullname, password, salt, role_id):
    try:
        print('Peewee create user called')
        User_Table.create(
            user_name=nombre,
            user_fullname=fullname,
            user_password=password,
            user_password_salt=salt,
            user_role_id=role_id
        )
        return {"success": True, "message": "Usuario creado correctamente."}
    except IntegrityError as e:
        return {"success": False, "message": f"Error al insertar usuario: {e}"}

# Seleccionar SALT y PASSWORD por ID dado
@eel.expose
def obtener_salt_y_password(user_name): 
    try:
        user = User_Table.get((User_Table.user_name == user_name) & (User_Table.user_authorized == True))
        return {"success": True, "salt": user.user_password_salt, "password": user.user_password}
    except DoesNotExist:
        return {"success": False, "message": "Usuario no encontrado."}

# Actualizar estado de usuario autorizado
@eel.expose
def actualizar_usuario_autorizado(user_id, autorizado): 

    try:
        user = User_Table.get(User_Table.user_id == user_id)
        user.user_authorized = autorizado
        user.save()
        return {"success": True, "message": "Estado de autorización actualizado."}
    except DoesNotExist:
        return {"success": False, "message": "Usuario no encontrado."}
    except Exception as e:
        return {"success": False, "message": f"Error al actualizar estado de autorización: {e}"}

# Eliminar usuario con efecto en cascada
@eel.expose
def eliminar_usuario(user_id):
    print("Eliminar usuario ${user_id}");
    try:
        user = User_Table.get(User_Table.user_id == user_id)
        user.delete_instance()
        return {"success": True, "message": "Usuario eliminado correctamente."}
    except DoesNotExist:
        return {"success": False, "message": "Usuario no encontrado."}
    except Exception as e:
        return {"success": False, "message": f"Error al eliminar usuario: {e}"}
    
@eel.expose
def obtener_id_y_nivel_de_usuario(user_name): 
    try:
        user = User_Table.get(User_Table.user_name == user_name)
        return {"success": True, "user": user.to_self_dict()}
    except DoesNotExist:
        return {"success": False, "message": "Usuario no encontrado."}

# Actualizar fecha de login
@eel.expose
def actualizar_fecha_login(user_id):
    try:
        user = User_Table.get(User_Table.user_name == user_id)
        user.user_last_login = datetime.datetime.now()
        user.save()
        return {"success": True, "message": "Fecha de login actualizada."}
    except DoesNotExist:
        return {"success": False, "message": "Ussuario no encontrado."}
    except Exception as e:
        return {"success": False, "message": f"Error al actualizar fecha de login: {e}"}

# Obtener usuarios activos e inactivos en la misma función
@eel.expose
def obtener_usuarios_activos_e_inactivos():
    try:
        # Obtener usuarios activos (autorizados)
        # Luego, puedes utilizarlo de la siguiente manera
        usuarios_activos = [user.to_dict() for user in User_Table.select().where(User_Table.user_authorized == True)]
        usuarios_inactivos = [user.to_dict() for user in User_Table.select().where(User_Table.user_authorized == False)]
        return {
            "success": True,
            "usuarios_activos": usuarios_activos,
            "usuarios_inactivos": usuarios_inactivos
        }
    except Exception as e:
        return {"success": False, "message": f"Error al obtener usuarios: {e}"}

# FILE
# Seleccionar todos los archivos
@eel.expose
def seleccionar_todos_archivos():
    try:
        
        usuarios_activos = [fileEnt.to_dict() for fileEnt in File_Table.select()]
        return { "success": True, "files": usuarios_activos }
    except Exception as e:
        return {"success": False, "message": f"Error al seleccionar archivos: {e}"}
 
@eel.expose
def seleccionar_archivos_por_usuario(user_id):
    try:
        # Usar una condición OR para seleccionar archivos creados por el usuario o visibles para todos
        files = File_Table.select().where(
            (File_Table.file_created_by == user_id) | (File_Table.file_visible_for_all == True)
        )

        # Convertir cada archivo a diccionario usando el método `to_dict()`
        files_as_dict = [file.to_dict() for file in files]

        return {"success": True, "files": list(files_as_dict)}
    except Exception as e:
        return {"success": False, "message": f"Error al seleccionar archivos por usuario: {e}"}


# Eliminar archivo con efecto en cascada
@eel.expose
def eliminar_archivo(file_id):
    try:
        file = File_Table.get(File_Table.file_id == file_id)
        file.delete_instance()
        return {"success": True, "message": "Archivo eliminado correctamente."}
    except DoesNotExist:
        return {"success": False, "message": "Archivo no encontrado."}
    except Exception as e:
        return {"success": False, "message": f"Error al eliminar archivo: {e}"}

# Insertar nuevo archivo
@eel.expose
def insertar_archivo(file_name, descripcion, user_id, is_visible, is_merge, file_data, size):
    try:
        # Intentar insertar el archivo
        new_file = File_Table.create(
            file_title=file_name,
            file_description=descripcion,
            file_created_by=user_id,
            file_visible_for_all=is_visible,
            file_is_merge=is_merge,
            file_data=base64.b64decode(file_data),
            file_size = size
        )
        return {"status": "success", "file_id": new_file.file_id}
    
    except OperationalError as e:
        print(f"Error de conexión: {e}, reintentando...")
        # Intentar reconectar
        db.connect(reuse_if_open=True)
        # Reintentar la operación
        new_file = File_Table.create(
            file_title=file_name,
            file_description=descripcion,
            file_created_by=user_id,
            file_visible_for_all=is_visible,
            file_is_merge=is_merge,
            file_data=file_data,
            file_size = size
        )
        return {"status": "success", "file_id": new_file.file_id}
    
# Insertar nuevo miembro de unión
@eel.expose
def insertar_miembro_union(file_id, merge_result_id):
    try:
        Merge_Member_Table.create(
            file_id=file_id,
            merge_result_id=merge_result_id
        )
        return {"success": True, "message": "Miembro de unión insertado correctamente."}
    except Exception as e:
        return {"success": False, "message": f"Error al insertar miembro de unión: {e}"}

# Insertar nuevo archivo de unión con historia de unión
@eel.expose
def insertar_nuevo_merge(titulo, descripcion, creado_por, miembros):
    try:
        merge_result = insertar_archivo(titulo, descripcion, creado_por, es_union=True)
        for miembro in miembros:
            insertar_miembro_union(miembro, merge_result.file_id)
        return {"success": True, "message": "Unión creada correctamente."}
    except Exception as e:
        return {"success": False, "message": f"Error al insertar nuevo merge: {e}"}

# Seleccionar todos los merges
@eel.expose
def seleccionar_todos_merges():
    try:
        return {"success": True, "merges": list(File_Table.select().where(File_Table.file_is_merge == True).dicts())}
    except Exception as e:
        return {"success": False, "message": f"Error al seleccionar merges: {e}"}

# MERGE
# Obtener todos los merges
@eel.expose
def obtener_todos_los_merges():
    try:
        return {"success": True, "merges": list(Merge_Member_Table.select().dicts())}
    except Exception as e:
        return {"success": False, "message": f"Error al obtener merges: {e}"}
    
@eel.expose
def merge_pdfs(base64_pdfs):
    # Crear una instancia de PdfWriter
    writer = PdfWriter()
    
    # Iterar sobre cada archivo PDF codificado en base64
    for pdf in base64_pdfs:
        # Decodificar cada archivo base64 a binario
        pdf_bytes = base64.b64decode(pdf)
        pdf_stream = io.BytesIO(pdf_bytes)
        
        # Leer el PDF decodificado
        reader = PdfReader(pdf_stream)
        
        # Agregar todas las páginas del PDF al PdfWriter
        for page in reader.pages:
            writer.add_page(page)
    
    # Guardar el PDF fusionado en memoria
    merged_pdf_stream = io.BytesIO()
    writer.write(merged_pdf_stream)

    # Obtener los bytes del PDF fusionado y codificar a base64
    merged_pdf_base64 = base64.b64encode(merged_pdf_stream.getvalue()).decode('utf-8')
    
    # Retornar el archivo PDF fusionado en base64
    return merged_pdf_base64

# Test de conexión
@eel.expose
def testConection():
    print('Conectado')

# Inicializar Eel
eel.init('../presentation', allowed_extensions=['.js', '.html', '.css'])

# Iniciar la aplicación
if __name__ == "__main__":
    crear_tablas()
    eel.start('/html/auth/index.html', size=(3000, 3000), position=(500, 500))
