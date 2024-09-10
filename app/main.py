import eel

# Inicializa la carpeta web
eel.init('../presentation/html/auth', allowed_extensions=['.js','.html','.css'])

# Inicia la aplicación con index.html
eel.start('index.html', size=(800, 600))