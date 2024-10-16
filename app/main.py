import eel 

eel.init('../presentation', allowed_extensions=['.js','.html','.css'])

@eel.expose
def decir_hola():
    eel.start(router.register, size = (800, 600))

## Listado de métodos requeridos

## USER
# INSERT NEW USER 
# SELECT SALT AND PASSWORD WHERE ID == DADO
## UPDATE USER ACTIVE = TRUE / FALSE
## DELETE CASCADE USER
## UPDATE LOGIN DATE

## FILE
## SELECT *
## SELECT WHERE USER ID = GIVEN
## DELETE CASCADE WHERE ID = GIVEN
## INSERT NEW, MEMBER
## INSERT NEW MERGE
    ##CASCADE EFFECT, INSERT MERGE HISTORY

## SELECT * MERGES 


## MERGE
    ##GET ALL



eel.start('/html/auth/index.html', size=(3000, 3000),position=(500, 500))