function acciones (evento) {

    const opt = evento.target.innerText;

    switch (opt) {
        case 'Jugar':
            window.location = "./templates/seleccion.html";
            break;

        case 'Instrucciones':
            console.log("Vamo a leer instrucciones");
            break;

        case 'Créditos':
            console.log("Vamo a leer créditos");
            break;
    }
}

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
        evento.target.focus();
        
        // Guardamos en una variable cuando esta haciendo hover en un boton.
        if (evento.target.className === "opcion") {
            mousover = true;
        }

    });
    
    // Asignación del evento 'mouseleave' a cada uno de los botones
    opciones.map( button => button.addEventListener( 'mouseleave', () => mousover = false )); // Guardamos en una variable cuando sale de un boton

    // Evento Click 
    opcionesDiv.addEventListener('click', evento => {
        // Solo funciona cuando hacer hover en alguno de los divs (mousover===true)
        if ( mousover ) {
            acciones(evento)
        }
    });

    // Seleccionar mediante teclado (tab y enter/espacio)
    opcionesDiv.addEventListener('keydown', evento => {
        if (evento.code === "Enter" || evento.code === "Space") {
            acciones(evento);
        }
    });

    // Elegir opcion con las flechas
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
                break
        }
    })
};
