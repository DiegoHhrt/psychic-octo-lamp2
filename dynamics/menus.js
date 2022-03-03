let opcionesMenu = [];
let pag;

window.onload = () => {

    let indice = 0;
    let mousover = false;
    const opcionesDiv = document.getElementById('opciones');
    const opciones = Array.from(document.getElementsByClassName('opcion'));
    opciones[indice].focus();

    // Seleccionar con el mouse
    opcionesDiv.addEventListener('mouseover', (evento) => {
        indiceTarget = opciones.indexOf(evento.target);
        indice = (indiceTarget >= 0) ? indiceTarget : indice;
        opciones[indice].focus();

        if (evento.target.classList.contains("opcion")) {
            mousover = true;
        }
    });

    // Evento que detecta cuando el mouse se sale de un botón
    opciones.map(button => button.addEventListener('mouseleave', () => {
        mousover = false;
    }));

    // Evento Click
    opcionesDiv.addEventListener('click', evento => {
        // Sólo se puede hacer click en una opción si el mouse está encima
        if (mousover) {
            acciones(opciones[indice]);
        }
    });

    // Seleccionar mediante teclado (enter/espacio)
    window.addEventListener('keydown', evento => {
        if (evento.code === "Enter") {
            acciones(opciones[indice]);
        }
    });

    // Elegir opción con las flechas
    window.addEventListener('keydown', evento => {
        if (evento.key === 'ArrowUp' || evento.key === 'ArrowLeft') {
            indice--;
            indice = (indice >= 0) ? indice : opciones.length - 1;
            opciones[indice].focus();
        } else if (evento.key === 'ArrowDown' || evento.key === 'ArrowRight') {
            indice = (indice + 1) % opciones.length;
            opciones[indice].focus();
        }
    })
};

pag = obtenerPaginaActual();

if (pag === 'index.html' || pag === 'psychic-octo-lamp') {
    opcionesMenu = [
        {
            opcionId: 'jugar',
            callback: () => {
                window.location = './templates/seleccion.html';
            },
        },
        {
            opcionId: 'instrucciones',
            callback: () => {
                window.location = './templates/instrucciones.html'
            },
        },
    ]
} else if (pag === 'seleccion.html') {
    opcionesMenu = [
        {
            opcionId: '2',
            callback: () => {
                document.cookie = "numJug =" + 2;
                window.location = './jugadores.html';
            },
        },
        {
            opcionId: '3',
            callback: () => {
                document.cookie = "numJug =" + 3;
                window.location = './jugadores.html';
            },
        },
        {
            opcionId: '4',
            callback: () => {
                document.cookie = "numJug =" + 4;
                window.location = './jugadores.html';
            },
        },
    ]
} else if (pag === 'jugadores.html') {
    opcionesMenu = [
        {
            opcionId: 'continuar',
            callback: () => {
                guardaNom();
                window.location = './tam_tablero.html'
            },
        },
    ]
} else if (pag === 'tam_tablero.html') {
    opcionesMenu = [
        {
            opcionId: "21",
            callback: () => {
                document.cookie = "tab = 21";
                document.cookie = `estadoJuego={}`;
                window.location = './juego.html';
            }
        },
        {
            opcionId: "42",
            callback: () => {
                document.cookie = "tab = 42";
                document.cookie = `estadoJuego={}`;
                window.location = './juego.html';
            }
        },
    ]
}

function acciones(opcion) {
    opcionesMenu.forEach(elemento => {
        if (opcion.id === elemento.opcionId) {
            elemento.callback();
        }
    });
}

function obtenerPaginaActual() {
    let url = window.location.toString().split('/');
    let paginaActual = '';
    do {
        paginaActual = url.pop();
    } while (paginaActual === '');

    return paginaActual;
}
