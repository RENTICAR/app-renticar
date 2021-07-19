import { Component, Input, OnInit } from '@angular/core';
import { Vehiculo } from 'src/app/models/vehiculo';
import { AlquilerService } from 'src/app/services/alquiler.service';
import { VehiculoService } from 'src/app/services/vehiculo.service';

@Component({
  selector: 'app-datos-vehiculo',
  templateUrl: './datos-vehiculo.component.html',
  styleUrls: ['./datos-vehiculo.component.css']
})
export class DatosVehiculoComponent implements OnInit {

  @Input() idVehiculo: number;

  vehiculo: Vehiculo[] =[];
  fechaInicio: Date;
  fechaFin: Date;
  @Input() totalDias: number;
  @Input() tarifaDiaria: number;

  // Orden de las columnas de la tabla
  displayedColumns: string[] = ['fechas', 'placa', 'marca', 'modelo', 'ano', 'color', 'tarifa'];


  constructor(
    private vehiculoService: VehiculoService,
    public alquilerService: AlquilerService
  ) { }

  ngOnInit(): void {
    this.buscarVehiculo();
    this.fechaInicio = this.alquilerService.fechasAlquiler.value.start;
    this.fechaFin = this.alquilerService.fechasAlquiler.value.end;
  }

  buscarVehiculo(): void{
    this.vehiculoService.buscar(this.idVehiculo).subscribe(
      data => {
        this.vehiculo = [data];
        console.log(this.vehiculo);
      },
      err => {
        console.log(err);
      }
    );
  }

}
