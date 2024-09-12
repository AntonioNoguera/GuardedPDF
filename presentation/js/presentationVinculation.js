console.log("Vinculation script cargado correctamente");


function saludar() {
    console.log("Llamando a decir_hola desde Python");
    eel.decir_hola();  // Llama la función Python
}


function irAPantalla() { 
    window.location.href = '/html/auth/register_page.html';  // Cambiar a la nueva pantalla HTML
}