import pymysql
import base64
from peewee import *
import datetime

# Crear la base de datos si no existe
def crear_base_datos():
    connection = pymysql.connect(
        host='localhost',
        user='root',
        password=''
    )
    with connection.cursor() as cursor:
        cursor.execute("CREATE DATABASE IF NOT EXISTS safe_pdf;")
    connection.close()

# Primero, crea la base de datos
crear_base_datos()

# Conexión a la base de datos MySQL
db = MySQLDatabase(
    'safe_pdf',
    user='root',
    password='',
    host='localhost',
    port=3306,
    charset='utf8mb4'
)

class BaseModel(Model):
    class Meta:
        database = db

class Role_Table(BaseModel):
    role_id = AutoField()
    role_name = CharField(max_length=60, unique=True)
    role_description = CharField(max_length=100)

class User_Table(BaseModel):
    user_id = AutoField()
    user_name = CharField(max_length=50)
    user_fullname = CharField(max_length=100, unique=True)
    user_password = CharField(max_length=255)
    user_password_salt = CharField(max_length=255)
    user_role_id = ForeignKeyField(Role_Table, backref='users', on_delete='CASCADE')
    user_created_at = DateTimeField(default=datetime.datetime.now)
    user_authorized = BooleanField(default=False)
    user_last_login = DateTimeField(default=datetime.datetime.now)

    # Método para convertir a un diccionario con fechas en formato ISO
    def to_dict(self):
        return {
            'user_id': self.user_id,
            'user_name': self.user_name,
            'user_fullname': self.user_fullname,
            'user_password': self.user_password,
            'user_password_salt': self.user_password_salt,
            'user_role_id': self.user_role_id.role_name,  # Serializa solo el ID del rol
            'user_created_at': self.user_created_at.isoformat() if self.user_created_at else None,
            'user_authorized': self.user_authorized,
            'user_last_login': self.user_last_login.isoformat() if self.user_last_login else None,
        }
    
    # Método para convertir a un diccionario con fechas en formato ISO
    def to_self_dict(self):
        return {
            'user_id': self.user_id,
            'user_name': self.user_name,
            'user_fullname': self.user_fullname,  
            'user_role_id': self.user_role_id.role_name,  # Serializa solo el ID del rol 
        }
    

class File_Table(BaseModel):
    file_id = AutoField()
    file_title = CharField(max_length=80)
    file_description = CharField(max_length=100)
    file_created_at = DateTimeField(default=datetime.datetime.now)
    file_created_by = ForeignKeyField(User_Table, backref='files', on_delete='CASCADE')
    file_visible_for_all = BooleanField(default=False)
    file_is_merge = BooleanField(default=False)
    file_data = BlobField()  # Esto define la columna como LONGBLOB en MySQL
    file_size = CharField(max_length=25)

    # Método para convertir a un diccionario con fechas en formato ISO y archivo en base64
    def to_dict(self):
        print("Iniciando la conversión del objeto File_Table a diccionario...")

        # Codifica el archivo BLOB en base64 si está disponible
        try:
            if self.file_data:
                file_data_base64 = base64.b64encode(self.file_data).decode('utf-8')
                print("Archivo BLOB codificado correctamente en base64.")
            else:
                file_data_base64 = None
                print("Archivo BLOB no disponible, asignando valor None.")
        except Exception as e:
            print(f"Error al codificar el archivo BLOB en base64: {e}")
            file_data_base64 = None

        # Obtener el ID del usuario creador
        try:
            user_id = self.file_created_by_id
            print(f"ID del usuario creador obtenido correctamente: {user_id}")
        except Exception as e:
            print(f"Error al obtener el ID del usuario creador: {e}")
            user_id = None

        # Realizar una consulta para obtener el usuario a partir del ID
        if user_id:
            try:
                user = User_Table.get_by_id(user_id)
                user_name = user.user_name
                print(f"Nombre del usuario creador obtenido correctamente: {user_name}")
            except User_Table.DoesNotExist:
                user_name = 'Desconocido'
                print(f"Usuario con ID {user_id} no existe en la base de datos.")
            except Exception as e:
                user_name = 'Error al obtener el nombre del usuario'
                print(f"Error al consultar el usuario creador: {e}")
        else:
            user_name = 'Desconocido'
            print("No se pudo obtener el ID del usuario creador, asignando 'Desconocido'.")

        # Crear el diccionario para devolver los datos del archivo
        try:
            file_dict = {
                'file_id': self.file_id,
                'file_title': self.file_title,
                'file_description': self.file_description,
                'file_created_at': self.file_created_at.isoformat() if self.file_created_at else None,
                'file_created_by': user_name,  # Devolver el nombre del usuario
                'file_visible_for_all': self.file_visible_for_all,
                'file_is_merge': self.file_is_merge,
                'file_blob': file_data_base64,  # Devolver el archivo codificado en base64
                'file_size': self.file_size,
            }
            print("Diccionario creado correctamente a partir del objeto File_Table.")
        except Exception as e:
            print(f"Error al crear el diccionario del archivo: {e}")
            file_dict = {}

        return file_dict

    
class Merge_Member_Table(BaseModel):
    merge_member_id = AutoField()
    file_id = ForeignKeyField(File_Table, backref='merge_members', on_delete='CASCADE')
    merge_result_id = ForeignKeyField(File_Table, backref='merge_results', on_delete='CASCADE')

# Crear tablas en la base de datos
def crear_tablas():
    with db:
        #db.create_tables([Role_Table, User_Table, File_Table, Merge_Member_Table])

        # Insertar registros en la tabla de roles si no existen
        try:
            admin_role, created = Role_Table.get_or_create(role_name='admin', defaults={'role_description': 'Administrator role'})
            user_role, created = Role_Table.get_or_create(role_name='user', defaults={'role_description': 'User role'})
        except IntegrityError as e:
            print(f"Error al crear roles: {e}")

        # Insertar un registro en la tabla de usuarios si no existe
        try:
            User_Table.get_or_create(user_name='admin', defaults={
                'user_fullname': 'Administrador', 
                'user_password': '7d99383efec0128e336eaf4708db85e0ec10eee2412a12599174afbacef45baf', 
                'user_password_salt': '2a0ae1ad4c6ec49ed01c17cb28b828ca', 
                'user_authorized' : 1 , 
                'user_role_id': admin_role
                })
        except IntegrityError as e:
            print(f"Error al crear usuario admin: {e}")

    print("Base de datos y tablas creadas correctamente")

if __name__ == "__main__":
    # Crear las tablas después de asegurar que la base de datos existe
    try:
        with db.atomic():
            crear_tablas()
    except OperationalError as e:
        print(f"Error al crear tablas: {e}")
    print("Base de datos y tablas creadas correctamente")

    # Intentar insertar registros en la base de datos
    try:
        with db.atomic():
            admin_role, created = Role_Table.get_or_create(role_name='admin', defaults={'role_description': 'Administrator role'})
            user_role, created = Role_Table.get_or_create(role_name='user', defaults={'role_description': 'User role'})
            user_admin, created = User_Table.get_or_create(user_name='admin', defaults={
                'user_fullname': 'Administrador', 
                'user_password': '7d99383efec0128e336eaf4708db85e0ec10eee2412a12599174afbacef45baf', 
                'user_password_salt': '2a0ae1ad4c6ec49ed01c17cb28b828ca', 
                'user_authorized' : 1 , 
                'user_role_id': admin_role
                }
            )
            print("Registros insertados correctamente")
    except IntegrityError as e:
        print(f"Error al insertar registros: {e}")
        