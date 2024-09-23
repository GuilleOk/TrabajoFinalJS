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
let formulario = document.querySelector('form');

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

let valida = {
    nombre: false,
    apellidos: false,
    telefono: false,
    email: false
};

nombre.addEventListener('blur',()=>{
    let nombreOk = /^[a-zA-Z áéíóúÁÉÍÓÚ]{2,30}$/;

    if (nombre.value == '' || nombre.value == null) {
        valida.nombre = false;
        setError(nombre,'Este campo no puede estar vacío');
    }else{
        if (!nombreOk.exec(nombre.value)) {
            valida.nombre = false;
            setError(nombre,'Este campo solo acepta letras mayúsculas, minúsculas y espacios')
        }else{
            valida.nombre = true;
            setSuccess(nombre);
        }
    }
}
);

apellidos.addEventListener('blur',()=>{
    let apellidosOk = /^[a-zA-Z áéíóúÁÉÍÓÚ]{2,30}$/;

    if (apellidos.value == '' || apellidos.value == null) {
        valida.apellidos = false;
        setError(apellidos,'Este campo no puede estar vacío');
    }else{
        if (!apellidosOk.exec(apellidos.value)) {
            valida.apellidos = false;
            setError(apellidos,'Este campo solo acepta letras mayúsculas, minúsculas y espacios')
        }else{
            valida.apellidos = true;
            setSuccess(apellidos);
        }
    }
}
)

telefono.addEventListener('blur',()=>{
    let telefonoOk = /^[0-9]{8}$/;

    if (telefono.value == '' || telefono.value == null) {
        valida.telefono = false;
        setError(telefono,'Este campo no puede estar vacío');
    }else{
        if (!telefonoOk.exec(telefono.value)) {
            valida.telefono = false;
            setError(telefono,'Este campo solo acepta 8 números')
        }else{
            valida.telefono = true;
            setSuccess(telefono);
        }
    }
}
)

email.addEventListener('blur',()=>{
    let emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.value == '' || email.value == null) {
        valida.email = false;
        setError(email,'Este campo no puede estar vacío');
    }else{
        if (!emailOk.exec(email.value)) {
            valida.email = false;
            setError(email,'Este campo solo acepta 8 números')
        }else{
            valida.email = true;
            setSuccess(email);
        }
    }
}
)