const DESPLAZAR = 10;
let pantalla = document.body.getBoundingClientRect();
let score = 0;
let nave = document.getElementById('nave');
let comenzar = null;
let eliminar = null;
let juego = null;
let velocidad = null;
let dificultad = 2000;
const music = new Audio('media/fondo.mp3');
const explosion = new Audio('media/explosion.mp3');

let musica = true;

function play(){
    initComponents();
    iniciar();
}

function iniciar(){
    music.pause();
    music.play();
    music.loop = true;
}

function initComponents(){
    //Reniciar contadores
    score = 0;
    dificultad = 0;
    //iniciar nave
    nave.src = 'images/nave.png';
    nave.style.transform = 'translate(0,0)';
    //quitar presentacion, en caso que sea visible
    let presentacion = document.getElementById('presentacion');
    presentacion.style.display = 'none';
    //quitar vista de perdida, en caso que sea visible
    let perdiste = document.getElementById('perdiste');
    perdiste.style.display = 'none';
    //inicializar los metodos que se repiten            
    comenzar = setInterval(agregarMeteoro, 2000);
    eliminar = setInterval(quitarMeteoro, 500);
    juego = setInterval(verificarEstadoJuego, 10);
    velocidad = setInterval(aumentarVelocidad, 10000);
    setInterval(recompenza, 1000);
}

function finalizarJuego(){
    clearInterval(velocidad);
    clearInterval(eliminar);
    clearInterval(juego);
    clearInterval(comenzar);
}

function aumentarVelocidad() {
    dificultad = dificultad + 10;
    console.log(dificultad);
    comenzar = setInterval(agregarMeteoro, 2000 - dificultad);
}

function audio(){
    musica = !musica;
    music.volume = musica ? 1 : 0;
}

function recompenza(){
    score = score + 5;
    let record = document.getElementById('score');
    record.innerHTML = score;
    document.getElementById('volumen').innerHTML = musica ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-volume-up" viewBox="0 0 16 16">
        <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/>
        <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/>
        <path d="M10.025 8a4.486 4.486 0 0 1-1.318 3.182L8 10.475A3.489 3.489 0 0 0 9.025 8c0-.966-.392-1.841-1.025-2.475l.707-.707A4.486 4.486 0 0 1 10.025 8zM7 4a.5.5 0 0 0-.812-.39L3.825 5.5H1.5A.5.5 0 0 0 1 6v4a.5.5 0 0 0 .5.5h2.325l2.363 1.89A.5.5 0 0 0 7 12V4zM4.312 6.39 6 5.04v5.92L4.312 9.61A.5.5 0 0 0 4 9.5H2v-3h2a.5.5 0 0 0 .312-.11z"/>
      </svg>`:
      `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-volume-mute" viewBox="0 0 16 16">
      <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zM6 5.04 4.312 6.39A.5.5 0 0 1 4 6.5H2v3h2a.5.5 0 0 1 .312.11L6 10.96V5.04zm7.854.606a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/>
    </svg>`;
}

/**
 * *este metodo funciona correctamente
 */
document.addEventListener('keypress',(e)=>{
    
    moverNave(e.code);
    
});

function moverNave(e){
    let bounds = nave.getBoundingClientRect();
    let x = bounds.x;
    let y = bounds.y;
    switch(e){
        case 'KeyA': 
            x = x == 0 ? 0 : x - DESPLAZAR;
        break;
        case 'KeyS':
            if((y + bounds.height) >= pantalla.height){
                y = pantalla.height - bounds.height;
            }else{
                y = y + DESPLAZAR;
            }
        break;
        case 'KeyD':
            if((x + bounds.width) >= pantalla.width){
                x = pantalla.width - bounds.width;
            }else{
                x = x + DESPLAZAR;
            }
        break;
        case 'KeyW':
            y = y == 0 ? 0 : y - DESPLAZAR;
        break;
    }
    nave.style.transform = `translate(${x}px,${y}px)`;
}

function verificarEstadoJuego(){    
    let villanos = document.getElementsByClassName('meteoro');
    let personaje = document.getElementById('nave').getBoundingClientRect();
    let posicionX = personaje.x + personaje.width;
    let posicionInicialY = personaje.y;
    let posicionFinalY = personaje.y + personaje.height;
    
    // return;
    
    
    for (let i = 0; i < villanos.length; i++) {
        let villano = villanos[i].getBoundingClientRect();
        let villanoPosicioninicialX = villano.x;
        let villanoPosicionfinalX = villano.x + villano.width;
        let villanoPosicioninicialY = villano.y;
        let villanoPosicionFinalY = villano.y + villano.height;
        if(
            (posicionX >= villanoPosicioninicialX && posicionX <= villanoPosicionfinalX) &&
            (
                (posicionInicialY >= villanoPosicioninicialY && posicionInicialY <= villanoPosicionFinalY) ||
                (posicionFinalY >= villanoPosicioninicialY && posicionFinalY <= villanoPosicionFinalY)
            )            
        ){
            explosion.play();
            let personaje = document.getElementById('nave');
            personaje.src = 'images/explotar.png';
            
            let perdiste = document.getElementById('perdiste');
            perdiste.style.display = 'flex';
            
            let record = document.getElementById('record');
            record.innerHTML = score;
            finalizarJuego();
        }
    }
}

/**
 * este metodo agrega un nuevo meteoro a la pantalla
 */
function agregarMeteoro() {
    let y = Math.floor(Math.random() * pantalla.height);
    const villano = document.createElement("div");
    villano.classList.add("meteoro");
    villano.style.transform = `translateY(${y-50}px)`;
    villano.style.animation = `mover ${5000-dificultad}ms linear`;
    villano.id = `VLL${Math.floor(Math.random() * 100)}`;
    document.body.appendChild(villano);
}

/**
 * este metodo se encarga de eliminar los meteoros que salen de la pantalla
 */
function quitarMeteoro(){
    let meteoros = document.getElementsByClassName('meteoro');
    for (let i = 0; i < meteoros.length; i++) {
        let id = meteoros[i].getAttribute('id');
        if(document.getElementById(id).getBoundingClientRect().x < 0){
            document.getElementById(id).remove();
        }
    }
}