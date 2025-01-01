# GuardedPDF

### Contexto
La privacidad de las empresas es fundamental en muchos casos, la información que se maneja es delicada; hoy en día se realizan muchisimas operaciones con archivos de tipo pdf, por lo mismo se cae en el uso de muchas plataformas en linea, que de forma funcional solucionan esta problemática (de operaciones con archivos pdf). Sin embargo, recaen en nuevas problemáticas, como lo podriá ser el hecho de que ahora los archivos pasan a traves de la red, y podrían ser interceptados por terceros. 

### Justificación

### Tecnologías
La base de datos se encuentra en **MySQL**

Todas las operciones con la base de datos se manejan con **Pyuthon**


### Instalación 

1. Clona el repositorio: 
    ```bash
    git clone https://github.com/AntonioNoguera/GuardedPDF
    cd GuardedPDF

2. Instala las dependencias:
    ```bash
    pip install peewee==3.17.7 PyMySQL==1.1.1 pypdf==5.0.1 Eel==0.17.0

3. Configura MySQL

    Asegúrate de tener MySQL instalado y configurado correctamente. Puedes instalarlo usando herramientas como XAMPP si no lo tienes aún. Recuerda configurar las credenciales de la base de datos en el archivo correspondiente del proyecto.
    
    **Nota: Si se realizo correctamente la instalación de peewee y pymsql toda la base de datos se debería de instalar al ejecutar la aplicación**

4. Ejecucción
   
    ```bash
   python app/main.py

## Funcionalidad

### Inicio de Sesion
Lorem
![Texto alternativo](readme_assets/login.png)

### Registro 
![Texto alternativo](readme_assets/register.png)


### Lorem
![Texto alternativo](readme_assets/full_login.png)

### Lorem
![Texto alternativo](readme_assets/main_panel.png)

### Lorem
![Texto alternativo](readme_assets/filledForm.png)

### Lorem
![Texto alternativo](readme_assets/notFound.png)

### Lorem
![Texto alternativo](readme_assets/notFound.png)

### Lorem
![Texto alternativo](readme_assets/user_management.png)

### Lorem
![Texto alternativo](readme_assets/userPetitions.png)

### Lorem
![Texto alternativo](readme_assets/startNewFile.png)

### Lorem
![Texto alternativo](readme_assets/succed_uploadFile.png)

### Lorem
![Texto alternativo](readme_assets/NewFilleOnDash.png)

### Lorem
![Texto alternativo](readme_assets/History.png)

### Lorem
![Texto alternativo](readme_assets/SeeingFiles.png)

### Lorem
![Texto alternativo](readme_assets/FileDisplay.png)

### Lorem
![Texto alternativo](readme_assets/MergeFilesInit.png)

### Lorem
![Texto alternativo](readme_assets/MergeFile2.png)

### Lorem
![Texto alternativo](readme_assets/MergeFile2.png)

### Lorem
![Texto alternativo](readme_assets/SelectMergeFiles.png)

### Lorem
![Texto alternativo](readme_assets/SelectedMergeFiles.png)

### Lorem
![Texto alternativo](readme_assets/LastMergeStep.png)

### Lorem
![Texto alternativo](readme_assets/CorrectMergeFiles.png)

### Lorem
![Texto alternativo](readme_assets/MergedFilesOnDashBoard.png)

### Lorem
![Texto alternativo](readme_assets/AcceptUserPetition.png)

### Lorem
![Texto alternativo](readme_assets/NewUserAdded.png)

### Mejoras
- Empty Cases : Algo que no se implemento por temas de tiempo fue el control de casos en los que el usuario aún no cuenta con ningun tipo de información, es decir se abre la pantalla en completo blanco, lo cual es algo que hoy en día ninguna aplicación realiza.
  
- Loading States : La aplicación no realiza ningun tipo de loading, lo cual es incómodo si la comparamos con cualquier otra aplicación de hoy en día.
  
- Firewall Timeout : A todos nos gustaría poder realizar peticiones con archivos enormes, la base de datos esta preparada para recibir archivos de grandes dimensiones, sin embargo, el firewall le da timeout a este tipo de peticiones, un buen caso de mejora sería solucionar esto, para poder realizar peticiones de gran tamaño sin problema.


## Contribución
¡Las contribuciones son bienvenidas! 

1. Haz un fork del repositorio.  
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).  
3. Haz commit de tus cambios.  
4. Haz un push a la rama (`git push origin feature/nueva-funcionalidad`).  
5. Abre un Pull Request.


### Autor(es)

- **Michael Noguera** - [Github](https://github.com/AntonioNoguera)