import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { mixinDisabled } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CaracteristicaVehiculo } from 'src/app/models/caracteristica-vehiculo';
import { Ocupacion } from 'src/app/models/ocupacion';
import { Opcion } from 'src/app/models/opcion';
import { Vehiculo } from 'src/app/models/vehiculo';
import { CaracteristicaVehiculoService } from 'src/app/services/caracteristica-vehiculo.service';
import { OcupacionService } from 'src/app/services/ocupacion.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VehiculoService } from 'src/app/services/vehiculo.service';
import { AlertaRespuestaServicioComponent } from '../../dialogos/alerta-respuesta-servicio/alerta-respuesta-servicio.component';

@Component({
  selector: 'app-nuevo-vehiculo',
  templateUrl: './nuevo-vehiculo.component.html',
  styleUrls: ['./nuevo-vehiculo.component.css']
})
export class NuevoVehiculoComponent implements OnInit {


  // Formulario principal de los datos del vehiculo
  form: FormGroup;
  // Formulario de las caracteristicas del vehiculo
  formCaracteristicas: FormGroup = this.formBuilder.group({caracteristicas:['', Validators.required]});
  // Fromulario para las fechas de ocupacion del dueño
  formFechas: FormGroup = this.formBuilder.group({fechas: [{value: '', disabled: true}, Validators.required]});


  fechaOcupacion: Date;
  // Si el vehiculo es propio se marca como 1 y si tiene dueño se marca como 0
  propio :number = 1;
  estado = 'ACTIVO';
  usrCreacion = ''; // Se debe agregar el usuario que se loguea
  usrModificacion =''; // Se debe agregar el usuario que se loguea

  
  // Se almacena el vehiculo que se crea
  vehiculo: Vehiculo;
  // Variable para construir el objeto CaracteristicaVehiculo
  opcion: Opcion;

  constructor(
    private usuarioService: UsuarioService,
    private vehiculoService: VehiculoService,
    private caracteristicaVehiculoService: CaracteristicaVehiculoService,
    private ocupacionService: OcupacionService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) { 
    this.form = this.formBuilder.group({
      placa: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      ano: ['', Validators.required],
      color: ['', Validators.required]
    });
    
  }

  ngOnInit(): void {
    // Usuario logueado
    this.usrCreacion = this.usuarioService.nombreUsuario;
    this.usrModificacion = this.usuarioService.nombreUsuario;
  }

  // Registra un vehiculo con los datos del formulario
  crearVehiculo(): void{

    // Valida si el formulario de fechas dueño esta habilitado
    if (this.formFechas.status=="DISABLED"){
      this.propio = 1;
    }
    else{
      this.propio = 0;
    }
    const vehiculo = new Vehiculo(this.form.value.placa, this.form.value.marca, this.form.value.modelo, this.form.value.ano, this.form.value.color,this.propio,this.estado,this.usrCreacion,this.usrModificacion);
    this.vehiculoService.crear(vehiculo).subscribe(
      data => {
        // Trae el objeto que se inserto en la db para crear la relacion con las ocupaciones
        this.buscarVehiculoPlaca(this.form.value.placa);
        // Mensaje de confirmacion
        this.alertaRespuesta(data.mensaje, 'ok', 'Registrar vehículo');
        // Redirecciona a la lista de vehiculos y recarga las otras rutas para actualizar las listas de vehiculos
        this.router.navigate(['renticar', { outlets: { 'vehiculo': ['vehiculos'], 'alquiler': ['alquileres','carga'], 'recibido': ['recibidos','carga'], 'gasto': ['gastos','carga'] } }]);
      },
      err => {
        console.log(err);
        this.alertaRespuesta(err.error.mensaje, 'fail', 'ERROR');
      }
    );
  }

  // Trae la caracteristica que se acabo de crear
  buscarVehiculoPlaca(placaVehiculo: string): void{
    this.vehiculoService.buscarPlaca(placaVehiculo).subscribe(
      data => {
        this.vehiculo = data;
        // Inserta las opciones del formulario en una lista de Opciones
        this.crearRelacionesCaracteriticasVehiculo();

        // Valida si el vehiculo tiene dueño, si es asi, realiza el calculo de las fechas de ocupacion
        if(this.propio==0){
          this.calcularFechasOcupacion();
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  // Crea una relacion entre un vehiculo y una caracteristica(opcion)
  crearRelacionesCaracteriticasVehiculo(): void{
    const caracteristicaVehiculo: CaracteristicaVehiculo = new CaracteristicaVehiculo(this.vehiculo,this.opcion,this.estado,this.usrCreacion,this.usrModificacion);
    // Recorre el formulario de caracteristicas
    for(let caracteristica of this.formCaracteristicas.controls.caracteristicas.value){
      caracteristicaVehiculo.opcion = caracteristica.opcion;
      this.caracteristicaVehiculoService.crear(caracteristicaVehiculo).subscribe(
        data =>{

        },
        err => {
          console.log(err);
        }
      );
    }
  }

  // Habilita el formulario de agregar fechas de ocupacion para vehiculos con dueño
  habilitarFechas(event): void{

    if(event.checked){
      this.form.controls.ocupacion.enable();
    }
    else{
      this.form.controls.ocupacion.disable();
    }
    
  }

  // Calcula cada una de las fechas individuales que hay en los rangos del formulario de fechas
  calcularFechasOcupacion(){
    // Recorre el formulario 
    for(let fecha of this.formFechas.controls.fechas.value){

      // Realiza el ciclo mientras la fecha inicio sea menor a la fecha fin
      while (fecha.end.getTime() >= fecha.start.getTime()){

        // Recupera una de las fechas para crear la ocupacion con esa fecha
        this.fechaOcupacion = fecha.start;
       
        // Crea la ocupacion
        this.crearOcupacionDueno();
        
        // Aumenta la fecha inicio en +1
        fecha.start.setDate(fecha.start.getDate() + 1);
    
      }
      
    }
  }

  // Crea una ocupacion cuando el vehiculo tiene dueño
  crearOcupacionDueno(): void{
    const ocupacion: Ocupacion = new Ocupacion(this.fechaOcupacion,1,this.vehiculo,this.estado,this.usrCreacion,this.usrModificacion);
    this.ocupacionService.crear(ocupacion).subscribe(
      data => {

      },
      err => {
        console.log(err);
      }
    );
  }

  /**
   * Muestra un pop-up en respuesta al resultado de la consulta, puede ser exitosa o fallida
   * @param mensaje 
   * @param respuesta 
   * @param titulo 
   */
   alertaRespuesta(mensaje: string, respuesta: string, titulo: string): void{
    const dialogRef = this.dialog.open(AlertaRespuestaServicioComponent, {
      // Pasa los parametros al dialogo para ser mostrados en el pop-up
      width: '450px',
      data: {
        mensaje: mensaje,
        respuesta: respuesta,
        titulo: titulo
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


}
