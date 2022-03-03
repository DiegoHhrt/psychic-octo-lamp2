const tablero = (valCookie('tab') == 21) ? pasos21 : pasos42;
const jugadores = parseInt(valCookie('numJug'));

let juegoDiv;
let juegoCanvas;
let ctx;
let drawnFrames = 0;
let inicio;
let frame_previo = new Date();
let framerate = 0;
let fuente = new FontFace('fuente', 'url(../statics/fonts/I-pixel-u.ttf)');
let tamanoCasilla = 64;
let factorJuan = 0;
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
    preguntasYaHechas: [],
};

let imagenTablero = new Image();
if (tablero === pasos21) {
    imagenTablero.src = '../statics/img/21.png';
} else {
    imagenTablero.src = '../statics/img/42.png';
}

let dado = new Dado(
    (virtualWidth - imagenTablero.width) / 2 - 32,
    tamanoCasilla * 4.5
);

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
    {
        opcionId: '5',
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
        imagenTablero,
        0,
        0,
        imagenTablero.width,
        imagenTablero.height,
        (virtualWidth - imagenTablero.width) * factorJuan,
        (virtualHeight - imagenTablero.height) * factorJuan,
        imagenTablero.width * factorJuan,
        imagenTablero.width * factorJuan,
    );

    ctx.closePath();

    dado.actualizar(ctx, factorJuan);

    pulpitos.forEach(pulpito => {
        pulpito.actualizar(ctx, framerate, factorJuan);
    });

    conocerFramerate();
    requestAnimationFrame(cicloJuego);
}

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
    pregunta.contestadaCorrectamente = !!(n % 2);
    pregunta.numeroIntentos++;
    let divOpcion = document.getElementById(`${n}`);

    pregunta.contestable = false;
}

function iniciarJuego() {
    juegoDiv = document.getElementById("juego");
    juegoCanvas = document.getElementById("juego-canvas");
    ctx = juegoCanvas.getContext("2d");

    redimensionarCanvas();

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

    pulpitos.push(
        new Pulpito(
            '../statics/img/pulpito_sprite_sheet_ignorancia.png',
            virtualWidth - 24 - 16,
            virtualHeight - 24 - 16,
            'Ignorancia'
        )
    );


    inicio = new Date();
    cicloJuego();

    let estadoJuego = valCookie('estadoJuego');

    if (estadoJuego) {
        estadoJuego = JSON.parse(estadoJuego);
        document.getElementById('boton-dado').innerText = '¡Nueva pregunta!';
        new Promise(resolve => {
            setTimeout(() => {
                pulpitos.forEach((pulpito, indice) => {
                    moverCasilla(pulpito, estadoJuego.pulpitos[indice].casilla);
                });
                resolve();
            }, 1000);
        })
        .then(() => {
            turno(0);
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

async function moverCasilla(pulpito, num_casillas) {
    let {x, y} = pulpito;
    let casilla_actual = pulpito.casilla;
    pulpito.casilla += num_casillas;
    while (casilla_actual < pulpito.casilla) {
        pulpito.direccion = tablero[casilla_actual];
        while (pulpito.distancia(x, y) < tamanoCasilla && pulpito.direccion != undefined) {
            await sleep(100 / (framerate * 2));
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

function redimensionarCanvas() {
    juegoCanvas.width = window.innerWidth;
    juegoCanvas.height = window.innerWidth * (virtualHeight / virtualWidth);

    if (juegoCanvas.height > window.innerHeight) {
        juegoCanvas.height = window.innerHeight;
        juegoCanvas.width = window.innerHeight * (virtualWidth / virtualHeight);
    }

    factorJuan = juegoCanvas.width / virtualWidth;
    juegoCanvas.style.marginLeft = `${(window.innerWidth - juegoCanvas.width) / 2}px`;
    overlay.style.marginLeft = `${(window.innerWidth - juegoCanvas.width) / 2}px`;
    overlay.style.width = `${juegoCanvas.width}px`;
    overlay.style.height = `${juegoCanvas.height}px`;
    let botonDado = document.getElementById('boton-dado');
    botonDado.style.marginTop = `${400 * factorJuan}px`;
    botonDado.style.marginLeft = `${(48 * factorJuan) + ((window.innerWidth - juegoCanvas.width) / 2)}px`;
    botonDado.style.width = `${128 * factorJuan}px`;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function turno(indice) {
    if (fin) {
        return;
    }

    // Tirar el dado cuando haya nueva pregunta
    if (pregunta.indicePultpitoOriginal === null) {
        await esperarBoton('boton-dado');
        dado.tirando = true;
        await sleep(3000);
        dado.tirando = false;
        console.log(dado.getCara());
        await sleep(2000);
    }

    preguntar(indice);
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
                };
            } else if (pregunta.numeroIntentos === jugadores) {
                pregunta = {
                    contestable: false,
                    opcionElegida: null,
                    contestadaCorrectamente: null,
                    indicePultpitoOriginal: null,
                    numeroIntentos: 0,
                    valor: numeroAleatorio(2) + 1,
                };
                await moverCasilla(pulpitos[pulpitos.length - 1], pregunta.valor);
            }
            const estadoJuego = {
                arregloGanadores,
                pulpitos,
                pregunta
            }
            document.cookie = `estadoJuego=${JSON.stringify(estadoJuego)}`
            await sleep(2000);
            if (indice + 1 != pulpitos.length - 1) {
                turno(indice + 1);
            } else {
                turno(0);
            }
        }
    });
}

async function pedirPregunta() {
  const url = '../dynamics/obtener-preguntas.php';
  body = JSON.stringify({
    numJug: jugadores,
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
    // let idPregunta = '12';
    // let preguntaTexto = 'Returns a string containing a string representation of all the array elements in the same order, with the separator string between each element.';
    // let respuestas = [
    //     {
    //         respuesta: 'Esta es la respuesta 1',
    //         correcta: true,
    //     },
    //     {
    //         respuesta: 'Esta es la respuesta 2',
    //         correcta: false,
    //     },
    //     {
    //         respuesta: 'Esta es la respuesta 3',
    //         correcta: false,
    //     },
    //     {
    //         respuesta: 'Esta es la respuesta 4',
    //         correcta: false,
    //     },
    // ];
    //

    pedirPregunta().then((resp) => {
        let idPregunta = resp[0].id_pregunta;
        let preguntaTexto = resp[0].pregunta;
        let respuestas = [
            {
                respuesta: resp[0][0],
                correcta: true
            },
            {
                respuesta: resp[0][0],
                correcta: false
            },
            {
                respuesta: resp[0][0],
                correcta: false
            },
            {
                respuesta: resp[0][0],
                correcta: false
            },
        ]
        pregunta.preguntasYaHechas.push(idPregunta);
        let contenidoPreguntaDiv = document.getElementById('pregunta-texto');
        contenidoPreguntaDiv.innerText = preguntaTexto;

        let opciones = document.getElementById('pregunta');
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
        return esperarCambioContestable(pregunta.contestable, async () => {
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

    })

}

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

// document.getElementById('reiniciar-boton').addEventListener('click', () => {
//     document.cookie = `estadoJuego={}`;
// });

document.addEventListener("DOMContentLoaded", iniciarJuego);
