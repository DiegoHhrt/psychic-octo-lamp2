let cookie = document.cookie
//revisa con la cookie anterior cuantos jugadores seleccionaron
let arrCookie0 = cookie.split(";")
let arrCookie = arrCookie0[arrCookie0.length - 1].split("=")
let columna = document.getElementsByClassName("d-flex")
let row = document.getElementById("row")

//asigna las columnas en base a los jugadores seleccionados
if(arrCookie[1] >= 3 ){
        
    let col = (arrCookie[1]==="3")? "col-4" : "col-3";
    
    for(let i=0; i<2; i++) {
        columna[i].classList.remove("col-6");
        columna[i].classList.add(col);
    }

    //genera los cuadros de los jugadores faltantes
    for(i=3; i<=arrCookie[1]; i++) {
        let div1 = document.createElement("div");
        //genera el div de la columna
        row.appendChild(div1);
        div1.setAttribute("id", "col"+i);
        div1.classList.add(col);
        div1.classList.add("d-flex");
        div1.classList.add("justify-content-center");

        //genera la clase que trae el diseño del cuadro
        let div2 = document.createElement("div");
        div2.setAttribute("id", "jugador"+i);
        div2.classList.add("jugador");
        //inserta el cuadro dentro de la columna
        document.getElementById("col"+i).appendChild(div2);
        
        //genera el pulpito de la imagen
        let pulpo = document.createElement("img");
        pulpo.setAttribute("id", "pulpo"+i);
        pulpo.setAttribute("src", "../statics/img/pulpito_p"+i+".png");
        pulpo.setAttribute("width", "50%");
        pulpo.setAttribute("style", "margin-bottom: 20px;");

        //genera el input del nombre
        let nombre = document.createElement("input");
        nombre.setAttribute("type", "text");
        nombre.setAttribute("placeholder", "Ingrese su nombre");
        nombre.setAttribute("id", i);
        nombre.classList.add("nombre");

    
        document.getElementById("jugador"+i).appendChild(pulpo);
        document.getElementById("jugador"+i).appendChild(nombre);
    }
    
}

function guardaNom () {
    let inputs = Array.from(document.getElementsByTagName('input'));
    let nom_jugs = [];

    // Asignación del arreglo de nombres.
    inputs.map( (input, index) => {
        nom_jugs[index] = {nombre: input.value}
    });

    document.cookie = `nombres=${JSON.stringify(nom_jugs)}`; // Se guarda en las cookies.
}