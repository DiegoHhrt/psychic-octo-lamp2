window.onload = ()=>{
    cookie = document.cookie
    arrCookie = cookie.split("=")

    if(arrCookie[1] == 3 ){
        columna = document.getElementsByClassName("col-6")
        
        console.log(columna)

        columna[0].removeClass("col-6")
        columna[1].removeClass("col-6")
    }

    console.log(arrCookie[1])    

}