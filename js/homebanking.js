//Declaración de variables
var cuenta = {
    nombre: "misleidy",
    contrasena: "12345qwe",
    amigos:[
        {
            numeroCta:"12345600",
            nombre:"alex ventura"

        },
        {
            numeroCta:"7890463",
            nombre:"Mariely Espinoza"

        },
    ]
}
var nombreUsuario= cuenta.nombre;
var contrasena = "";
var saldoCuenta = 8000;
var limiteExtraccion = 5000;
var servicioAPagar = '';


//Ejecución de las funciones que actualizan los valores de las variables en el HTML.
window.onload = function() {
    cargarNombreEnPantalla();
    actualizarSaldoEnPantalla();
    actualizarLimiteEnPantalla();
}
//Funcion principal que se llama desde el menu del home banking
function operation(operationType) {
    document.getElementById('operation-dialog').style.display = 'block';

    switch(operationType){
        case "extraer": extraerDineroVista(); break;
        case "depositar": depositarDineroVista(); break;
        case "servicio": pagarServicioVista(); break;
        case "tranferir": transferirDineroVista();break;
        case "limite-extracion": cambiarLimiteDeExtraccionVista(); break;
    }
}

function iniciarSesion() {
    nombreUsuario = document.getElementById('usuarioSesion').value;
    contrasena =  document.getElementById('usuarioContrasena').value;
    
    if (nombreUsuario === cuenta.nombre && contrasena===cuenta.contrasena) {

        swal({
            title: "Bienvenido ",
            text: "Bienvenido " + nombreUsuario + " ya puedes comenzar a realizar operaciones. ",
        }).then(() => {
            window.location.href ="index.html";

            actualizarSaldoEnPantalla();

            closeDialog();

        });
    } else {

        swal({
            title: "Cuenta incorrecta ",
            text: " " + nombreUsuario + " ya puedes comenzar a realizar operaciones. ",
        });
    }
 
}

function extraerDineroVista() {
    document.getElementById('operation-dialog-title').innerHTML = "Extraer Dinero";
    var extraerForm = document.getElementById('extraer-template-form').innerHTML;
    document.getElementById('operation-dialog-body').innerHTML = extraerForm;
    document.getElementById('operation-acept-button').onclick = extraerDinero;
}

function depositarDineroVista() {
    document.getElementById('operation-dialog-title').innerHTML = "Depositar Dinero";
    var depositarForm = document.getElementById('depositar-template-form').innerHTML;
    document.getElementById('operation-dialog-body').innerHTML = depositarForm;
    document.getElementById('operation-acept-button').onclick = depositarDinero;
}

function pagarServicioVista() {
    document.getElementById('operation-dialog-title').innerHTML = "Pagar Servicios";
    var servicosForm = document.getElementById('servicio-template-form').innerHTML;
    document.getElementById('operation-dialog-body').innerHTML = servicosForm;
    document.getElementById('operation-acept-button').firstChild.data = "Siguiente";
    document.getElementById('operation-acept-button').onclick = pagarServicioItemVista;

}

function pagarServicioItemVista(){
    servicioAPagar = document.querySelector('input[name="servicio"]:checked').value;
    var pagarForm = document.getElementById('pagar-template-form').innerHTML;
    document.getElementById('operation-dialog-title').innerHTML = "Pagar Servicio " + servicioAPagar;
    document.getElementById('operation-dialog-body').innerHTML = pagarForm;
    document.getElementById('operation-acept-button').firstChild.data = "Aceptar";
    document.getElementById('operation-acept-button').onclick = pagarServicio;

}

function cambiarLimiteDeExtraccionVista(){
    document.getElementById('operation-dialog-title').innerHTML = "Cambiar Limite Extraccion";
    var cambiarLimiteForm = document.getElementById('cambiar-limite-template-form').innerHTML;
    document.getElementById('operation-dialog-body').innerHTML = cambiarLimiteForm;
    document.getElementById('operation-acept-button').onclick = cambiarLimiteDeExtraccion;

}

/*funcion que carga el template dialogo de tranferir dinero*/
function transferirDineroVista(){
    document.getElementById('operation-dialog-title').innerHTML = "Tranferir Dinero";
    document.getElementById('amigos-cuenta').innerHTML = cuenta.amigos.map(it => it.nombre +" "+ it.numeroCta);
    var transferirForm = document.getElementById('transferir-template-form').innerHTML;
    
    document.getElementById('operation-dialog-body').innerHTML = transferirForm;
    document.getElementById('operation-acept-button').firstChild.data = "Aceptar";
    document.getElementById('operation-acept-button').onclick = transferirDinero;
}

/*funciones de operaciones */
function extraerDinero() {
    var montoRetiro = document.getElementById('input-extract-amount').value;
    montoRetiro = parseInt(montoRetiro);
    
    //Validaciones
    if(montoRetiro%100 !== 0) { // Si el monto del retiro no es un billete de 100
        swal ("Solo puedes extraer dinero en billetes de $ 100")
        return;
    }
    if(montoRetiro > saldoCuenta){
        swal ("Saldo insuficiente");
        return;
    }
    if(montoRetiro > limiteExtraccion){
        swal ("La cantidad de dinero es mayor a tu limite diario");
        return;
    }
    //fin validaciones

    //Operacion
    var saldoAnterior = saldoCuenta;
    saldoCuenta = saldoCuenta - montoRetiro;

    actualizarSaldoEnPantalla();

    closeDialog();

    swal({
        title: "Extracion exitosa",
        text:"Monto Extraccion: $ "  + montoRetiro + '\n' + "Saldo anterior: $ "  +  saldoAnterior   + '\n' + "Saldo actual: $ " + saldoCuenta,
        icon: "success",
      });
}

function depositarDinero() {
    var montoDeposito = document.getElementById('input-depositar-amount').value;
    montoDeposito = parseInt(montoDeposito);
    saldoCuenta = saldoCuenta + montoDeposito;


    saldoAnterior = saldoCuenta;
    saldoCuenta = saldoCuenta + montoDeposito;

    actualizarSaldoEnPantalla();

    closeDialog();
    swal({
        title: "Operacion exitosa",
        text:"Monto deposito: $ "  + montoDeposito + '\n' + "Saldo anterior: $ "  +  saldoAnterior   + '\n' + "Saldo actual: $ " + saldoCuenta,
        icon: "success",
      });
}

function pagarServicio() {
    var montoServicio = document.getElementById('input-pagar-amount').value;
    montoServicio = parseInt(montoServicio);

    if(montoServicio > saldoCuenta){
         swal({
            title: "Error de transferencia",
            text:"No tienes disponible ese dinero",
            icon: "error",
            });
            return;
    };

    saldoAnterior = saldoCuenta;
    saldoCuenta = saldoCuenta - montoServicio;


    actualizarSaldoEnPantalla();

    closeDialog();

    swal({
        title: "Pago Exitoso",
        text:" Servicio " +  servicioAPagar + " : " + " $ " + montoServicio  + '\n' + "Saldo anterior: $ "  +  saldoAnterior   + '\n' + "Saldo actual: $ " + saldoCuenta,
        icon: "success",
      });
}


function transferirDinero() {
    var montoTransferir = document.getElementById('input-tranferir-amount').value;
    var cuentaTransferir = document.getElementById("input-tranferir-cuenta").value;
    montoTransferir = parseInt(montoTransferir);

    var ctaAmigo = cuenta.amigos.filter(function(amigo){
        return amigo.numeroCta == cuentaTransferir;
    });

    if(ctaAmigo.length == 0){
        swal({
            title: "Error de transferencia",
            text:"solo puedes transferir a cuentas agregadas",
            icon: "error",
          });
        return;
    }

    if(montoTransferir > saldoCuenta){
        swal({
            title: "Error de transferencia",
            text:"No tienes disponible ese dinero",
            icon: "error",
          });
        return;
    }

    saldoAnterior = saldoCuenta;
    saldoCuenta = saldoCuenta - montoTransferir;

    
    actualizarSaldoEnPantalla();

    closeDialog();

    swal({
        title: "Pago Exitoso",
        text:"Monto transferir: $ "  + montoTransferir + '\n' + "transferirtes a : " + ctaAmigo[0].nombre + '\n' + "numero de cuenta: " + ctaAmigo[0].numeroCta,
        icon: "success",
      });
   
}
function cambiarLimiteDeExtraccion() {
    var montoLimite = document.getElementById('input-limite-amount').value;
    montoLimite = parseInt(montoLimite);

    limiteExtraccion = montoLimite;

    actualizarLimiteEnPantalla();

    closeDialog();

    swal({
        title: "Operacion exitosa",
        text:"Nuevo limite de extracion: $ " + montoLimite,
        icon: "success",
      });

}

//Funciones que actualizan el valor de las variables en el HTML
function cargarNombreEnPantalla() {
    document.getElementById("nombre").innerHTML = "Bienvenido/a " + nombreUsuario;
}

function actualizarSaldoEnPantalla() {
    document.getElementById("saldo-cuenta").innerHTML = "$" + saldoCuenta;
}

function actualizarLimiteEnPantalla() {
    document.getElementById("limite-extraccion").innerHTML = "Tu límite de extracción es: $" + limiteExtraccion;
}

//Funcion que cierra el dialogo
function closeDialog(){
    document.getElementById('operation-dialog').style.display='none'
}