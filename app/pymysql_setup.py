import pymysql

def crear_base_datos_y_tablas():
    # Definir el script de creación de la base de datos y tablas
    script_sql = """
    CREATE DATABASE IF NOT EXISTS safe_pdf CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

    USE safe_pdf;

    CREATE TABLE IF NOT EXISTS Role_Table (
        role_id INT AUTO_INCREMENT PRIMARY KEY,
        role_name VARCHAR(60) UNIQUE NOT NULL,
        role_description VARCHAR(100) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS User_Table (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        user_name VARCHAR(50) NOT NULL,
        user_fullname VARCHAR(100) UNIQUE NOT NULL,
        user_password VARCHAR(255) NOT NULL,
        user_password_salt VARCHAR(255) NOT NULL,
        user_role_id INT NOT NULL,
        user_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        user_authorized BOOLEAN DEFAULT FALSE,
        user_last_login DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_role_id) REFERENCES Role_Table(role_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS File_Table (
        file_id INT AUTO_INCREMENT PRIMARY KEY,
        file_title VARCHAR(80) NOT NULL,
        file_description VARCHAR(100) NOT NULL,
        file_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        file_created_by INT NOT NULL,
        file_visible_for_all BOOLEAN DEFAULT FALSE,
        file_is_merge BOOLEAN DEFAULT FALSE,
        file_data LONGBLOB,
        file_size VARCHAR(25),
        FOREIGN KEY (file_created_by) REFERENCES User_Table(user_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS Merge_Member_Table (
        merge_member_id INT AUTO_INCREMENT PRIMARY KEY,
        file_id INT NOT NULL,
        merge_result_id INT NOT NULL,
        FOREIGN KEY (file_id) REFERENCES File_Table(file_id) ON DELETE CASCADE,
        FOREIGN KEY (merge_result_id) REFERENCES File_Table(file_id) ON DELETE CASCADE
    );
    """

    # Conectar al servidor MySQL y ejecutar el script SQL
    connection = pymysql.connect(
        host='localhost',
        user='root',
        password='',
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )

    try:
        with connection.cursor() as cursor:
            # Ejecutar cada comando en el script SQL
            for command in script_sql.split(';'):
                if command.strip():
                    cursor.execute(command)
                    print(f"Ejecución exitosa de comando: {command.strip()[:30]}...")

        # Confirmar cambios
        connection.commit()
        print("Base de datos y tablas creadas correctamente.")
    finally:
        connection.close()

# Llama a la función si el archivo se ejecuta directamente
if __name__ == "__main__":
    crear_base_datos_y_tablas()
