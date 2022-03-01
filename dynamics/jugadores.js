window.onload = ()=>{

    cookie = document.cookie
    //revisa con la cookie anterior cuantos jugadores seleccionaron
    arrCookie0 = cookie.split(";")
    arrCookie = arrCookie0[arrCookie0.length - 1].split("=")
    columna = document.getElementsByClassName("d-flex")
    boton = document.getElementById("continuar")
    row = document.getElementById("row")

    //asigna las columnas en base a los jugadores seleccionados
    if(arrCookie[1] >= 3 ){
         
        var col 
        if(arrCookie[1]==3){
            col = " col-4"
        }
        else{
            col = " col-3"
        }

        for(i=0; i<2; i++){
            columna[i].classList.remove("col-6")
            columna[i].className += col  
        }

        //genera los cuadros de los jugadores faltantes
        for(i=3; i<=arrCookie[1]; i++){
            div1 = document.createElement("div");
            //genera el div de la columna
            row.appendChild(div1)
            div1.setAttribute("id", "col"+i)
            div1.className += col + " d-flex justify-content-center";

            //genera la clase que trae el diseño del cuadro
            div2 = document.createElement("div")
            div2.setAttribute("id", "jugador"+i)
            div2.className+="jugador";
           //inserta el cuadro dentro de la columna
            document.getElementById("col"+i).appendChild(div2)
            
            //genera el pulpito de la imagen
            pulpo = document.createElement("img")
            pulpo.setAttribute("id", "pulpo"+i)
            pulpo.setAttribute("src", "../statics/img/pulpito_p"+i+".png")
            pulpo.setAttribute("width", "50%")
            pulpo.setAttribute("style", "margin-bottom: 20px;")

            //genera el input del nombre
            nombre = document.createElement("input")
            nombre.setAttribute("type", "text")
            nombre.setAttribute("placeholder", "Ingrese su nombre")
            nombre.setAttribute("id", i)
            nombre.className+= "nombre"

        
            document.getElementById("jugador"+i).appendChild(pulpo)
            document.getElementById("jugador"+i).appendChild(nombre)
        }
        

    }

    console.log(arrCookie)    

}