const tablero = (valCookie('tab') == 21) ? pasos21 : pasos42;
const jugadores = parseInt(valCookie('numJug'));
const pregunta = {
    contestable: false,
    opcionElegida: null,
};

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

    mostrarFramerate();
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
    opcionElegida = n;
    pregunta.contestable = false;
}

function iniciarJuego() {
    juegoDiv = document.getElementById("juego");
    juegoCanvas = document.getElementById("juego-canvas");
    ctx = juegoCanvas.getContext("2d");

    redimensionarCanvas();

    juegoCanvas.addEventListener("click", (evento) => {
        console.log(posicionMouse(evento));
    });

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
}

function mostrarFramerate() {
    ctx.beginPath();
    ctx.textAlign = "center";
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "20px monospace";

    if (Date.now() - frame_previo >= 1000) {
        framerate = drawnFrames;
        frame_previo = Date.now();
        drawnFrames = 0;
    }

    ctx.fillText(`${framerate} fps`, 50, 50);
    ctx.closePath();
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
    }
    fin = checarSiAcabaronTodos();
}

function posicionMouse(evento) {
    let clientRect = juegoCanvas.getBoundingClientRect();
    return {
        x: (evento.clientX - clientRect.left) / factorJuan,
        y: (evento.clientY - clientRect.top) / factorJuan,
    }
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
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
;
async function turno(indice) {
    if (fin) {
        return;
    }

    preguntar(indice);
    esperarCambioContestable(pregunta.contestable, async () => {
        await sleep(2000);
        if (indice != pulpitos.length - 1) {
            console.log(indice);
            await moverCasilla(pulpitos[indice], 22);
            await moverCasilla(pulpitos[pulpitos.length - 1], 1);
            await sleep(2000);
            if (indice + 1 != pulpitos.length - 1) {
                turno(indice + 1);
            } else {
                turno(0);
            }
        }
    });
}

async function preguntar(indice) {
    let span = document.getElementById('turno-jugador');
    span.innerText = `${pulpitos[indice].nombre}`

    pregunta.contestable = true;
    overlay.classList.remove('hidden');
    return esperarCambioContestable(pregunta.contestable, async () => {
        console.log('La opcion es', opcionElegida);
        await sleep(2000);
        overlay.classList.add('hidden');
    });
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

document.addEventListener("DOMContentLoaded", iniciarJuego);

