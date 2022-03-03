const tablero = (valCookie('tab') == 21) ? pasos21 : pasos42;
const jugadores = parseInt(valCookie('numJug'));

let juegoDiv;
let juegoCanvas;
let ctx;
let drawnFrames = 0;
let frame_previo = new Date();
let framerate = 60;
let fuente = new FontFace('fuente', 'url(../statics/fonts/I-pixel-u.ttf)');
let tamanoCasilla = 64;
let factor = 0;
let virtualHeight = 480;
let virtualWidth = 672;
let pulpitos = [];
let overlay = document.getElementById('overlay');
let fin = false;
let arregloGanadores = [];
let pregunta = {
    contestable: false,
    opcionElegida: null,
    contestadaCorrectamente: null,
    indicePultpitoOriginal: null,
    numeroIntentos: 0,
    valor: numeroAleatorio(2) + 1,
    preguntasYaHechas: [-1],
};
let infoPregunta = {};

// Se cambia de imagen de tablero dependiendo de lo elegido
let imagenTablero = new Image();
if (tablero === pasos21) {
    imagenTablero.src = '../statics/img/21.png';
} else {
    imagenTablero.src = '../statics/img/42.png';
}

let octolamp = new Image();
octolamp.src = '../statics/img/octolamp.png'

let dado = new Dado(
    (virtualWidth - imagenTablero.width) / 2 - 32,
    tamanoCasilla * 4.5
);

// Las opciones elegibles en cada pregunta
opcionesMenu = [
    {
        opcionId: '1',
        callback: () => {
           elegirOpcion(1);
        }
    },
    {
        opcionId: '2',
        callback: () => {
           elegirOpcion(2);
        }
    },
    {
        opcionId: '3',
        callback: () => {
           elegirOpcion(3);
        }
    },
    {
        opcionId: '4',
        callback: () => {
           elegirOpcion(4);
        }
    },
];

function checarSiAcabaronTodos() {
    let todosAcabaron = true;
    for (let i = 0; i < pulpitos.length - 1; i++) {
        if (pulpitos[i].casilla < tablero.length) {
            todosAcabaron = false;
        }
    }
    return todosAcabaron;
}

function cicloJuego() {
    desactivarSuavizado();
    ctx.beginPath();
    ctx.fillStyle = "#0096A7";
    ctx.fillRect(0, 0, juegoCanvas.width, juegoCanvas.height);

    ctx.drawImage(
        octolamp,
        0,
        0,
        octolamp.width,
        octolamp.height,
        10 * factor,
        75 * factor,
        octolamp.width * factor / 4,
        octolamp.height * factor / 4,
    );
    ctx.drawImage(
        imagenTablero,
        0,
        0,
        imagenTablero.width,
        imagenTablero.height,
        (virtualWidth - imagenTablero.width) * factor,
        (virtualHeight - imagenTablero.height) * factor,
        imagenTablero.width * factor,
        imagenTablero.width * factor,
    );

    ctx.closePath();

    dado.actualizar(ctx, factor);

    pulpitos.forEach(pulpito => {
        pulpito.actualizar(ctx, framerate, factor);
    });

    conocerFramerate();
    requestAnimationFrame(cicloJuego);
}

// Función necesaria par que los pulpitos no se vean borrosos
function desactivarSuavizado() {
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
}

function elegirOpcion(n) {
    if (!pregunta.contestable) {
        return;
    }
    pregunta.opcionElegida = n;
    pregunta.contestadaCorrectamente = (pregunta.opcionCorrecta == n);
    pregunta.numeroIntentos++;
    let divOpcion = document.getElementById(`${n}`);

    pregunta.contestable = false;
}

// Prepara las cosas para ejecutar el juego
function iniciarJuego() {
    juegoDiv = document.getElementById("juego");
    juegoCanvas = document.getElementById("juego-canvas");
    ctx = juegoCanvas.getContext("2d");
    redimensionarCanvas();

    // Crea los pulpitos en las esquinas de la primera casilla
    let nombresPulpitos = JSON.parse(valCookie('nombres'));
    for (let i = 1; i <= jugadores; i++) {
        let dy = (i % 2) ? 0 : 32;
        let dx = (i > 1 && i < 4) ? 0 : 32;
        pulpitos.push(
            new Pulpito(
                `../statics/img/pulpito_sprite_sheet_p${i}.png`,
                virtualWidth - 24 - dx,
                virtualHeight - 24 - dy,
                nombresPulpitos[i - 1].nombre
            )
        );
    }

    // Ignorancia
    pulpitos.push(
        new Pulpito(
            '../statics/img/pulpito_sprite_sheet_ignorancia.png',
            virtualWidth - 24 - 16,
            virtualHeight - 24 - 16,
            'Ignorancia'
        )
    );


    cicloJuego();

    let estadoJuego = valCookie('estadoJuego');

    // Si ya existe una cookie con estado de juego, hay que cargarlo
    if (estadoJuego && estadoJuego !== '{}') {
        estadoJuego = JSON.parse(estadoJuego);
        document.getElementById('boton-dado').innerText = '¡Nueva pregunta!';
        new Promise(resolve => {
            setTimeout(() => {
                pulpitos.forEach(async (pulpito, indice) => {
                    pulpito.nombre = estadoJuego.pulpitos[indice].nombre;
                    await moverCasilla(pulpito, estadoJuego.pulpitos[indice].casilla);
                });
                resolve();
            }, 1000);
        })
        .then(() => {
            if (estadoJuego.indice < pulpitos.length - 2) {
                turno(estadoJuego.indice + 1);
            } else {
                turno(0);
            }
        });
    } else {
        turno(0);
    }

}

function conocerFramerate() {
    if (Date.now() - frame_previo >= 1000) {
        framerate = drawnFrames;
        frame_previo = Date.now();
        drawnFrames = 0;
    }
    drawnFrames++;
}

// Mueve un pulpito un cierto número de casillas
async function moverCasilla(pulpito, num_casillas) {
    let {x, y} = pulpito;
    let casilla_actual = pulpito.casilla;
    pulpito.casilla += num_casillas;
    while (casilla_actual < pulpito.casilla) {
        pulpito.direccion = tablero[casilla_actual];
        while (pulpito.distancia(x, y) < tamanoCasilla && pulpito.direccion != undefined) {
            await sleep(5);
        }
        x = pulpito.x;
        y = pulpito.y;
        casilla_actual++;
    }
    pulpito.direccion = '';
    if (pulpito.casilla >= tablero.length) {
        pulpito.direccion = 'nadando';
        arregloGanadores.push(pulpito);
    }
    fin = checarSiAcabaronTodos();
}

// Cambia el tamaño del canvas y elementos relacionados, manteniendo sus proporciones
function redimensionarCanvas() {
    juegoCanvas.width = window.innerWidth;
    juegoCanvas.height = window.innerWidth * (virtualHeight / virtualWidth);

    if (juegoCanvas.height > window.innerHeight) {
        juegoCanvas.height = window.innerHeight;
        juegoCanvas.width = window.innerHeight * (virtualWidth / virtualHeight);
    }

    factor = juegoCanvas.width / virtualWidth;
    juegoCanvas.style.marginLeft = `${(window.innerWidth - juegoCanvas.width) / 2}px`;
    overlay.style.marginLeft = `${(window.innerWidth - juegoCanvas.width) / 2}px`;
    overlay.style.width = `${juegoCanvas.width}px`;
    overlay.style.height = `${juegoCanvas.height}px`;
    let botonDado = document.getElementById('boton-dado');
    botonDado.style.marginTop = `${400 * factor}px`;
    botonDado.style.marginLeft = `${(48 * factor) + ((window.innerWidth - juegoCanvas.width) / 2)}px`;
    botonDado.style.width = `${128 * factor}px`;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Función recursiva que le da su turno a los pulpitos
async function turno(indice) {
    if (fin) {
        return;
    }

    let imagenPulpito = document.getElementById('imagen-pulpito');
    imagenPulpito.src = `../statics/img/pulpito_p${indice + 1}.png`;

    // Tirar el dado cuando haya nueva pregunta
    if (pregunta.indicePultpitoOriginal === null) {
        await esperarBoton('boton-dado');
        dado.tirando = true;
        await sleep(3000);
        dado.tirando = false;
        await sleep(2000);
    }

    await preguntar(indice);
    esperarCambioContestable(pregunta.contestable, async () => {
        await sleep(4000);
        if (indice != pulpitos.length - 1) {
            if (pregunta.contestadaCorrectamente) {
                await moverCasilla(pulpitos[indice], pregunta.valor);
                pregunta = {
                    contestable: false,
                    opcionElegida: null,
                    contestadaCorrectamente: null,
                    indicePultpitoOriginal: null,
                    numeroIntentos: 0,
                    valor: numeroAleatorio(2) + 1,
                    preguntasYaHechas: pregunta.preguntasYaHechas,
                };
            } else if (pregunta.numeroIntentos === jugadores) {
                await moverCasilla(pulpitos[pulpitos.length - 1], pregunta.valor);
                pregunta = {
                    contestable: false,
                    opcionElegida: null,
                    contestadaCorrectamente: null,
                    indicePultpitoOriginal: null,
                    numeroIntentos: 0,
                    valor: numeroAleatorio(2) + 1,
                    preguntasYaHechas: pregunta.preguntasYaHechas,
                };
            }

            // Se guarda el estado del juego en una cookie
            const estadoJuego = {
                arregloGanadores,
                pulpitos,
                pregunta,
                indice
            }
            document.cookie = `estadoJuego=${JSON.stringify(estadoJuego)}`
            await sleep(2000);

            // Siguiente turno
            if (indice + 1 != pulpitos.length - 1) {
                turno(indice + 1);
            } else {
                turno(0);
            }
        }
    });
}

// Petición al archivo PHP que regresa una pregunta y opciones
async function pedirPregunta() {
  const url = '../dynamics/obtener-preguntas.php';
  body = JSON.stringify({
    temaId: dado.getCara(),
    preguntasYaHechas: pregunta.preguntasYaHechas
  });
  let resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body
  });
  return resp.json();
}

async function preguntar(indice) {
    document.getElementById('boton-dado').innerText = '¡Nueva pregunta!';

    // Cuando no se ha contestado previamente una pregunta, se pide una nueva
    if (pregunta.contestadaCorrectamente === null) {
        infoPregunta = await pedirPregunta();
        console.log(infoPregunta);
    }

    let idPregunta = infoPregunta[0].id_pregunta;
    let preguntaTexto = infoPregunta[0].pregunta;
    let respuestas = [
        {
            respuesta: infoPregunta[0][0].respuesta,
            correcta: true,
        },
        {
            respuesta: infoPregunta[0][1].respuesta,
            correcta: false,
        },
        {
            respuesta: infoPregunta[0][2].respuesta,
            correcta: false,
        },
        {
            respuesta: infoPregunta[0][3].respuesta,
            correcta: false,
        },
    ];

    // Randomizar orden de las respuestas
    respuestas = respuestas.sort(() => Math.random() - 0.5);

    respuestas.forEach((respuesta, indice) => {
        if (respuesta.correcta === true) {
            pregunta.opcionCorrecta = indice + 1;
        }
    });


    // Llenar el texto del div de la pregunta
    pregunta.preguntasYaHechas.push(idPregunta);
    let contenidoPreguntaDiv = document.getElementById('pregunta-texto');
    contenidoPreguntaDiv.innerText = preguntaTexto;

    respuestas.forEach((respuesta, indice) => {
        let boton = document.getElementById(`${indice + 1}`);
        boton.innerText = respuesta.respuesta;
    })

    let spanTurno = document.getElementById('turno-jugador');
    spanTurno.innerText = `${pulpitos[indice].nombre}`
    let spanTema = document.getElementById('tema-pregunta');
    spanTema.innerText = `${dado.getCara()}`
    let spanValor = document.getElementById('valor-pregunta');
    spanValor.innerText = `${pregunta.valor}`
    let spanCorrecta = document.getElementById('es-correcta');
    spanCorrecta.innerText = '';

    pregunta.contestable = true;
    overlay.classList.remove('hidden');

    // Se espera a que se conteste la pregunta
    esperarCambioContestable(pregunta.contestable, async () => {
        if (pregunta.contestadaCorrectamente) {
            spanCorrecta.innerText = `¡Respuesta correcta! Avanzarás ${pregunta.valor} casillas.`;
            spanCorrecta.className = 'correcta';
        } else if (pregunta.numeroIntentos !== jugadores) {
            spanCorrecta.innerText = `Respuesta incorrecta... Veamos si alguien más puede contestar...`;
            spanCorrecta.className = 'incorrecta';
        } else {
            spanCorrecta.innerText = `Respuesta incorrecta... Ahora avanzará la ignorancia...`;
            spanCorrecta.className = 'incorrecta';
        }
        if (pregunta.indicePultpitoOriginal === null) {
            pregunta.indicePultpitoOriginal = indice;
        }
        await sleep(4000);
        overlay.classList.add('hidden');
    });
}

// Devuelve una promesa que se cumple cuando se presiona un botón
async function esperarBoton(id) {
    return new Promise(res => {
        let botonDado = document.getElementById(id);
        botonDado.style.display = 'block';

        new Promise(resolve => {
            botonDado.addEventListener('click', () => {
                return resolve();
            });
        })
        .then(() => {
            botonDado.style.display = 'none';
            res();
        })
    })
}

// Ejecuta un callback cuando cambia la propiedad contestable de la pregunta
async function esperarCambioContestable(valorAnterior, callback) {
    if (pregunta.contestable === valorAnterior) {
        return new Promise(resolve => {
            setTimeout(() => {
                esperarCambioContestable(valorAnterior, callback);
            }, 100);
        });
    } else {
        callback();
    }
}

window.addEventListener("resize", redimensionarCanvas);

document.addEventListener("DOMContentLoaded", iniciarJuego);
