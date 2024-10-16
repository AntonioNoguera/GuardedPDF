import eel
from peewee_setup import *
import datetime

# Crear tablas en la base de datos
def crear_tablas():
    with db:
        db.create_tables([Role_Table, User_Table, File_Table, Merge_Member_Table])

# Métodos Requeridos

# USER
# Insertar nuevo usuario
@eel.expose
def insertar_usuario(nombre, fullname, password, salt, role_id):
    print('Peewee create user called')
    User_Table.create(
        user_name=nombre,
        user_fullname=fullname,
        user_password=password,
        user_password_salt=salt,
        user_role_id=role_id
    )

# Seleccionar SALT y PASSWORD por ID dado
@eel.expose
def obtener_salt_y_password(user_id):
    user = User_Table.get(User_Table.user_id == user_id)
    return user.user_password_salt, user.user_password

# Actualizar estado de usuario autorizado
@eel.expose
def actualizar_usuario_autorizado(user_id, autorizado):
    user = User_Table.get(User_Table.user_id == user_id)
    user.user_authorized = autorizado
    user.save()

# Eliminar usuario con efecto en cascada
@eel.expose
def eliminar_usuario(user_id):
    user = User_Table.get(User_Table.user_id == user_id)
    user.delete_instance()

# Actualizar fecha de login
@eel.expose
def actualizar_fecha_login(user_id):
    user = User_Table.get(User_Table.user_id == user_id)
    user.user_last_login = datetime.datetime.now()
    user.save()

# FILE
# Seleccionar todos los archivos
@eel.expose
def seleccionar_todos_archivos():
    return list(File_Table.select().dicts())

# Seleccionar archivos por ID de usuario dado
@eel.expose
def seleccionar_archivos_por_usuario(user_id):
    return list(File_Table.select().where(File_Table.file_created_by == user_id).dicts())

# Eliminar archivo con efecto en cascada
@eel.expose
def eliminar_archivo(file_id):
    file = File_Table.get(File_Table.file_id == file_id)
    file.delete_instance()

# Insertar nuevo archivo
@eel.expose
def insertar_archivo(titulo, descripcion, creado_por, visible_para_todos=False, es_union=False):
    File_Table.create(
        file_title=titulo,
        file_description=descripcion,
        file_created_by=creado_por,
        file_visible_for_all=visible_para_todos,
        file_is_merge=es_union
    )

# Insertar nuevo miembro de unión
@eel.expose
def insertar_miembro_union(file_id, merge_result_id):
    Merge_Member_Table.create(
        file_id=file_id,
        merge_result_id=merge_result_id
    )

# Insertar nuevo archivo de unión con historia de unión
@eel.expose
def insertar_nuevo_merge(titulo, descripcion, creado_por, miembros):
    merge_result = insertar_archivo(titulo, descripcion, creado_por, es_union=True)
    for miembro in miembros:
        insertar_miembro_union(miembro, merge_result.file_id)

# Seleccionar todos los merges
@eel.expose
def seleccionar_todos_merges():
    return list(File_Table.select().where(File_Table.file_is_merge == True).dicts())

# MERGE
# Obtener todos los merges
@eel.expose
def obtener_todos_los_merges():
    return list(Merge_Member_Table.select().dicts())

@eel.expose
def testConection():
    print('Conectao')

# Inicializar Eel
eel.init('../presentation', allowed_extensions=['.js', '.html', '.css'])

# Iniciar la aplicación
if __name__ == "__main__":
    crear_tablas()
    eel.start('/html/auth/index.html', size=(3000, 3000), position=(500, 500))