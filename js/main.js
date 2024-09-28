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
let productosVenta = [];
let extras = document.getElementById('extras');
let politPriv = document.getElementById('flexCheckChecked');
let presupuesto = document.getElementById('presupuesto');
let formulario = document.getElementById('formulario');
let productosElegidos = [];

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

let nombreOk = /^[A-Za-z áéíóúÁÉÍÓÚ]{2,30}$/;

validarCampo(nombre,'nombre','Este campo no puede estar vacío','Este campo solo acepta letras mayúsculas, minúsculas y espacios pero debe comenzar con letra inicial mayúscula',nombreOk)

validarCampo(apellidos,'apellidos','Este campo no puede estar vacío','Este campo solo acepta letras mayúsculas, minúsculas y espacios pero debe comenzar con letra inicial mayúscula',nombreOk)

let telefonoOk = /^[0-9]{8}$/;

validarCampo(telefono, 'telefono','Este campo no puede estar vacío', 'Este campo solo acepta 8 números',telefonoOk);

let emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

validarCampo(email, 'email','Este campo no puede estar vacío', 'Por favor introduzca una dirección de correo electrónico válida', emailOk)

let plazosOk = /^[1-9][0-9]{0,2}$/;

validarCampo(plazos, 'plazos','Este campo no puede estar vacío', 'Por favor introduzca una cantidad de días válida (1 - 365 días)', plazosOk)

plazos.addEventListener('blur',()=>{
    if (Number(plazos.value) >= 365) {
        alert('La cantidad de días no puede extenderse de 365');
        setError();
        plazos.value = '';
        valida.plazos = false;
    }
})

//-----------------------------------------Lógica del submit----------------------------------------

formulario.addEventListener('submit',async(e)=>{//hay que hacer el handler
    //asíncrono para poder manejar la info de la promesa
    e.preventDefault();

    let totalPagar = 0;
    let coincidencias = [];
    let extras = [];
    let extra1 = 'Envolver el pedido para regalo';
    let extra2 = 'Envío a domicilio';
    let extra3 = 'Envío express';
    
    valida.politPriv = politPriv.checked;//

    //se toman los productos
    let elemento = document.getElementsByClassName('item-label');//productos seleccionados
     
    let valores = [...elemento].map(ele=>{//es necesario utilizar el operador spread pq 
        //getElementsByClassName devuelve un HTMLcolection no un array y entonces hay que convertirlo
        //en array
        return ele.getAttribute('data-value');
    })    

    //se toman todos los productos que están a la venta
    await cargarProductos('../assets/productos.json');

    coincidencias = productosVenta[0].filter(elemento => valores.includes(elemento.producto));

    let productos = coincidencias.filter(ele=> ele != extra1 && ele != extra2 && ele != extra3)

    if (productos.length == 0 ) {
        alert('Debe de seleccionar al menos un producto');
        valida.producto = false
    }else{
        valida.producto = true;
    }    

    productos.map(item =>{
        totalPagar += item.valor;
    })

    ///////////////////////////////////////////////////////////////////////////////////////////////

    extras = valores.filter(ele=> ele === extra1 || ele === extra2 || ele === extra3);

    if (productos.length > 2 && productos.length <5) {
        totalPagar = totalPagar * 0.95;
    }else{
        if (productos.length > 4 && productos.length <7) {
            totalPagar = totalPagar * 0.9;    
        } else {
            totalPagar = totalPagar * 0.85;
        }
    }

    if (extras.length == 2) {
        totalPagar = totalPagar * 1.1;
    }

    presupuesto.value = `${totalPagar}`;


    if (valida.apellidos == true && valida.email == true && valida.nombre == true && valida.plazos == true 
        && valida.politPriv == true && valida.producto == true && valida.telefono == true){
        
            console.log('first')
            formulario.submit();
    }
})