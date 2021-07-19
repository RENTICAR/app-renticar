import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Alquiler } from 'src/app/models/alquiler';
import { Cliente } from 'src/app/models/cliente';
import { Recibido } from 'src/app/models/recibido';
import { Vehiculo } from 'src/app/models/vehiculo';
import { AlquilerService } from 'src/app/services/alquiler.service';
import { RecibidoService } from 'src/app/services/recibido.service';
import { AlertaRespuestaServicioComponent } from '../../dialogos/alerta-respuesta-servicio/alerta-respuesta-servicio.component';

@Component({
  selector: 'app-nuevo-recibido',
  templateUrl: './nuevo-recibido.component.html',
  styleUrls: ['./nuevo-recibido.component.css']
})
export class NuevoRecibidoComponent implements OnInit {

  form: FormGroup;

  estado = 'ACTIVO';
  usrCreacion = 'ADMINc'; // Se debe agregar el usuario que se loguea
  usrModificacion ='ADMINm'; // Se debe agregar el usuario que se loguea

  // Alquiler seleccionado
  alquiler: Alquiler[] = [];
  // Datos del vehiculo alquilado
  vehiculo: Vehiculo[] = [];
  // Datos del cliente seleccionado
  cliente: Cliente[] = [];

  // Orden de las columnas de la tabla
  displayedColumns: string[] = ['inicio', 'fin', 'tarifa'];

  constructor(
    private alquilerService: AlquilerService,
    private recibidoService: RecibidoService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog
  ) { 
    this.form = this.formBuilder.group({
      novedades: ['', Validators.required],
      satisfaccion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Se recive como parametro el id del alquiler seleccionado
    const id = this.activatedRoute.snapshot.params.id;

    this.buscarAlquiler(id);
  }

  /**
   * Busca el alquiler que fue seleccionado
   * @param idAlquiler 
   */
  buscarAlquiler(idAlquiler: number): void{
    this.alquilerService.buscar(idAlquiler).subscribe(
      data => {
        this.alquiler = [data];
        // Vehiculo alquilado
        this.vehiculo = [this.alquiler[0].vehiculo];
        // Cliente que alquilo el vehiculo
        this.cliente = [this.alquiler[0].cliente];
      },
      err => {
        console.log(err);
      }
    );
  }

  // Crea un registro del recibido de un vehiculo alquilado
  crearRecibido(): void{
    const fecha = new Date;
    const recibido = new Recibido(this.form.value.novedades, this.form.value.satisfaccion, fecha, this.alquiler[0].tarifa, this.alquiler[0],this.estado,this.usrCreacion,this.usrModificacion);
    this.recibidoService.crear(recibido).subscribe(
      data => {
        this.alertaRespuesta(data.mensaje, 'ok', 'Recibir vehiculo');
        this.router.navigate(['renticar',{outlets: {'recibido': ['recibidos']}}]);
      },
      err => {
        console.log(err);
        this.alertaRespuesta(err.error.mensaje, 'fail', 'ERROR');
      }
    );
  }

  // Elimina de forma logica el alquiler en la db
  borrarAlquiler(alquiler: Alquiler): void{
    alquiler.est_alquiler = 'INACTIVO';
    alquiler.usr_modificacion = this.usrModificacion;
    this.alquilerService.eliminar(alquiler.id_alquileres, alquiler).subscribe(
      data => {
        this.router.navigate(['',{outlets: {'recibido': ['recibidos']}}]);
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
