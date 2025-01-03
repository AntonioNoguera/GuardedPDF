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
El inicio de sesión en realidad es bastante sencillo, nada del otro mundo, cuenta con una paleta de colores tirando a rojo, una de las ideas era que en la parte superior derecha se mostrase el nombre de la empresa al que se le haya vendido el sistema, en este caso FIME.
![Texto alternativo](readme_assets/login.png)

### Registro 
El register es sencillo de la misma forma es sencillo, cuenta con la contraseña, y el nivel de usuario de la petición, para poder contar con los permisos de ambos usuarios, en este caso, se distinguen entre aceptar usuarios, y acceso global a los archivos.
![Texto alternativo](readme_assets/register.png)


### Formulario con datos
![Texto alternativo](readme_assets/filledForm.png)

### Contraseñas de Google
Al estar basado en chromium claramente se cuenta con el control de contraseñas de google, por lo mismo el usuasrio puede elegir si almacenar la contraseña o no; esto a la vez es un poco molesto, pues hace que los usuarios tengan que poner una contraseña que sea considerada segura por google. Y si no es así entonces sale un alerta, lo cual es un tanto incómodo.
![Texto alternativo](readme_assets/full_login.png)

### Dashboard
El panel de inicio, es sencillo, muestra las uniones que el usuario ha realizado, o los archivos que el usuario ha subido, así como los enlaces a todas las partes del sistema.
![Texto alternativo](readme_assets/main_panel.png)

### Usuario Activo
El usuario que intente realizar sesión con una petición ya realizada, por obvios motivos, el intento de inicio de sesión será desechado.
![Texto alternativo](readme_assets/notFound.png)


### Consola de Administración de usuarios. 
Otra de las ideas es poder, aceptar como negar las peticiones que los usuarios realicen, con el fin de tener un buen control de los usuarios que intenten entrar a la plataforma, y de la misma forma controlar que nivel de usuario estos poseen.
![Texto alternativo](readme_assets/user_management.png) 

### Peticiones del usuario
Aqui podemos observar como llegan dichas peticiones, y las opciones son sencillas, aceptar o rechazar. Quizá como buena mejora podrían aceptarse con permisos distintos con los que se solicitaron.
![Texto alternativo](readme_assets/userPetitions.png)

![Texto alternativo](readme_assets/AcceptUserPetition.png)
 
![Texto alternativo](readme_assets/NewUserAdded.png)

### Subiendo archivos 
Subir archivos es principalmente para poder implementar archivos con los que se trabaje de forma consecutiva. Observarlos es sencillo, incluso con el mismo frame se podría mandar a imprimir de forma sencilla.
![Texto alternativo](readme_assets/uploadingFiles.gif) 

### Historial de archivos
El historial de archivos en realidad es bastante sencillo, permite observar en una tabla que es lo que los usuarios han realizado, cuando el usuario es de tipo administrador, cuenta con permisos para poder observar todos las transacciones, en caso contrario solo aparecerán las transacciones del usuario.
![Texto alternativo](readme_assets/History.png)

### Unir Archivos
Unir archivos en realidad es sencillo, seleccionas 2 archivos, o más, les otorgas un nombre y listo, ya se puede ejecutar la unión de dichos archivos, a partir de ahora los miembros de la union serán privados, y la union pública, para que los demás usuarios puedan acceder a la misma.
![Texto alternativo](readme_assets/mergeFiles.gif) 

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