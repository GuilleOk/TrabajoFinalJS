let nombre = document.getElementById('nombre');
let apellidos = document.getElementById('apellidos');
let telefono = document.getElementById('telef');
let email = document.getElementById('email');
let producto = document.getElementById('producto');
let plazos = document.getElementById('plazos');
let productosVenta = [];
let extras = document.getElementById('extras');
let politPriv = document.getElementById('flexCheckChecked');
let presupuesto = document.getElementById('presupuesto');
let formulario = document.getElementById('formulario');
let productosElegidos = [];
let reset = document.getElementById('resetForm');

let valida = {
    nombre: false,
    apellidos: false,
    telefono: false,
    email: false,
    producto: false,
    plazos: false,
    politPriv: false,
};

//---------------Función para cargar los productos desde un json para la lógica del presupuesto---------

function cargarProductos (url){
    return fetch(url)
            .then(response=>{
                if (!response.ok) {
                    alert('Error de comunicación con el servidor');
                }else{
                    return response.json();
                }
            })
            .then(dato=>{
                productosVenta = [...productosVenta,dato];
            })
}

//------------Funciones para el estilo de las validaciones de algunos campos del formulario-----------

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

let nombreOk = /^[A-Za-záéíóúÁÉÍÓÚ]{2,15}$/;

validarCampo(nombre,'nombre','Este campo no puede estar vacío','Este campo solo acepta letras y hasta 15 caracteres',nombreOk)

let apellidosOk = /^[A-Za-záéíóúÁÉÍÓÚ]{2,40}$/;

validarCampo(apellidos,'apellidos','Este campo no puede estar vacío','Este campo solo acepta letras y hasta 40 caracteres',apellidosOk)

let telefonoOk = /^[0-9]{9}$/;

validarCampo(telefono, 'telefono','Este campo no puede estar vacío', 'Este campo solo acepta 9 dígitos',telefonoOk);

let emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

validarCampo(email, 'email','Este campo no puede estar vacío', 'Por favor introduzca una dirección de correo electrónico válida', emailOk)

let plazosOk = /^[1-9][0-9]{0,2}$/;

validarCampo(plazos, 'plazos','Este campo no puede estar vacío', 'Por favor introduzca una cantidad de días válida (1 - 365 días)', plazosOk)

plazos.addEventListener('blur',()=>{
    if (Number(plazos.value) >= 365) {
        // alert('La cantidad de días no puede extenderse de 365');
        setError(plazos,'La cantidad de días no puede extenderse de 365');
        plazos.value = '';
        valida.plazos = false;
    }
})

//-----------------------------------------Lógica del submit----------------------------------------

cargarProductos('../assets/productos.json');

function presupuestoCambiado() {
    let totalPagar = 0;
    let coincidencias = [];
    let extra1 = 'Envolver el pedido para regalo';
    let extra2 = 'Envío a domicilio';
    let extra3 = 'Envío express';
    let errorV = false;
    let extrasSeleccionados = [];
    let elemento = document.getElementsByClassName('item-label');//productos seleccionados

    valida.politPriv = politPriv.checked;//

    //se toman los productos
    
    let valores = [...elemento].map(ele=>{
        return ele.getAttribute('data-value');
    })    

    //se toman todos los productos que están a la venta

    coincidencias = productosVenta[0].filter(elemento => valores.includes(elemento.producto));

    let productosSeleccionados = coincidencias.filter(ele=> ele != extra1 && ele != extra2 && ele != extra3)

    if (productosSeleccionados.length == 0 ) {
        // alert('Debe de seleccionar al menos un producto');
        valida.producto = false
    }else{
        valida.producto = true;
    }    

    productosSeleccionados.map(item =>{
        totalPagar += item.valor;
    })

    ///////////////////////////////////////////////////////////////////////////////////////////////

    extrasSeleccionados = valores.filter(ele=> ele === extra1 || ele === extra2 || ele === extra3);

    if (Number(plazos.value) > 20 && Number(plazos.value) < 120) {
        totalPagar *= 0.95;
    } else if (Number(plazos.value) > 119 && Number(plazos.value) < 200) {
        totalPagar *= 0.9;    
    } else if (Number(plazos.value) > 199) {
        totalPagar *= 0.85;
    }

    totalPagar += extrasSeleccionados.length;

    for(const propiedad in valida){
        if (valida[propiedad] == false) {
            errorV = false;
            break;
        }else{
            errorV = true;
        }
    }

    if (productosSeleccionados.length > 0 && plazos.value != '' && errorV == true) {
        presupuesto.value = `${totalPagar.toFixed(2)}`;            
    }
    
}


formulario.addEventListener('submit',(e)=>{
    e.preventDefault();
    let errorV = false;
    for(const propiedad in valida){
        if (valida[propiedad] == false) {
            errorV = false;
            break;
        }else{
            errorV = true;
        }
    }
    if (errorV) {
        presupuestoCambiado();
        formulario.submit();        
    }
})

setInterval(() => {
    let valores = [...document.getElementsByClassName('item-label')].map(ele=>{
        return ele.getAttribute('data-value');
    })
    if (valores.length != 0) {
        presupuestoCambiado();
    }
}, 500);

plazos.addEventListener('change',()=>{
    setTimeout(() => {
        presupuestoCambiado()        
    }, 500);
});

function restablecerColores(etiqueta) {
    let formControl = etiqueta.parentElement;
    const small = formControl.querySelector('small');
    let identificadorForm = formControl.parentElement;

    identificadorForm.className = 'identificadorRestablecido';
    small.className = 'mostrarSmall';
    small.innerText = '';
    formControl.className = 'ms-4 w-100';
}

reset.addEventListener('click', () => {
    document.querySelectorAll('.item-container').forEach(container => {
        let eventoClick = new MouseEvent('click');
        container.childNodes[1].dispatchEvent(eventoClick);
    });
    restablecerColores(nombre);
    restablecerColores(apellidos);
    restablecerColores(telefono);
    restablecerColores(email);
    restablecerColores(plazos);
});