function acciones (evento) {

    const opt = evento.target.innerText;

    switch(opt) {
        case 'Jugar':
            console.log("Vamo a jugar");
            break;
            
        case 'Instrucciones':
            console.log("Vamo a leer instrucciones");
            break;
        
        case 'Créditos':
            console.log("Vamo a leer créditos");
            break;
    }
}

window.onload = () =>{
    
    const opciones = document.getElementById('opciones');

    //Seleccionar con el mouse
    opciones.addEventListener('click', evento => acciones(evento));

    //Seleccionar mediante teclado (tab y enter/espacio)
    opciones.addEventListener('keydown', evento => {
        if (evento.code === "Enter" | evento.code === "Space") {
            acciones(evento); 
        }
    });

};



