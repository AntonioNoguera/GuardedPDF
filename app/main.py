import eel
from peewee_setup import *
import datetime
from peewee import IntegrityError, DoesNotExist

# Crear tablas en la base de datos
def crear_tablas():
    try:
        with db:
            db.create_tables([Role_Table, User_Table, File_Table, Merge_Member_Table])
        print("Tablas creadas correctamente.")
    except Exception as e:
        print(f"Error al crear tablas: {e}")

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
    print("PEWEE UPDATE  ${autorizado}");

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
        return {"success": True, "files": list(File_Table.select().dicts())}
    except Exception as e:
        return {"success": False, "message": f"Error al seleccionar archivos: {e}"}

# Seleccionar archivos por ID de usuario dado
@eel.expose
def seleccionar_archivos_por_usuario(user_id):
    try:
        return {"success": True, "files": list(File_Table.select().where(File_Table.file_created_by == user_id).dicts())}
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
def insertar_archivo(titulo, descripcion, creado_por, visible_para_todos=False, es_union=False):
    try:
        File_Table.create(
            file_title=titulo,
            file_description=descripcion,
            file_created_by=creado_por,
            file_visible_for_all=visible_para_todos,
            file_is_merge=es_union
        )
        return {"success": True, "message": "Archivo creado correctamente."}
    except Exception as e:
        return {"success": False, "message": f"Error al insertar archivo: {e}"}

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
