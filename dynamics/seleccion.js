window.onload = () => {
    jug = document.getElementsByClassName("cuadro")
    document.cookie = "numJug = 2"
    opcion = document.getElementsByClassName("opcion");
    //redireccionamiento a jugadores.html
    opcion[0].addEventListener('click',function (redir) {
        redir.preventDefault(); //esto cancela el comportamiento del click
        setTimeout(()=> location.href="./jugadores.html");
      });

    document.addEventListener("click", function(evento){
        if(evento.target.className == "cuadro"){
            document.cookie = "numJug =" + evento.target.id
        }
        console.log(document.cookie)
    })

}