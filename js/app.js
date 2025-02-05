
const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');


window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);
})


function buscarClima(e){
    e.preventDefault();

    //VALIDAR FORMULARIO
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if(ciudad === '' || pais === ''){
        mostrarError('Ambos campos son obligatorios');
        return;
    }

    //CONSULTAR LA API
    consultarApi(ciudad, pais);
}


function mostrarError(mensaje){
    const error = document.querySelector('.bg-red-100');
    if(!error){
    //MOSTRAR ALERTA
        const alerta = document.createElement('div');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3' ,'rounded',
            'max-w-md', 'mx-auto', 'mt-6', 'text-center');
        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span>${mensaje}</span>
        `;
        container.appendChild(alerta);

        //ELIMINAR LA ALERTA DESPUES DE LOS 3 SEGUDOS
        setTimeout(() => {
            alerta.remove()
        }, 5000);
    }
}

function consultarApi(ciudad, pais){

    const appId = '48ac35b154b222b7b28d7443bd8879ba';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`

    //MUESTRA EL SPINER
    spinner();

    fetch(url)
        .then( respuesta => respuesta.json())
        .then( datos => {
            limpiarHtml(); //!limpia el HTML previo
            if(datos.cod === '404'){
                mostrarError('Ciudad no encontrada');
                return;
            }
            //IMPRIMIR HTML
            mostrarClima(datos);
        })
}


function mostrarClima(datos){

    const { name, main:{ temp, temp_max, temp_min } } = datos;

    const centigrados = kelvinAcentigrados(temp);
    const max = kelvinAcentigrados(temp_max);
    const min = kelvinAcentigrados(temp_min);

    const nameCiudad = document.createElement('p');
    nameCiudad.textContent = `Clima en: ${name}`;
    nameCiudad.classList.add('font-bold', 'text-2xl');

    //* TEMPERATURA ACTULA
    const actual = document.createElement('p');
    actual.innerHTML = `${centigrados} &#8451`;
    actual.classList.add('font-bold', 'text-6xl');

    //*TEMPERATURA MAXIMA
    const maxima = document.createElement('p');
    maxima.innerText = `Max: ${max} &#8451`;
    maxima.classList.add('text-xl')

    //*TEMPERATURA MINIMA
    const minima = document.createElement('p');
    minima.innerText = `Min: ${min} &#8451`;
    minima.classList.add('text-xl')

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(nameCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(maxima);
    resultadoDiv.appendChild(minima);

    resultado.appendChild(resultadoDiv);
}

const kelvinAcentigrados = grados => parseInt(grados - 273.15);

function limpiarHtml(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}


function spinner(){
    limpiarHtml();
    const divSpinner = document.createElement('div');
    divSpinner.classList.add('spinner')

    divSpinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;
    resultado.appendChild(divSpinner)
}

