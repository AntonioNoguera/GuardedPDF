import eel
import router as router

eel.init('../presentation', allowed_extensions=['.js','.html','.css'])

@eel.expose
def decir_hola():
    eel.start(router.register, size = (800, 600))

eel.start('/html/auth/index.html', size=(3000, 3000),position=(500, 500))