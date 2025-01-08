// Recoger una cookie
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// Contenido de la página
let principal = document.querySelector(".principal");
let saludoUsuario = document.querySelector(".saludo");
let ultimaVez = document.querySelector(".ultima_conexion");

// Encontrar cookie del usuario actual
function getUserCookie(){
    // Obtener todas las cookies
    const cookies = document.cookie.split(';');

    // Buscamos la cookie específica del usuario
    const userCookie = cookies.find((cookie) => cookie.trim().startsWith("User_"));

    // Si la cookie existe y tiene datos, devolvemos el valor
    if(userCookie){
        const name = userCookie.split('=')[0];
        return name.trim();
    }
}

// Valor de la cookie
let valorCookie = getCookie(getUserCookie());

if(valorCookie){
    // Desglosamos el JSON para utilizar sus variables con sus respectivos valores
    let valoresUsuario = JSON.parse(valorCookie);

    // Imprimos los datos por pantalla
    saludoUsuario.textContent = "Hola "+valoresUsuario.username;
    ultimaVez.textContent = "La última vez que entraste fue el "+valoresUsuario.fecha_dia+" a las "+valoresUsuario.fecha_hora;
} else {
    // Por si no se encuentra la cookie
    principal.textContent = "No existes :(";
}

console.log(principal);
