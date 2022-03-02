function valCookie(nombreCookie) {
    let cookies = document.cookie;
    let arrCookies = cookies.split('; ');

    for (const valor of arrCookies) {
        const cookie = valor.split('=');
        if (cookie[0] === nombreCookie) {
            return cookie[1];
        }
    }
}

// Revisa con la cookie anterior cuantos jugadores seleccionaron
let cookieJug = valCookie('numJug');
let columna = document.getElementsByClassName('d-flex');
let row = document.getElementById('row');

// Asigna las columnas en base a los jugadores seleccionados
if (cookieJug >= 3) {
    let col = cookieJug === '3' ? 'col-4' : 'col-3';

    for (let i = 0; i < 2; i++) {
        columna[i].classList.remove('col-6');
        columna[i].classList.add(col);
    }

    // Genera los cuadros de los jugadores faltantes
    for (i = 3; i <= cookieJug; i++) {
        let div1 = document.createElement('div');
        // Genera el div de la columna
        row.appendChild(div1);
        div1.setAttribute('id', 'col' + i);
        div1.classList.add(col);
        div1.classList.add('d-flex');
        div1.classList.add('justify-content-center');

        // Genera la clase que trae el diseño del cuadro
        let div2 = document.createElement('div');
        div2.setAttribute('id', 'jugador' + i);
        div2.classList.add('jugador');
        // Inserta el cuadro dentro de la columna
        document.getElementById('col' + i).appendChild(div2);

        // Genera el pulpito de la imagen
        let pulpo = document.createElement('img');
        pulpo.setAttribute('id', 'pulpo' + i);
        pulpo.setAttribute('src', '../statics/img/pulpito_p' + i + '.png');
        pulpo.setAttribute('width', '50%');
        pulpo.setAttribute('style', 'margin-bottom: 20px;');

        // Genera el input del nombre
        let nombre = document.createElement('input');
        nombre.setAttribute('type', 'text');
        nombre.setAttribute('placeholder', `Jugador ${i}`);
        nombre.setAttribute('id', i);
        nombre.classList.add('nombre');

        document.getElementById('jugador' + i).appendChild(pulpo);
        document.getElementById('jugador' + i).appendChild(nombre);
    }
}

console.log(cookieJug);

function guardaNom() {
    let inputs = Array.from(document.getElementsByTagName('input'));
    let nom_jugs = [];

    // Asignación del arreglo de nombres.
    inputs.map((input, index) => {
        input.value = input.value === '' ? `Jugador ${index + 1}` : input.value;
        nom_jugs[index] = { nombre: input.value };
    });

    document.cookie = `nombres=${JSON.stringify(nom_jugs)}`;
}
