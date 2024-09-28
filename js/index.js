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