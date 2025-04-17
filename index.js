let INDEX_PREGUNTA = 0;
let objetoPregunta; // Mantener como global
let opciones = [];  // Mantener como global
let preguntasSeleccionadas = []; // Array para las preguntas seleccionadas en cada ejecución
let respuestasCorrectas = 0; // Contador de respuestas correctas

// Función para seleccionar aleatoriamente 6 preguntas cada vez que se ejecute el quiz
function seleccionarPreguntasAleatorias() {
    respuestasCorrectas = 0; // Reiniciar el contador de respuestas correctas
    INDEX_PREGUNTA = 0; // Reiniciar el índice

    // Crear una copia de baseDePreguntas y mezclarla
    let preguntasMezcladas = [...baseDePreguntas].sort(() => Math.random() - 0.5);

    // Seleccionar las primeras 6 preguntas
    preguntasSeleccionadas = preguntasMezcladas.slice(0, 10);
}

// Función para mostrar el video de inicio
function mostrarVideoInicio() {
    document.getElementById("video-inicio").style.display = "block"; // Muestra el video de inicio
    document.getElementById("tablero-de-preguntas").style.display = "none"; // Oculta el tablero

    // Añadir evento para habilitar el botón cuando el video termine
    document.getElementById("video-entrada").addEventListener('ended', function() {
        document.getElementById("boton-inicio").disabled = false; // Habilita el botón
    });
}

// Llamar a la función mostrarVideoInicio al cargar la página
document.addEventListener('DOMContentLoaded', mostrarVideoInicio);


// Función para ocultar el video de inicio y comenzar el quiz
function iniciarQuiz() {
    document.getElementById("inicio-sonido").play();
    setTimeout(function() {
    document.getElementById("video-inicio").style.display = "none"; // Ocultar video de inicio
    document.getElementById("tablero-de-preguntas").style.display = "block"; // Mostrar preguntas
    seleccionarPreguntasAleatorias(); // Selecciona preguntas
    cargarPregunta(INDEX_PREGUNTA); // Carga la primera pregunta

    // Reproducir audio del quiz
    let quizAudio = document.createElement("audio");
    quizAudio.id = "quiz-audio";
    quizAudio.src = "extras/quiz.mp3";
    document.body.appendChild(quizAudio);

    // Asegurarse de que el audio está cargado antes de reproducirlo
    quizAudio.onloadeddata = function() {
        quizAudio.play();
    };
}, 1000);
}

function cargarPregunta(index) {
    objetoPregunta = preguntasSeleccionadas[index];
    opciones = [...objetoPregunta.distractores, objetoPregunta.respuesta];
    opciones.sort(() => Math.random() - 0.5);

    document.getElementById("pregunta").innerHTML = objetoPregunta.pregunta;
    document.getElementById("opcion-1").innerHTML = opciones[0];
    document.getElementById("opcion-2").innerHTML = opciones[1];
    document.getElementById("opcion-3").innerHTML = opciones[2];
}

function seleccionarOpcion(index) {
    document.body.style.pointerEvents = 'none'; // Deshabilitar clics mientras se procesa la respuesta
    let validezRespuesta = opciones[index] === objetoPregunta.respuesta; // Verificar respuesta

    if (validezRespuesta) {
        respuestasCorrectas++;  // Incrementar el contador de respuestas correctas
        document.getElementById("celebracion-gif").style.display = "block"; // Mostrar GIF de celebración
        document.getElementById("celebracion-sonido").play(); // Reproducir sonido de celebración
        document.getElementById("opcion-" + (index + 1)).classList.add("correcta"); // Marcar opción correcta

        setTimeout(() => {
            document.getElementById("celebracion-gif").style.display = "none"; // Ocultar GIF de celebración
            document.getElementById("opcion-" + (index + 1)).classList.remove("correcta"); // Quitar estilo
            document.body.style.pointerEvents = 'auto'; // Habilitar clics
            siguientePregunta(); // Cargar la siguiente pregunta
        }, 2000);
    } else {
        document.getElementById("opcion-" + (index + 1)).classList.add("incorrecta"); // Marcar opción incorrecta
        let correctIndex = opciones.indexOf(objetoPregunta.respuesta); // Obtener el índice de la respuesta correcta
        document.getElementById("opcion-" + (correctIndex + 1)).classList.add("correcta"); // Marcar opción correcta
        document.getElementById("error-sonido").play(); // Reproducir sonido de error

        setTimeout(() => {
            document.getElementById("opcion-" + (index + 1)).classList.remove("incorrecta"); // Quitar estilo
            document.getElementById("opcion-" + (correctIndex + 1)).classList.remove("correcta"); // Quitar estilo
            document.body.style.pointerEvents = 'auto'; // Habilitar clics
            siguientePregunta(); // Cargar la siguiente pregunta
        }, 2000);
    }
}

function siguientePregunta() {
    INDEX_PREGUNTA++; // Incrementar el índice

    // Si hemos completado las 10 preguntas
    if (INDEX_PREGUNTA >= 10) {
        mostrarVideoFinal(); // Mostrar la pantalla final con los resultados
    } else {
        cargarPregunta(INDEX_PREGUNTA); // Cargar la siguiente pregunta
    }
}

// Función para mostrar el video final
function mostrarVideoFinal() {
    // Detener el audio del quiz
    let quizAudio = document.getElementById("quiz-audio");
    if (quizAudio) {
        quizAudio.pause();
        quizAudio.remove();
    }

    // Ocultar tablero de preguntas
    document.getElementById("tablero-de-preguntas").style.display = "none";

    // Mostrar video final basado en el tipo de resultado
    if (respuestasCorrectas >= 1) {
        document.getElementById("video-final-bien").style.display = "block";
        document.getElementById("exito-gif").style.display = "block";
        document.getElementById("audio-exito").play();
        document.getElementById("respuestas-correctas-bien").textContent = `Respuestas correctas: ${respuestasCorrectas} / 10`;
        setTimeout(() => {
        document.getElementById("video-salida-bien").play();
        document.getElementById("video-salida-bien").addEventListener('ended', function() {
            document.getElementById("boton-final-bien").disabled = false; // Habilitar el botón
        });
        },3500)
    } else {
        document.getElementById("video-final-mal").style.display = "block";
        document.getElementById("respuestas-correctas-mal").textContent = `Respuestas correctas: ${respuestasCorrectas} / 10`;
        document.getElementById("audio-fracaso").play();
        setTimeout(() => {
        document.getElementById("video-salida-mal").play();
        document.getElementById("video-salida-mal").addEventListener('ended', function() {
            document.getElementById("boton-final-mal").disabled = false; // Habilitar el botón
        });
    },3000)
    }
}

function reiniciarQuiz() {
    setTimeout(function() {
        // Ocultar la pantalla de resultados y mostrar la pantalla de inicio
        document.getElementById("video-final-bien").style.display = "none"; // Ocultar video de éxito
        document.getElementById("video-final-mal").style.display = "none"; // Ocultar video de fracaso
        document.getElementById("exito-gif").style.display ="none";
        document.getElementById("video-inicio").style.display = "block";
        document.getElementById("boton-inicio").disabled = true;
        document.getElementById("boton-final-bien").disabled = true;
        document.getElementById("boton-final-mal").disabled = true;
        document.getElementById("video-entrada").play(); // Mostrar video de inicio

        // Reiniciar el índice de la pregunta y respuestas correctas
        INDEX_PREGUNTA = 0; // Reiniciar el índice de preguntas
        respuestasCorrectas = 0; // Reiniciar el contador de respuestas correctas

        seleccionarPreguntasAleatorias(); // Seleccionar nuevas preguntas
        cargarPregunta(INDEX_PREGUNTA); // Cargar la primera pregunta

        // Detener y remover el audio del quiz
        let quizAudio = document.getElementById("quiz-audio");
        if (quizAudio) {
            quizAudio.pause();
            quizAudio.remove();
        }

        // Asegurarse de que el tablero de preguntas esté oculto al reiniciar
        document.getElementById("tablero-de-preguntas").style.display = "none";
    }, 1000); // 1 segundo de retraso antes de ejecutar la función
}
// Mostrar el video de inicio al cargar la página
window.onload = mostrarVideoInicio; // Llama a la función al cargar
