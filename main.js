
const pacienteInput = document.querySelector('#paciente');   
const propietarioInput = document.querySelector('#propietario');
const emailInput = document.querySelector('#email');
const fechaInput = document.querySelector('#fecha');
const sintomasInput = document.querySelector('#sintomas');

const formulario = document.querySelector('#formulario-cita');
const contenedorCitas = document.querySelector('#citas');

const citaObj= {
    id: generarId(),
    paciente: '',
    propietario: '',
    email: '',
    fecha: '',
    sintomas: '',
}

pacienteInput.addEventListener('change', datosCitas);
propietarioInput.addEventListener('change', datosCitas);
emailInput.addEventListener('change', datosCitas);
fechaInput.addEventListener('change', datosCitas);
sintomasInput.addEventListener('change', datosCitas);

formulario.addEventListener('submit', submitCita);
let editando = false;

class Notificacion{
    constructor({texto, tipo}){
        this.texto = texto
        this.tipo = tipo

        this.mostrar()
    }

    mostrar(){
        const alerta = document.createElement('DIV')
        alerta.classList.add('div-alert')

        const alertaPrevia = document.querySelector('.div-alert')
        if (alertaPrevia) {
            alertaPrevia.remove()
        }
        
        this.tipo === 'error' ? alerta.classList.add('alert-red') : alerta.classList.add('alert-green')

        alerta.textContent = this.texto

        formulario.parentElement.insertBefore(alerta, formulario)

        setTimeout(() => {
            alerta.remove()
        }, 3000)
    }
}

class AdminCitas {
    constructor() {
        this.citas = []
    }

        Agregar(cita){
            this.citas = [...this.citas, cita]
            this.mostrar()
    }


    editar(citaActualizada){
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita)
        this.mostrar()
    }
    eliminar(id){
        this.citas = this.citas.filter(cita => cita.id !== id)
        this.mostrar()
    }
    
    
    mostrar(){
        while (contenedorCitas.firstChild) {
           contenedorCitas.removeChild(contenedorCitas.firstChild) 
        }

        if (this.citas.length === 0) {
            contenedorCitas.innerHTML = '<p class="no-paciente">No hay Pacientes</p>'
        }
        this.citas.forEach((cita) => {
            const divCitas = document.createElement('DIV');
            divCitas.classList.add('div-citas')

            const paciente = document.createElement('P');
            paciente.classList.add('clase-paciente');
            paciente.innerHTML = `<span class="span-bold">Paciente: </span> ${cita.paciente}`

            const propietario = document.createElement('P');
            propietario.classList.add('clase-paciente');
            propietario.innerHTML = `<span class="span-bold">Propietario: </span> ${cita.propietario}`

            const email = document.createElement('P');
            email.classList.add('clase-paciente');
            email.innerHTML = `<span class="span-bold">E-mail: </span> ${cita.email}`

            const fecha = document.createElement('P');
            fecha.classList.add('clase-paciente');
            fecha.innerHTML = `<span class="span-bold">Fecha: </span> ${cita.fecha}`

            const sintomas = document.createElement('P');
            sintomas.classList.add('clase-paciente');
            sintomas.innerHTML = `<span class="span-bold">Sintomas: </span> ${cita.sintomas}`

            const btnEditar = document.createElement('button')
            btnEditar.classList.add('btn-edit')
            btnEditar.innerHTML = 'Editar'
            const clone = {...cita}
            btnEditar.onclick = () => cargarEdicion(clone)


            const btnEliminar = document.createElement('button')
            btnEliminar.classList.add('btn-clear')
            btnEliminar.innerHTML = 'Eliminar'
            btnEliminar.onclick = () => this.eliminar(cita.id)

            const contenedorBotones = document.createElement('DIV')
            contenedorBotones.classList.add('flex-btn')

            contenedorBotones.appendChild(btnEditar)
            contenedorBotones.appendChild(btnEliminar)

            divCitas.appendChild(paciente);
            divCitas.appendChild(propietario);
            divCitas.appendChild(email);
            divCitas.appendChild(fecha);
            divCitas.appendChild(sintomas);
            divCitas.appendChild(contenedorBotones);
            contenedorCitas.appendChild(divCitas);
        
        })
    }
}

function datosCitas(e) {
    citaObj[e.target.name] = e.target.value;
}

const citas = new AdminCitas()

function submitCita(e) {
    e.preventDefault();
    console.log(citaObj)

    
    if (Object.values(citaObj).some((valor) => valor.trim() === '')){
        const notificacion = new Notificacion({
            texto: 'Todos los campos son obligatorios',
            tipo: 'error' 
        })
        return
    }
    

    if (editando) {
        citas.editar({...citaObj})
        new Notificacion({
            texto: 'Se Guardo Correctamente',
            tipo:'exito'
        })
    }else {
        citas.Agregar({...citaObj}) 
        new Notificacion({
            texto: 'Cita agregada correctamente',
            tipo:'exito'
        })
    }

    formulario.reset()
    reiniciarObjetoCita();

}

function reiniciarObjetoCita(){
    citaObj.paciente = '';
    citaObj.propietario = '';
    citaObj.email = '';
    citaObj.fecha = '';
    citaObj.sintomas = '';
}

function generarId(){
    return Math.random().toString(36).substring(2) + Date.now()
}
function cargarEdicion(cita){
    Object.assign(citaObj, cita);

    pacienteInput.value = cita.paciente;
    propietarioInput.value = cita.propietario;
    emailInput.value = cita.email;
    fechaInput.value = cita.fecha;
    sintomasInput.value = cita.sintomas;

    editando = true
}