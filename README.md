# GuardedPDF

# Proyect Progress

## Done Pages

### Login
Esta pantalla abarca el logeo, ya estan cubiertos los casos principales

### Register Petition
Aca se realizan las peticiones de usuarios, y los campos visuales ya se han cubierto

### Home (sketch)
El home es donde se manejan los 2 niveles de usuario, se sigue trabajando en el

### User Administration (sketch)
En esta pagina se realiza la aceptación o negación de peticiones de usuario, así como la baja de usuarios

### Merge Files (not engaged)

### Necesario para ejecutar

### Levantamiento local, XAMPP, pip y python como variable de entorno, 

## Librerias de python, pip install eel, pip install peewee, PyMySQL, pip install pypdf

## Dev Progress
### Login
### Register
### UserPermission

### Merge Files

#### Pending Stuff

##### Feats
Merge Functionality
Upload Files
All file  history

##### Refactors
Cleaning code on the presentation vinculation

#### Fix
User auto deletes 
User roles actually using the ORM [DONE]

File item, allways full height 
For now the bigger packets are just refused

Review the getUserInfo


#### On working stuff
Better File Distructuring

#### Unknown stuff
Data download?
Data Merge?
Data New

### Tamaño de los archivos, muy grande provoca crash



## Comando para crear ejecutable
pyinstaller --onefile --noconsole --add-data "presentation/html;presentation/html" --add-data "presentation/css;presentation/css" --add-data "presentation/js;presentation/js" --add-data "safe_pdf.sql;." app/main.py