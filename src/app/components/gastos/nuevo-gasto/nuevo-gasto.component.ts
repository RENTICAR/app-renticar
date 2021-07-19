import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Gasto } from 'src/app/models/gasto';
import { Vehiculo } from 'src/app/models/vehiculo';
import { GastoService } from 'src/app/services/gasto.service';
import { VehiculoService } from 'src/app/services/vehiculo.service';
import { AlertaRespuestaServicioComponent } from '../../dialogos/alerta-respuesta-servicio/alerta-respuesta-servicio.component';

@Component({
  selector: 'app-nuevo-gasto',
  templateUrl: './nuevo-gasto.component.html',
  styleUrls: ['./nuevo-gasto.component.css']
})
export class NuevoGastoComponent implements OnInit {

  // Inicializar el objeto que se mostrara en el html
  vehiculo: Vehiculo[]=[];
  
  estado = 'ACTIVO';
  usrCreacion = ''; // Se debe agregar el usuario que se loguea
  usrModificacion = ''; // Se debe agregar el usuario que se loguea

  // Formulario con los datos del cliente
  formGastos: FormGroup = this.formBuilder.group({ status: ['', Validators.required] });
  
  constructor(
    private vehiculoService: VehiculoService,
    private gastoService: GastoService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // Id del vehiculo seleccionado
    const id = this.activatedRoute.snapshot.params.id;

    this.buscarVehiculo(id);
  }

  /**
   * Busca el vehiculo seleccionado
   * @param idVehiculo 
   */
  buscarVehiculo(idVehiculo: number): void{
    this.vehiculoService.buscar(idVehiculo).subscribe(
      data => {
        this.vehiculo = [data];
      },
      err => {
        console.log(err);
      }
    );
  }

  /**
   * Crea cada uno de los gastos que hay en el formulario
   */  
  crearGasto(): void{
    // Se recorre el formulario de gastos por cada tipo de gasto
    for (let gasto of this.formGastos.value.gastos){
      console.log(gasto);
      const gastoVehiculo = new Gasto(gasto.tipo,gasto.costo,gasto.fecha,this.vehiculo[0],this.estado,this.usrCreacion,this.usrModificacion);
      this.gastoService.crear(gastoVehiculo).subscribe(
        data => {
          // Mensaje de confirmacion
          this.alertaRespuesta(data.mensaje, 'ok', 'Agregar gastos');
        // Redirecciona a la lista de vehiculos con gastos
          this.router.navigate(['renticar',{outlets: {'gasto': ['gastos']}}]);
        },
        err => {
          console.log(err);
          this.alertaRespuesta(err.error.mensaje, 'fail', 'ERROR');
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
