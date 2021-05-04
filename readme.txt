::::::::::::::::::::::::::IMPORTANTE:::::::::::::::::::::::::::::
:: ES NECESARIO TENER INSTALADO NPM Y NODE EN NUESTRO TERMINAL ::
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// PASOS A SEGUIR - INSTRUCCIONES //

1 - Ejecutar npm install
2 - Renombrar el archivo .env.example a .env
3 - Introducir en las variables del .env el Token y la URL del dominio de la API (sustituir las xxxx y las yy).
4 - En la consola, ubicados en la carpeta que contenga el archivo fichar.js ejecutar el comando:

     node fichar.js                       
     -> Jornada 8 horas, con Break de 1 hora a las 4 horas de trabajo
        
     node fichar.js --plan=0 --hours=     
     -> Jornada custom, se puede pasar: --hours (obligatorio), --minutes, --break-hour, --break-duration.
        
     node fichar.js --plan=1              
     -> Jornada 8,5 horas, con Break de 1 hora a las 4 horas de trabajo (ideal Lunes a Jueves)
        
     node fichar.js --plan=2              
     -> Jornada 6 horas, sin Break (ideal Viernes)
        
     node fichar.js --plan=3              
     -> Media Jornada de 4 horas, sin Break

  * si se le añade el comando --nonstop=true fuerza a no hacer los breaks en los planes que lo contengan.
  
  ** --break-hour solo admite numeros enteros, indica cuando realizar el break, pasadas X horas del inicio de la jornada.
  
  *** --break-duration solo admite numeros enteros, y es para indicar la duración del break.
  
  **** --test=true ejecuta una simulación del funcionamiento sin realizar la llamada al endpoint.


5 - Se muestran los horarios, y en cada fichaje, se notifica la acción y deberia aparecer un ID en la consola, es el ID del fichaje. 
    En caso de error deberia aparecer el error, seguramente el TOKEN haya caducado

6 - No cerrar esa consola/terminal ya que el script se queda ejecutandose hasta finalizar la jornada, si se cierra, el script deja de ejecutarse.

// FIN PASOS A SEGUIR - INSTRUCCIONES//

// QUE URL TIENE EL ENDPOINT //

Por lo general la url podría ser de este modo: https://ocean.yyyyyyyyy.xx/data/marcajes/realizar-manual

Donde por regla general las yyyyyyyy son el nombre de la compañia, como podría ser "foo" y las xx el dominio como podria ser "bar"

// FIN QUE URL TIENE EL ENDPOINT //

// COMO ENCONTRAR EL TOKEN //

** PARA ENCONTRAR EL TOKEN HAY QUE IR A https://ocean.xxxxxxx.yy/#/marcajes , inspeccionar la página, en aplicación, local storage y buscar el oceanApp.token o en la consola del navegador introducir:

        window.localStorage.getItem('oceanApp.token')

Y copiar lo que se encuentra entre "\"AQUI_EL_TOKEN\"" (no hay que copiar "\" ni \"", ni ninguna comilla)

Ejemplo:

"\"eyJasdfgasdf.asr32qTm3lx1qAeKww\"" el token es eyJasdfgasdf.asr32qTm3lx1qAeKww y esto deberia ir en el .env

// FIN COMO ENCONTRAR EL TOKEN //
