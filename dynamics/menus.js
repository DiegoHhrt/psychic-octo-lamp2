let opcionesMenu = [];

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
        if (evento.code === "Enter" || evento.code === "Space") {
            acciones(opciones[indice]);
        }
    });

    // Elegir opción con las flechas
    window.addEventListener('keydown', evento => {
        switch (evento.key) {
            case 'ArrowUp':
                indice--;
                indice = (indice >= 0) ? indice : opciones.length - 1;
                opciones[indice].focus();
                break;
            case 'ArrowDown':
                indice = (indice + 1) % opciones.length;
                opciones[indice].focus();
                break;
        }
    })
};

switch (obtenerPaginaActual()) {
    case 'index.html':
        opcionesMenu = [
            {
                opcionId: 'jugar',
                callback: () => {
                    window.location = './templates/seleccion.html'
                },
            },
            {
                opcionId: 'instrucciones',
                callback: () => {
                    console.log('instrucciones');
                },
            },
            {
                opcionId: 'creditos',
                callback: () => {
                    console.log('creditos');
                },
            },
        ]
        break;
    case 'seleccion.html':
        opcionesMenu = [
            {
                opcionId: '2',
                callback: () => {
                    console.log('Dos jugadores');
                },
            },
            {
                opcionId: '3',
                callback: () => {
                    console.log('Tres jugadores');
                },
            },
            {
                opcionId: '4',
                callback: () => {
                    console.log('Cuatro jugadores');
                },
            },
        ]
        break;
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
