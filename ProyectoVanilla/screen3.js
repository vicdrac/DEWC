// Obtener el valor de una cookie
function getCookie(cname) {
    const name = cname + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// Creacion de cookies
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));

    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}



// Agregar una fila al listado de preguntas en la tabla
function agregarFila(preguntaObj) {
    const tabla = document.querySelector(".listado table");
    const fila = document.createElement("tr");

    fila.innerHTML = `
        <td>${preguntaObj.pregunta}</td>
        <td>${preguntaObj.respuesta}</td>
        <td>${preguntaObj.puntuacion}</td>
        <td>Pendiente</td>
    `;

    tabla.appendChild(fila);
}



// Valor de la cookie
let valorCookie = getCookie("victor@correo.yes");

// Si la cookie no existe, inicializamos un objeto vacío
let valores_usuario = valorCookie ? JSON.parse(valorCookie) : { preguntas: [] };

// Si no existe un array de preguntas, se crea
if (!Array.isArray(valores_usuario.preguntas)) {
    valores_usuario.preguntas = [];
}


// Botones de guardado y retroceder
const guardar = document.querySelector(".guardar");
const atras = document.querySelector(".atras");

// Campos del formulario
const nombrePregunta = document.querySelector("#nombre_pregunnta");
const respuestas = document.querySelectorAll("input[name='respuesta']");
const puntuacion = document.querySelector("#puntuacion");



// Volver a la pagina anterior
atras.addEventListener('click', () => {
    window.location.href = "screen2.html";
});


// Guardar pregunta en la cookie
guardar.addEventListener('click', () => {
// Obtener la respuesta seleccionada
    let respuestaSeleccionada = "";
     respuestas.forEach((respuesta) => {
         if (respuesta.checked) {
            respuestaSeleccionada = respuesta.value;
         }
     });

      // Validar campos del formulario
      if (!nombrePregunta.value || !respuestaSeleccionada || !puntuacion.value) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    // Agregar la nueva pregunta al JSON del usuario
    const nuevaPregunta = {
        pregunta: nombrePregunta.value,
        respuesta: respuestaSeleccionada,
        puntuacion: parseInt(puntuacion.value),
    };
    
    // Agregar la nueva pregunta al array de preguntas 
    valores_usuario.preguntas.push(nuevaPregunta);

    // Guardar el JSON actualizado en la cookie
    setCookie("victor@correo.yes", JSON.stringify(valores_usuario), 7);

    // Actualizar el listado de preguntas en la tabla
    agregarFila(nuevaPregunta);

     // Limpiar el formulario
     nombrePregunta.value = "";
     respuestas.forEach((respuesta) => (respuesta.checked = false));
     puntuacion.value = "";
});



// Mostrar la tabla
function mostrarTabla(){
    const tabla = document.querySelector("table");
    const texto = document.querySelector("p");

    texto.style.display = "none";
    tabla.style.display = "block";

    valores_usuario.preguntas.forEach((pregunta) => agregarFila(pregunta));
}

// Mostrar preguntas
function mostrarPreguntas(retraso = false) {
    // Mostrar las preguntas existentes de la cookie, si existen
    if (valores_usuario.preguntas) {
        // Mostrar con retraso o sin, según se indique 
        if (!retraso) {
            mostrarTabla();
        } else {
            setTimeout(()=>mostrarTabla(),5000);
        }
    }
}

// Cargar preguntas
document.addEventListener("DOMContentLoaded", () => {
    let retraso = true;
    // Mostrar las preguntas con retraso
    mostrarPreguntas(retraso);
});