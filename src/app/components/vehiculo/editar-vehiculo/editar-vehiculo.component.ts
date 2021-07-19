import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-editar-vehiculo',
  templateUrl: './editar-vehiculo.component.html',
  styleUrls: ['./editar-vehiculo.component.css']
})
export class EditarVehiculoComponent implements OnInit {

  // Formulario principal de los datos del vehiculo
  form: FormGroup;

  estado = 'ACTIVO';
  usrCreacion = ''; // Usuario que se loguea
  usrModificacion = ''; // Usuario que se loguea

  propio: number;
  // Formulario de las caracteristicas del vehiculo
  formCaracteristicas: FormGroup = this.formBuilder.group({caracteristicas: [{value: '', disabled: true}, Validators.required]});
  // Fromulario para las fechas de ocupacion del dueño
  formFechas: FormGroup = this.formBuilder.group({fechas: [{value: '', disabled: true}, Validators.required]});

  // Vehiculo seleccionado
  vehiculo: Vehiculo;
  idVehiculo: number;

  // Ocupaciones dueño del vehiculo
  ocupaciones: Ocupacion[] =[];
  nuevaListaOcupaciones: Ocupacion[]= [];

  // Caracteristicas del vehiculo
  caracteristicas: CaracteristicaVehiculo[]=[];


  constructor(
    private usuarioService: UsuarioService,
    private vehiculoService: VehiculoService,
    private caracteristicaVehiculoService: CaracteristicaVehiculoService,
    private ocupacionService: OcupacionService,
    private activatedRoute: ActivatedRoute,
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

  get placa() {
    return this.form.get('placa');
  }
  get marca() {
    return this.form.get('marca');
  }
  get modelo() {
    return this.form.get('modelo');
  }
  get ano() {
    return this.form.get('ano');
  }
  get color() {
    return this.form.get('color');
  }


  ngOnInit(): void {
    // Id vehiculo seleccionado
    const id = this.activatedRoute.snapshot.params.id;
    this.idVehiculo = id;
    // Buscar datos del vehiculo
    this.buscarVehiculo(id);
    this.buscarOcupaciones(id);
    this.buscarCaracteristicas(id);    

    // Usuario logueado
    this.usrCreacion = this.usuarioService.nombreUsuario;
    this.usrModificacion = this.usuarioService.nombreUsuario;
  }


  // Trae los datos del vehiculo seleccionado y llena sus datos en el formulario
  buscarVehiculo(idVehiculo: number): void{
    // Busca la caracteristica seleccionada
    this.vehiculoService.buscar(idVehiculo).subscribe(
      data => {
        // Guarda el objeto del resultado de la funcion
        this.vehiculo = data;
        // Agrega datos del vehiculo al formulario       
        this.placa.setValue(this.vehiculo.placa, Validators.required);
        this.marca.setValue(this.vehiculo.marca, Validators.required);
        this.modelo.setValue(this.vehiculo.modelo, Validators.required);
        this.ano.setValue(this.vehiculo.ano, Validators.required);
        this.color.setValue(this.vehiculo.color, Validators.required);
        this.propio = this.vehiculo.propio;
      },
      err => {
        console.log(err.error.mensaje);
      }
    );
  }

  // Busca la lista de ocupaciones del dueño de un vehiculo
  buscarOcupaciones(idVehiculo: number): void{
    this.ocupacionService.listar(idVehiculo).subscribe(
      data => {
        this.ocupaciones = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  //Buscar la lista de caracteristicas del vehiculo
  buscarCaracteristicas(idVehiculo: number) {
    this.caracteristicaVehiculoService.listar(idVehiculo).subscribe(
      data => {
        this.caracteristicas = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  // Actualiza el registro seleccionado con los nuevos datos
  actualizarVehiculo(): void{
    const idVehiculo = this.activatedRoute.snapshot.params.id;
    this.vehiculo.usr_modificacion = this.usrModificacion;
    this.vehiculo.placa = this.form.value.placa;
    this.vehiculo.marca = this.form.value.marca;
    this.vehiculo.modelo = this.form.value.modelo;
    this.vehiculo.ano = this.form.value.ano;
    this.vehiculo.color = this.form.value.color;
    // Valida si el formulario de fechas dueño esta habilitado
    if (this.formFechas.status=="DISABLED"){
      this.propio = 1;      
    }
    else{
      this.propio = 0;
    }
    this.vehiculo.propio = this.propio;
    this.vehiculoService.actualizar(idVehiculo, this.vehiculo).subscribe(
      data => {
        // Valida el status del formulario de ocupaciones
        if (this.formFechas.status=="DISABLED"){
          console.log("entro diables")
          // Si el formulario se deshabilito se eliminan todas las ocupaciones
          this.eliminarOcupaciones(this.ocupaciones);
        }else{
          console.log("entro valid")
          // Desencadena el proceso para actualizar las ocupaciones
          this.quitarFechasLista();
        }
        
        // Desencadena el proceso para actualizar las caracteristicas
        this.compararFormListaCaracteristicas();
        // Mensaje de confirmacion
        this.alertaRespuesta(data.mensaje, 'ok', 'Editar vehículo');
        // Redirecciona a la lista de vehiculos y recarga las otras rutas para actualizar las listas de vehiculos
        this.router.navigate(['renticar', { outlets: { 'vehiculo': ['vehiculos'], 'alquiler': ['alquileres','carga'], 'recibido': ['recibidos','carga'], 'gasto': ['gastos','carga'] } }]);
      },
      err => {
        console.log(err);
        this.alertaRespuesta(err.error.mensaje, 'fail', 'ERROR');
      }
    );
  }

  // Compara las fechas de la lista de Ocupaciones y las del formulario y extrae las que no esten en el formulario
  quitarFechasLista(): void{
    console.log("quitar fechas")
    // Lista de opciones que se borraran
    let listaBorrar: Ocupacion[] = [];

    let i = 0;
    for (let ocupacion of this.ocupaciones) {
      let igual = false;
      for (let ocupacionForm of this.formFechas.value.fechas) {
        // Valida si el id de la ocupacion esta en el formulario y en la lista
        if (ocupacion.id_ocupaciones == ocupacionForm.id) {
          // Bandera para saber que el elemento si esta en ambas listas
          igual = true;
          break;
        }
      }
      // Agrega el objeto a la lista de borrado si la bandera continua false 
      if (!igual) listaBorrar.push(ocupacion);
      // Valida si ya se llego al final de la lista 
      if (i === this.ocupaciones.length - 1) {
        // Se inicia el proceso de eliminado de las opciones que se agregaron a la lista
        console.log("lista para borrar");
        console.log(listaBorrar);
        this.eliminarOcupaciones(listaBorrar);
      }
      i++;
    }
    // Inicia procedo de modificacion y creacion de ocupaciones
    this.insertarOcupaciones();
  }

  // Valida si se agregaron caracteristicas nuevas al vehiculo
  compararFormListaCaracteristicas(): void{
    if(this.formCaracteristicas.value.caracteristicas.length === this.caracteristicas.length){
      this.actualizarCaracteristicas();
    } else{
      console.log(this.formCaracteristicas.controls.caracteristicas.value);
      let caracteristicasNuevas = this.formCaracteristicas.controls.caracteristicas.value.slice(
        this.caracteristicas.length, this.formCaracteristicas.value.caracteristicas.length
      );
      this.crearCaracteristica(caracteristicasNuevas);
      this.actualizarCaracteristicas();
    }
  }

  // Elimina todas las ocupaciones de la lista
  eliminarOcupaciones(lista: Ocupacion[]): void {
    // Recorre la lista de opciones que se quitaron del formulario
    for (let ocupacion of lista) {
      ocupacion.vehiculo = null;
      ocupacion.est_ocupacion = 'INACTIVO';
      ocupacion.usr_modificacion = this.usrModificacion;
      this.ocupacionService.eliminar(ocupacion.id_ocupaciones, ocupacion).subscribe(
        data => {

        },
        err => {
          console.log(err);
        }
      );
    }
  }

  // Inserta las ocupaciones modificadas de los formulario a una nueva lista de ocupaciones
  insertarOcupaciones(): void {
    console.log("insertar fechas fodificadas")
    // Recorre el formulario en el valor fechas, para optener el dia y el id
    for (let fecha of this.formFechas.value.fechas) {
      // Valida si la ocupacion es nueva
      if (fecha.id == 0) {
        // Si la ocupacion es nueva se crea
        this.crearOcupacion(fecha);
      } else {
        // Agrega el objeto a la lista
        this.nuevaListaOcupaciones.push({
          id_ocupaciones: fecha.id,
          fec_ocupacion: fecha.dia,
          ocupacion_dueno: 1,
          vehiculo: this.vehiculo, // Relaciona la ocupacion con el vehiculo
          est_ocupacion: this.estado,
          usr_modificacion: this.usrModificacion
        });
      }

    }
    // Actualiza las ocupaciones que estan en la lista nueva
    this.actualizarOcupaciones();
  }

  // Actualiza las opciones que estan en la lista
  actualizarOcupaciones(): void {
    for (let ocupacion of this.nuevaListaOcupaciones) {
      this.ocupacionService.actualizar(ocupacion.id_ocupaciones, ocupacion).subscribe(
        data => {

        },
        err => {
          console.log(err);
        }
      );
    }

  }

  // Actualiza las caracteristicas que estan en la lista
  actualizarCaracteristicas(): void {
    let i = 0;
    for (let caracteristica of this.caracteristicas) {
      caracteristica.opcion = this.formCaracteristicas.controls.caracteristicas.value[i].opcion;
      this.caracteristicaVehiculoService.actualizar(caracteristica.id_caracteristicas_vehiculos, caracteristica).subscribe(
        data => {
          
        },
        err => {
          console.log(err);
        }
      );
      i++;
    }

  }

  // Crea una ocupacion nueva para ese vehiculo
  crearOcupacion(fecha): void {
    // Construccion del objeto con los atributos para crear la opcion
    const ocupacion: Ocupacion = new Ocupacion(fecha.dia,1,this.vehiculo,this.estado,this.usrCreacion,this.usrModificacion);
    this.ocupacionService.crear(ocupacion).subscribe(
      data => {
        
      },
      err => {
        console.log(err);
      }
    );
  }

  // Crea una relacion caracteristica nueva para ese vehiculo
  crearCaracteristica(caracteristicas): void {

    // Se recorre las opciones nuevas que se agregaron desde el formulario
    for(let caracteristica of caracteristicas){
      // Se construye el objeto
      let caracteristicasVehiculo: CaracteristicaVehiculo = new CaracteristicaVehiculo(
        this.vehiculo,
        caracteristica.opcion,
        this.estado,
        this.usrCreacion,
        this.usrModificacion
      );
      this.caracteristicaVehiculoService.crear(caracteristicasVehiculo).subscribe(
        data => {
          
        },
        err => {
          console.log(err);
        }
      );

    }
    
  }


  /**
   * Muestra un pop-up en respuesta al resultado de la consulta, puede ser exitosa o fallida
   * @param mensaje 
   * @param respuesta 
   * @param titulo 
   */
   alertaRespuesta(mensaje: string, respuesta: string, titulo: string): void {
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
