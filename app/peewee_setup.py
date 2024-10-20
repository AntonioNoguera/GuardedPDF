import pymysql
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
            'user_role_id': self.user_role_id.id,  # Serializa solo el ID del rol
            'user_created_at': self.user_created_at.isoformat() if self.user_created_at else None,
            'user_authorized': self.user_authorized,
            'user_last_login': self.user_last_login.isoformat() if self.user_last_login else None,
        }
    

class File_Table(BaseModel):
    file_id = AutoField()
    file_title = CharField(max_length=80)
    file_description = CharField(max_length=100)
    file_created_at = DateTimeField(default=datetime.datetime.now)
    file_created_by = ForeignKeyField(User_Table, backref='files', on_delete='CASCADE')
    file_visible_for_all = BooleanField(default=False)
    file_is_merge = BooleanField(default=False)
    file_data = BlobField()

    # Método para convertir a un diccionario con fechas en formato ISO
    def to_dict(self):
        return {
            'file_id': self.file_id,
            'file_title': self.file_title,
            'file_description': self.file_description,
            'file_created_at': self.file_created_at.isoformat() if self.file_created_at else None,
            'file_created_by': self.file_created_by.user_name,  # Solo devolver el ID del usuario
            'file_visible_for_all': self.file_visible_for_all,
            'file_is_merge': self.file_is_merge
        }


class Merge_Member_Table(BaseModel):
    merge_member_id = AutoField()
    file_id = ForeignKeyField(File_Table, backref='merge_members', on_delete='CASCADE')
    merge_result_id = ForeignKeyField(File_Table, backref='merge_results', on_delete='CASCADE')

# Crear tablas en la base de datos
def crear_tablas():
    with db:
        db.create_tables([Role_Table, User_Table, File_Table, Merge_Member_Table])

# Métodos Requeridos
# (resto del código permanece igual)

if __name__ == "__main__":
    # Crear las tablas después de asegurar que la base de datos existe
    crear_tablas()
    print("Base de datos y tablas creadas correctamente")
