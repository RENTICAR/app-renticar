import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Alquiler } from 'src/app/models/alquiler';
import { CaracteristicaVehiculo } from 'src/app/models/caracteristica-vehiculo';
import { Cliente } from 'src/app/models/cliente';
import { Ocupacion } from 'src/app/models/ocupacion';
import { Vehiculo } from 'src/app/models/vehiculo';
import { AlquilerService } from 'src/app/services/alquiler.service';
import { CaracteristicaVehiculoService } from 'src/app/services/caracteristica-vehiculo.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { OcupacionService } from 'src/app/services/ocupacion.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VehiculoService } from 'src/app/services/vehiculo.service';
import { AlertaRespuestaServicioComponent } from '../../dialogos/alerta-respuesta-servicio/alerta-respuesta-servicio.component';

@Component({
  selector: 'app-nuevo-alquiler',
  templateUrl: './nuevo-alquiler.component.html',
  styleUrls: ['./nuevo-alquiler.component.css']
})
export class NuevoAlquilerComponent implements OnInit {

  // Id del vehiculo seleccionado
  idVehiculo: number;
  // Vehiculo alquilado
  vehiculo: Vehiculo;
  // Cliente que alquila
  cliente: Cliente;
  // Caracteristicas de un vehiculo
  caracteristicasVehiculos: CaracteristicaVehiculo[] = [];

  // Fechas de alquiler
  fechaInicio: Date;
  fechaFin: Date;
  totalDias: number;
  tarifaDiaria: number;

  estado = 'ACTIVO';
  usrCreacion = ''; // Se debe agregar el usuario que se loguea
  usrModificacion = ''; // Se debe agregar el usuario que se loguea

  // Formulario con los datos del cliente
  formDatosCliente: FormGroup = this.formBuilder.group({ status: ['', Validators.required] });
  // Formulario con el rango de las fechas de alquiler
  formFechas: FormGroup;

  constructor(
    private usuarioService: UsuarioService,
    private alquilerService: AlquilerService,
    private vehiculoService: VehiculoService,
    private clienteService: ClienteService,
    private ocupacionService: OcupacionService,
    private caracteristicaVehiculoService: CaracteristicaVehiculoService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Se recive como parametro el id del vehiculo seleccionado
    const id = this.activatedRoute.snapshot.params.id;
    this.idVehiculo = id;
    // Se recupera el formulario con las fechas de alquiler
    this.formFechas = this.alquilerService.fechasAlquiler;
    // Se guarda el rango de las fechas por separado
    this.fechaInicio = this.formFechas.value.start;
    this.fechaFin = this.formFechas.value.end;

    console.log(this.formFechas.value);

    this.buscarVehiculo();
    this.listarCaracteristicas(id);
    this.calcularTotalDias();

    // Usuario que se logue
    this.usrCreacion = this.usuarioService.nombreUsuario;
    this.usrModificacion = this.usuarioService.nombreUsuario;
  }

  /**
   * Busca un objeto vehiculo por su id
   */
  buscarVehiculo(): void {
    this.vehiculoService.buscar(this.idVehiculo).subscribe(
      data => {
        this.vehiculo = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  /**
   * Trae una lista del las caracteristicas de un vehiculo
   * @param idVehiculo 
   * @returns CaracteristicaVehiculoService[]
   */
  listarCaracteristicas(idVehiculo: number) {

    this.caracteristicaVehiculoService.listar(idVehiculo).subscribe(
      data => {
        this.caracteristicasVehiculos = data;
        this.calculaTarifaDiaria();
      },
      err => {
        console.log(err);
      }
    );
  }

  /**
   * Calcula la tarifa diaria del vehiculo
   */
  calculaTarifaDiaria() {
    this.tarifaDiaria = 0;
    // Calcula la tarifa de cada vehiculo
    for (let caracteristica of this.caracteristicasVehiculos) {
      this.tarifaDiaria = this.tarifaDiaria + caracteristica.opcion.precio;
    }
  }

  // Calcula el numero de dias que hay en el rango del formulario de fecha
  calcularTotalDias() {

    let fechaStart: Date = new Date(this.formFechas.value.start);
    let fechaEnd: Date = new Date(this.formFechas.value.end);

    this.totalDias = 0;
    // Realiza el ciclo mientras la fecha inicio sea menor a la fecha fin
    while (fechaEnd.getTime() >= fechaStart.getTime()) {

      this.totalDias += 1;

      // Aumenta la fecha inicio en +1
      fechaStart.setDate(fechaStart.getDate() + 1);
    }
    console.log(this.totalDias);

  }

  /**
   * Crea el cliente que alquilo el vehiculo
   */
  crearCliente(): void {
    // Construye el objeto
    const cliente: Cliente = new Cliente(
      this.formDatosCliente.value.nombre,
      this.formDatosCliente.value.apellido,
      this.formDatosCliente.value.telefono,
      this.formDatosCliente.value.direccion,
      this.formDatosCliente.value.email,
      this.formDatosCliente.value.documento,
      this.formDatosCliente.value.tipo,
      this.estado,
      this.usrCreacion,
      this.usrModificacion
    );
    // Llama al servicio
    this.clienteService.crear(cliente).subscribe(
      data => {
        // Busca el cliente que fue creado, para crear el aquiler y relacionarlo con el objeto
        this.buscarCliente(cliente.num_documento, cliente.tipoDocumento.id_tipos_documentos);
      },
      err => {
        console.log(err);
      }
    );
  }

  /**
   * Busca el cliente que se inserto en el proceso creacion
   * @param numDocumento 
   * @param idTipoDocumento 
   */
  buscarCliente(numDocumento, idTipoDocumento): void {
    this.clienteService.buscarDocumento(numDocumento, idTipoDocumento).subscribe(
      data => {
        this.cliente = data;        
        this.calcularFechasOcupacion();
        this.crearAlquiler();
      },
      err => {
        console.log(err);
      }
    );
  }

  /**
   * Crea un nuevo alquiler
   */
  crearAlquiler() {
    // Construye el objeto
    const alquiler: Alquiler = new Alquiler(
      this.fechaInicio,
      this.fechaFin,
      this.tarifaDiaria * this.totalDias,
      this.vehiculo,
      this.cliente,
      this.estado,
      this.usrCreacion,
      this.usrModificacion
    );

    // LLama al servicio
    this.alquilerService.crear(alquiler).subscribe(
      data => {
        this.alertaRespuesta(data.mensaje, 'ok', 'Alquilar vehiculo');
        this.router.navigate(['renticar',{outlets: {'alquiler': ['alquileres'], 'recibido': ['recibidos','carga']}}]);
      },
      err => {
        console.log(err);
        this.alertaRespuesta(err.error.mensaje, 'fail', 'ERROR');
      }
    );

  }


  // Calcula cada una de las fechas individuales que hay en los rangos del formulario de fechas
  calcularFechasOcupacion() {
    
    let fechaStart: Date = new Date(this.formFechas.value.start);
    let fechaEnd: Date = new Date(this.formFechas.value.end);

      // Realiza el ciclo mientras la fecha inicio sea menor a la fecha fin
      while (fechaEnd.getTime() >= fechaStart.getTime()) {
        // Recupera una de las fechas para crear la ocupacion con esa fecha
        const fechaOcupacion: Date = fechaStart;
        // Crea la ocupacion
        this.crearOcupacion(fechaOcupacion);

        // Aumenta la fecha inicio en +1
        fechaStart.setDate(fechaStart.getDate() + 1);
      }
  }

  // Crea una ocupacion con la fecha de alquiler
  crearOcupacion(fechaOcupacion): void {
    const ocupacion: Ocupacion = new Ocupacion(fechaOcupacion, 0, this.vehiculo, this.estado, this.usrCreacion, this.usrModificacion);
    this.ocupacionService.crear(ocupacion).subscribe(
      data => {
        console.log(ocupacion);
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
