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
let fin = false;

let imagenTablero = new Image();
if (tablero === pasos21) {
    imagenTablero.src = '../statics/img/21.png';
} else {
    imagenTablero.src = '../statics/img/42.png';
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

    mostrarFramerate();
    pulpitos.forEach(pulpito => {
        pulpito.actualizar(ctx, framerate, factorJuan);
    });

    requestAnimationFrame(cicloJuego);
}

function desactivarSuavizado() {
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
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

function numeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + 1);
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

    // document.body.style.paddingLeft = (window.innerHeight - juegoCanvas.width) / 2;
    factorJuan = juegoCanvas.width / virtualWidth;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function checarSiAcabaronTodos() {
    let todosAcabaron = true;
    pulpitos.forEach(pulpito => {
        if (pulpito.casilla < tablero.length) {
            todosAcabaron = false;
        }
    })
    return todosAcabaron;
}

async function turno(indice) {
    if (fin) {
        return;
    }
    if (indice != pulpitos.length - 1) {
        moverCasilla(pulpitos[indice], numeroAleatorio(2, 3))
            .then(() => {
                moverCasilla(pulpitos[pulpitos.length - 1], 1)
                    .then(() => {
                        sleep(0).then(() => {
                            turno(indice + 1);
                        });
                    })
            });
    } else {
        turno(0);
    }
}

window.addEventListener("resize", redimensionarCanvas);

document.addEventListener("DOMContentLoaded", () => {
    juegoDiv = document.getElementById("juego");
    juegoCanvas = document.getElementById("juego-canvas");
    ctx = juegoCanvas.getContext("2d");

    redimensionarCanvas();

    juegoCanvas.addEventListener("click", (evento) => {
        console.log(posicionMouse(evento));
    });

    for (let i = 1; i <= jugadores; i++) {
        let dy = (i % 2) ? 0 : 32;
        let dx = (i > 1 && i < 4) ? 0 : 32;
        pulpitos.push(
            new Pulpito(
                `../statics/img/pulpito_sprite_sheet_p${i}.png`,
                virtualWidth - 24 - dx,
                virtualHeight - 24 - dy
            )
        );
    }

    pulpitos.push(
        new Pulpito(
            '../statics/img/pulpito_sprite_sheet_ignorancia.png',
            virtualWidth - 24 - 16,
            virtualHeight - 24 - 16
        )
    );

    inicio = new Date();
    cicloJuego();
});
