import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Alquiler } from 'src/app/models/alquiler';
import { Vehiculo } from 'src/app/models/vehiculo';
import { AlquilerService } from 'src/app/services/alquiler.service';
import { VehiculoService } from 'src/app/services/vehiculo.service';
import { AlertaRespuestaServicioComponent } from '../../dialogos/alerta-respuesta-servicio/alerta-respuesta-servicio.component';
import { DetalleAlquilerComponent } from '../../dialogos/detalle-alquiler/detalle-alquiler.component';
import { EliminarVehiculoComponent } from '../../dialogos/eliminar-vehiculo/eliminar-vehiculo.component';

@Component({
  selector: 'app-lista-vehiculo',
  templateUrl: './lista-vehiculo.component.html',
  styleUrls: ['./lista-vehiculo.component.css']
})
export class ListaVehiculoComponent implements OnInit {

  // Lista de Vehiculos
  vehiculos: Vehiculo[] = [];
  // Datos de la tabla
  dataSource = new MatTableDataSource(this.vehiculos);

  usrModificacion ='ELIMINA'; // Se debe agregar el usuario que se loguea

  // Orden de las columnas de la tabla
  displayedColumns: string[] = ['index', 'placa', 'marca', 'modelo', 'ano', 'color', 'propio', 'estado', 'editar', 'eliminar'];

   // Map con los id (key) de cada vehiculo y su tarica por dia (value)
   listaAlquileresVehiculos = new Map();

  constructor(
    private vehiculoService: VehiculoService,
    private alquilerService: AlquilerService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.listarVehiculos();
  }

  // Trae una lista de todas los vehiculos y los carga en el arreglo vehiculos[]
  listarVehiculos(): void{
    this.vehiculoService.listar().subscribe(
      data => {
        this.vehiculos = data;
        this.dataSource = new MatTableDataSource(this.vehiculos);
        this.listarAlquileres();
      },
      err => {
        console.log(err);
      }
    );
  }

  /**
   * Trae la lista de alquileres de cada vehculo si existe
   */
  listarAlquileres(): void{
    for(let vehiculo of this.vehiculos){
      let alquileres: Alquiler[] = [];
      // Llama al servicio
      this.alquilerService.listarVehiculo(vehiculo.id_vehiculos).subscribe(
        data => {
          alquileres = data;
          // Guarda el resultado de la consulta en un map con la key id_vehiculos, solo si no es una lista vacia
          if(alquileres.length>0){
            this.listaAlquileresVehiculos.set(vehiculo.id_vehiculos,alquileres);
          }
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  /**
   * Abre un pop-up que muestra las fechas en las que esta rentado el vehiculo
   * @param idVehiculo 
   */
  detalleAlquiler(idVehiculo: number){
    // Llama al dialogo
    const dialogRef = this.dialog.open(DetalleAlquilerComponent, {
      // Pasa los alquilere al dialogo para ser mostrados en el pop-up
      width: '500px',
      data: this.listaAlquileresVehiculos.get(idVehiculo)
      
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  
  // Muestra una alerta para confimar el proceso de eliminacion
  abrirAlerta(idVehiculo: number, vehiculo: Vehiculo) {
    const dialogRef = this.dialog.open(EliminarVehiculoComponent, {
      data: vehiculo
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if(result){
        this.borrarVehiculo(idVehiculo, vehiculo);
      }
    });
  }

  // Elimina de forma logica el registro en la db
  borrarVehiculo(idVehiculo: number, vehiculo: Vehiculo): void{
    vehiculo.est_vehiculo = 'INACTIVO';
    vehiculo.usr_modificacion = this.usrModificacion;
    this.vehiculoService.eliminar(idVehiculo, vehiculo).subscribe(
      data => {
        // Mensaje de confirmacion
        this.alertaRespuesta(data.mensaje, 'ok', 'Eliminar vehículo');
        // Refresca la lista de caracteriticas
        this.listarVehiculos();
      },
      err => {
        console.log(err);
        this.alertaRespuesta(err.error.mensaje, 'fail', 'ERROR');
      }
    );
  }

  /**
   * Aplica un filtro sobre los datos que se muestran en la tabla
   * @param event 
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
