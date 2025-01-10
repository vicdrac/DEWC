// Creacion de cookies
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));

    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

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



// Obtener fecha actual
function obtenerFecha(){
    const fecha = new Date();

    const dia = fecha.getDate(); 
    const mes = fecha.getMonth()+1; 
    const ano = fecha.getFullYear();

    return `${dia}-${mes}-${ano}`;
}

// Obtener tiempo actual del dia
function obtenerHora() {
    const fecha = new Date();

    const horas = fecha.getHours();
    const minutos = fecha.getMinutes(); 
    const segundos = fecha.getSeconds();

    return `${horas}:${minutos}:${segundos}`; 
}



// Mostrar el formulario y ocultar el mensaje
aspectoCambiado = false; 
function cambiarAspecto() {
    if (aspectoCambiado) return; 
    aspectoCambiado = true; 

    const form = document.querySelector('.form');
    const mensaje = document.querySelector('.mensaje');

    document.body.style.backgroundColor = "white";
    document.body.style.color = "black";
    mensaje.style.display = "none";
    form.style.display = "block";
};



// Se ejecuta la funcion cuando pulsamos la combinacion de teclas
document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.key === "b") {
        cambiarAspecto();
    }
});

// Se ejecuta la funcion cuando pasa el tiempo
setTimeout(()=>cambiarAspecto(),5000);




// Comprobacion usuario correcto y guardar datos en cookie
function validarUsuario() {
    const usuario = document.querySelector("#usuario").value.trim();
    const usuarioCookie = usuario;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mensaje_validacion = document.querySelector(".mensaje_validacion");

    // Validamos el usuario
    if(regex.test(usuario)){
        // Indicamos que se ha introducido correctamente el nombre de usuario
        mensaje_validacion.textContent = "Usuario Correcto.";
        mensaje_validacion.style.color = "white";
        mensaje_validacion.style.backgroundColor = "green";

        // Obtener cookie
        let valores_usuario;
        const cookieActual = getCookie(usuarioCookie);

        // Si existe la cookie, cambiamos los valores, si no, la creamos
        if(cookieActual){
            valores_usuario = JSON.parse(cookieActual);
            valores_usuario.fecha_dia = obtenerFecha();
            valores_usuario.fecha_hora = obtenerHora();
        } else {
            // Datos del usuario
            valores_usuario = {
                username: usuario,
                fecha_dia: obtenerFecha(),
                fecha_hora: obtenerHora(),
            };
        }

        // Conversión a JSON
        const user_JSON = JSON.stringify(valores_usuario);

        // Creamos la cookie 
        setCookie(usuarioCookie, user_JSON, 7);

        // Guardamos el nombre de usuario en localStorage para usarlo en la siguiente página
        localStorage.setItem("username", usuario); 

        // Redireccionamiento a la siguiente página de nuestra web
        window.location.href = "screen2.html";
    } else {
        // Mensaje en caso de validación incorrecta
        mensaje_validacion.textContent ="Usuario Incorrecto";
        mensaje_validacion.style.color = "white";
        mensaje_validacion.style.backgroundColor = "red";
    }
}



// Enviar formularip
const button = document.querySelector('button');
button.addEventListener('click', validarUsuario);
