import { Component, Input, OnInit } from '@angular/core';
import { CaracteristicaVehiculo } from 'src/app/models/caracteristica-vehiculo';
import { CaracteristicaVehiculoService } from 'src/app/services/caracteristica-vehiculo.service';

@Component({
  selector: 'app-datos-caracteristicas',
  templateUrl: './datos-caracteristicas.component.html',
  styleUrls: ['./datos-caracteristicas.component.css']
})
export class DatosCaracteristicasComponent implements OnInit {

  @Input() idVehiculo: number;

  caracteristicasVehiculos: CaracteristicaVehiculo[] = [];

  // Orden de las columnas de la tabla
  displayedColumns: string[] = ['index', 'caracteristica', 'opcion'];

  constructor(
    private caracteristicaVehiculoService: CaracteristicaVehiculoService
  ) { }

  ngOnInit(): void {
    this.listarCaracteristicas();
  }

  listarCaracteristicas(){
    this.caracteristicaVehiculoService.listar(this.idVehiculo).subscribe(
      data => {
        this.caracteristicasVehiculos = data;
      },
      err => {
        console.log(err);
      }
    );
  }

}
