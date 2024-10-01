let options = {
    enableHighAccuracy : true,
    timeout: 3000,
    maximumAge: 0//así siempre calcula la posición actual
};

if (navigator.geolocation) {//comprobar que el usuario tenga habilitado la geolocalización
    navigator.geolocation.getCurrentPosition(success, error, options);//da la ubicación del usuario que está usando la web (getCurrentPosition)

}else{
    alert('Los servicios de geolocalización no están disponibles');
}

function success(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    let map = L.map('map',{
        center: [latitude,longitude],
        zoom: 14
    });//se crea y centra el mapa en las coordenadas señaladas 

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'My Open Street Map'
    }).addTo(map);//se añade un cartel en el mapa


    //-----------Se crea el icono-------------------
    let inicio = L.icon(
        {iconUrl: '../assets/images/ubicacionUsu.png',
        iconSize: [45,60],
        iconAnchor: [25,60],
         popupAnchor: [-3,-76]
        }
    )

    let fin = L.icon(
        {iconUrl: '../assets/images/ubicacion.png',
         iconSize: [45,60],
         iconAnchor: [3,60],
         popupAnchor: [-3,-76]
        }
    )

    //----------Se calcula la ruta
    let control = L.Routing.control({
        waypoints: [
          L.latLng(latitude, longitude),
          L.latLng(20.3719164,-76.6297183)
        ],
        language: 'es',
        createMarker: function (i, wp, nWps) {
            switch (i) {
                case 0:
                    return L.marker(wp.latLng, {icon: inicio, draggable: true}).bindPopup("Su ubicación");
                case nWps-1:
                    return L.marker(wp.latLng, {icon: fin, draggable: true}).bindPopup("Tienda FM Cubana");
                // default:
                //     return L.marker(wp.latLng, {icon: medio, draggable: true}).bindPopup("Paso Intermedio");
            }
        }
      }).addTo(map);
};

function error() {
    
}


/////////////////////////////////////Formulario de contacto/////////////////////////////////////////////

let nombre = document.getElementById('nombre');
let apellidos = document.getElementById('apellidos');
let telefono = document.getElementById('telef');
let email = document.getElementById('email');
let info = document.getElementById('info');
let form = document.querySelector('form');

let valida = {
    nombre: false,
    apellidos: false,
    telefono: false,
    email: false,
    info:  false
};

let setError = (etiqueta, mensaje)=>{
    let formControl = etiqueta.parentElement;
    const small = formControl.querySelector('small');
    let identificadorForm = formControl.parentElement;

    identificadorForm.className = 'identificadorError';
    formControl.className = 'inputError';
    small.className = 'mostrarSmall';
    small.innerText = mensaje;
}

let setSuccess = (etiqueta)=>{
    let formControl = etiqueta.parentElement;
    const small = formControl.querySelector('small');
    let identificadorForm = formControl.parentElement;

    identificadorForm.className = 'identificadorOk';
    small.className = 'mostrarSmall';
    small.innerText = '';
    formControl.className = 'inputOk';
}

//Función para validar algunos campos del formulario primcipalmente para la sección Datos de contacto

function validarCampo (input,propiedad,mensaje1, mensaje2, reglavalid){
    input.addEventListener('blur',()=>{
        let inputOk = reglavalid;
        let informacion = input.value.trim();
    if (informacion == '' || informacion == null) {
        valida[propiedad] = false;
        setError(input,mensaje1);
    }else{
        if (!inputOk.exec(informacion)) {
            valida[propiedad] = false;
            setError(input,mensaje2)
        }else{
            valida[propiedad] = true;
            setSuccess(input);
        }
    }
    })
}

//--------------------------Validaciones de algunos campos del formulario-----------------------------

let nombreOk = /^[A-Za-z áéíóúÁÉÍÓÚ]{2,30}$/;

validarCampo(nombre,'nombre','Este campo no puede estar vacío','Este campo solo acepta letras mayúsculas, minúsculas y espacios pero debe comenzar con letra inicial mayúscula',nombreOk);

validarCampo(apellidos,'apellidos','Este campo no puede estar vacío','Este campo solo acepta letras mayúsculas, minúsculas y espacios pero debe comenzar con letra inicial mayúscula',nombreOk);

let telefonoOk = /^[0-9]{8}$/;

validarCampo(telefono, 'telefono','Este campo no puede estar vacío', 'Este campo solo acepta 8 números',telefonoOk);

let emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

validarCampo(email, 'email','Este campo no puede estar vacío', 'Por favor introduzca una dirección de correo electrónico válida', emailOk);

let infoOk = /^[A-Za-z áéíóúÁÉÍÓÚñÑ 0-9 ,.:'"]{20,300}$/;

validarCampo(info, 'info','Este campo no puede estar vacío', 'Por favor haga una pregunta, estaremos felices de aclararle todas sus dudas', infoOk);

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    
    let errorV = false;
    console.log(valida)

    for(const propiedad in valida){
        if (valida[propiedad] == false) {
            errorV = true;
        }
    }  

    if (!errorV) {
        form.submit();
    }else{
        alert('Debe rellenar el formulario')
    }
})