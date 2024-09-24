function cargarOpiniones(url) {
    return fetch(url)
        .then(response=>{
            if (!response.ok) {
                alert("Something's wrong")
            }else{
                return response.json();
            }
        })
        .then(data=>{
            let elementosCarrusel = document.getElementsByClassName('opinion');
            data.forEach((dato,i) => {
                elementosCarrusel[i].innerHTML += `
                    <div class='row'>
                        <div class='col-4'>
                            <img src=${dato.foto} class='fotosOpiniones'>
                        </div>
                        <div class='col-8'>
                            <div class='mb-5'>
                                <h4>${dato.nombre}</h4>
                            </div>
                            <div class='my-5 texto'>
                                <p class='mx-4 my-auto'>${dato.opinion}</p>
                            </div>
                        </div>
                    </div>
                `                
            });
        })
};

let principalPage = document.getElementById('paginaPrincipal');

if (principalPage != null) {
    principalPage.addEventListener('load',cargarOpiniones('../assets/opinionClientes.json'));
}

//------------------------------------Presupuesto----------------------------------------

let nombre = document.getElementById('nombre');
let apellidos = document.getElementById('apellidos');
let telefono = document.getElementById('telef');
let email = document.getElementById('email');
let producto = document.getElementById('producto');
let plazos = document.getElementById('plazos');
let formulario = document.querySelector('form');

let valida = {
    nombre: false,
    apellidos: false,
    telefono: false,
    email: false,
    producto: false,
    plazos: false,
    presupuesto: false,
    condiciones: false
};

let setError = (etiqueta, mensaje)=>{
    let formControl = etiqueta.parentElement;
    const small = formControl.querySelector('small');
    let identificadorForm = formControl.parentElement;

    identificadorForm.className = 'identificadorError';
    formControl.className = 'inputError';
    small.innerText = mensaje;
}

let setSuccess = (etiqueta)=>{
    let formControl = etiqueta.parentElement;
    const small = formControl.querySelector('small');
    let identificadorForm = formControl.parentElement;

    identificadorForm.className = 'identificadorOk';

    small.innerText = '';
    formControl.className = 'inputOk';
}

function validarCampo (input,mensaje1, mensaje2, reglavalid){
    input.addEventListener('blur',()=>{
        let inputOk = reglavalid;
    if (input.value == '' || input.value == null) {
        valida.input = false;
        setError(input,mensaje1);
    }else{
        if (!inputOk.exec(input.value)) {
            valida.input = false;
            setError(input,mensaje2)
        }else{
            valida.input = true;
            setSuccess(input);
        }
    }
    })
}

let nombreOk = /^[A-Za-z áéíóúÁÉÍÓÚ]{2,30}$/;

validarCampo(nombre,'Este campo no puede estar vacío','Este campo solo acepta letras mayúsculas, minúsculas y espacios',nombreOk)

validarCampo(apellidos,'Este campo no puede estar vacío','Este campo solo acepta letras mayúsculas, minúsculas y espacios',nombreOk)

let telefonoOk = /^[0-9]{8}$/;

validarCampo(telefono, 'Este campo no puede estar vacío', 'Este campo solo acepta 8 números',telefonoOk);

let emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

validarCampo(email, 'Este campo no puede estar vacío', 'Por favor introduzca una dirección de correo electrónico válida', emailOk)

producto.addEventListener('change',()=>{
    for (let i = 0; i < producto.length; i++) {
        if (producto[i].selected) {
            console.log(producto[i].value)
        };
        
    }
})