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
    const tabla = document.querySelector("table");

    let filaActual = document.querySelector(`tr[data-id="${preguntaObj.pregunta}"]`);

    // Si existe la fila, actualiza los datos
    if (filaActual) {
        filaActual.querySelector(".estado").textContent = preguntaObj.estado;
        filaActual.querySelector(".respuesta").textContent = preguntaObj.respuesta;
        filaActual.querySelector(".puntuacion").textContent = preguntaObj.puntuacion;
    } else{ // Si no exise la fila, se con un identificador único para la pregunta
        const filaNueva = document.createElement("tr");
        filaNueva.setAttribute("data-id", preguntaObj.pregunta); 
        filaNueva.innerHTML = `
        <td class="pregunta">${preguntaObj.pregunta}</td>
        <td class="respuesta">${preguntaObj.respuesta}</td>
        <td class="puntuacion">${preguntaObj.puntuacion}</td>
        <td class="estado">${preguntaObj.estado}</td>
    `;

        // Agregamos/Añadimos la fila
        tabla.appendChild(filaNueva);
        }
}


// Nombre del usuario
const username = localStorage.getItem("username");

// Valor de la cookie
let valorCookie = getCookie(username);

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


// Guardar pregunta con retraso de 5s
function guardarPregunta(nuevaPregunta){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                // Aactualizar el estado de la pregunta
                const preguntaIndex = valores_usuario.preguntas.findIndex(pregunta => pregunta.pregunta === nuevaPregunta.pregunta);
                if (preguntaIndex !== -1) {
                    valores_usuario.preguntas[preguntaIndex].estado = "OK";
                }    
                // Guardar el JSON actualizado en la cookie
                setCookie(username, JSON.stringify(valores_usuario), 7);
        
                // Actualizar el valor de la pregunta en la tabla
                agregarFila(valores_usuario.preguntas[preguntaIndex]);

                // Habilitar el boton de atras
                atras.disabled = false;

                resolve();
            } catch (error) {
                reject(error);
            }
        }, 5000);
    })
};



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

    // Pasar nueva pregunta a formato JSON
    const nuevaPregunta = {
        pregunta: nombrePregunta.value,
        respuesta: respuestaSeleccionada,
        puntuacion: parseInt(puntuacion.value),
        estado: "Guardando..."
    };

    // Agregar la nueva pregunta al array de preguntas del JSON
    valores_usuario.preguntas.push(nuevaPregunta);

    // Mostrar la pregunta en la tabla
    agregarFila(nuevaPregunta);

    // Deshabilitar el boton de retroceder
    atras.disabled = true;

    // Guardar la pregunta tanto en el JSON como en la cookie
    guardarPregunta(nuevaPregunta).then(() => {
        // Habilitar el boton de retroceder
        atras.disabled = false;
    
        }).catch((error) => {
            console.error("Error al guardar la pregunta:", error);
            // Actualizar la fila con el estado de la pregunta
            nuevaPregunta.estado = "ERROR";
            agregarFila(nuevaPregunta);
            // Habilitar el boton de retroceder
            atras.disabled = true;
            
    });
});



document.addEventListener("DOMContentLoaded", () => {
    // Mostrar las preguntas Actuals de la cookie, si existen
    if (valores_usuario.preguntas) {
        valores_usuario.preguntas.forEach((pregunta) => agregarFila(pregunta));
    }
});
